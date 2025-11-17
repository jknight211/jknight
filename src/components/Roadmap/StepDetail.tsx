import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { X, Save, Plus, Trash2, ChevronDown, Briefcase, DollarSign, TrendingUp } from 'lucide-react';
import { SECONDARY_SUBJECTS, JC_SUBJECTS, POLY_COURSES, ITE_COURSES, CAREER_PREDICTIONS } from '../../lib/coursesData';

interface StepDetailProps {
  step: { id: string; title: string; level: string };
  onClose: () => void;
  onSave: () => void;
}

const GRADES = ['A1', 'A2', 'B3', 'B4', 'C5', 'C6', 'D7', 'E8', 'F9'];

export function StepDetail({ step, onClose, onSave }: StepDetailProps) {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<Array<{ subject: string; grade: string }>>([]);
  const [newSubject, setNewSubject] = useState('');
  const [newGrade, setNewGrade] = useState('A1');
  const [saving, setSaving] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    loadStepData();
  }, [step.id]);

  const loadStepData = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('academic_records')
        .select('*')
        .eq('student_id', user.id)
        .eq('exam_type', step.level);

      if (data) {
        setSubjects(data.map(d => ({ subject: d.subject_name, grade: d.grade || 'A1' })));
      }

      const { data: pathwayData } = await supabase
        .from('student_pathways')
        .select('course_name')
        .eq('student_id', user.id)
        .maybeSingle();

      if (pathwayData) {
        setSelectedCourse(pathwayData.course_name || '');
      }
    } catch (error) {
      console.error('Error loading step data:', error);
    }
  };

  const addSubject = () => {
    if (newSubject && !subjects.find(s => s.subject === newSubject)) {
      setSubjects([...subjects, { subject: newSubject, grade: newGrade }]);
      setNewSubject('');
      setNewGrade('A1');
    }
  };

  const removeSubject = (subject: string) => {
    setSubjects(subjects.filter(s => s.subject !== subject));
  };

  const updateGrade = (subject: string, grade: string) => {
    setSubjects(subjects.map(s => s.subject === subject ? { ...s, grade } : s));
  };

  const getRecommendedCourses = () => {
    if (subjects.length === 0) return { poly: [], ite: [] };

    const subjectNames = subjects.map(s => s.subject);
    const scores = subjects.map(s => parseInt(s.grade.replace(/\D/g, '')));
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;

    const polyRecs = POLY_COURSES.map(course => {
      const matchingSubjects = course.subjects?.filter(s => subjectNames.includes(s)) || [];
      const missingSubjects = course.subjects?.filter(s => !subjectNames.includes(s)) || [];
      const score = matchingSubjects.length * 100 / (course.subjects?.length || 1);
      return { ...course, score, matchingSubjects, missingSubjects };
    }).filter(c => c.score > 30 && avgScore <= 6)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    const iteRecs = ITE_COURSES.map(course => {
      const matchingSubjects = course.subjects?.filter(s => subjectNames.includes(s)) || [];
      const missingSubjects = course.subjects?.filter(s => !subjectNames.includes(s)) || [];
      const score = matchingSubjects.length * 100 / (course.subjects?.length || 1);
      return { ...course, score, matchingSubjects, missingSubjects };
    }).filter(c => c.score > 20 && avgScore >= 5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);

    return { poly: polyRecs, ite: iteRecs };
  };

  const getJobPredictions = () => {
    if (!selectedCourse) return null;
    return CAREER_PREDICTIONS.find(p => p.course === selectedCourse);
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      await supabase
        .from('academic_records')
        .delete()
        .eq('student_id', user.id)
        .eq('exam_type', step.level);

      for (const subject of subjects) {
        await supabase
          .from('academic_records')
          .insert({
            student_id: user.id,
            subject_name: subject.subject,
            grade: subject.grade,
            exam_type: step.level,
            year: new Date().getFullYear(),
          });
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving:', error);
    } finally {
      setSaving(false);
    }
  };

  const recommendations = getRecommendedCourses();
  const jobPredictions = getJobPredictions();
  const isSecondary = step.id.startsWith('s');
  const isJC = step.id.startsWith('jc');
  const isPoly = step.id.startsWith('poly');
  const isITE = step.id.startsWith('ite');

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 to-blue-900 border-2 border-cyan-500/50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-cyan-500/50 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{step.title}</h2>
            <p className="text-sm text-cyan-400 mt-1">
              {isSecondary && 'Add your subjects and grades for this year'}
              {isJC && 'Add your JC subjects and grades'}
              {isPoly && 'Add your polytechnic progress'}
              {isITE && 'Add your ITE progress'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {selectedCourse && (isPoly || isITE) && (
            <div className="bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-2 border-cyan-400/70 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <Briefcase className="w-6 h-6 text-cyan-400" />
                <div>
                  <div className="text-sm text-cyan-400 font-semibold">Your Course</div>
                  <div className="text-lg font-bold text-white">
                    {isPoly && `Diploma in ${selectedCourse}`}
                    {isITE && `Higher Nitec in ${selectedCourse}`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {(isPoly || isJC) && jobPredictions && (
            <div className="bg-green-900/30 border border-green-500/30 rounded-xl p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Briefcase className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-green-300 text-lg">Career Opportunities</h3>
              </div>

              <div className="space-y-3">
                {jobPredictions.jobs.map((job) => (
                  <div key={job.title} className="bg-slate-800/50 border border-green-500/30 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-bold text-white">{job.title}</div>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <div className="flex items-center space-x-1 text-green-400">
                            <DollarSign className="w-4 h-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-blue-400">
                            <TrendingUp className="w-4 h-4" />
                            <span>{job.growth}</span>
                          </div>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        job.demand === 'Very High' ? 'bg-green-500/20 text-green-300' :
                        job.demand === 'High' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {job.demand}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-slate-900/50 border border-cyan-500/30 rounded-xl p-4">
            <h3 className="font-semibold text-white mb-4">Add Subject</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="col-span-1 md:col-span-2 px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
              >
                <option value="">Select subject</option>
                {isJC ? JC_SUBJECTS.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                )) : SECONDARY_SUBJECTS.map(sub => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>

              <select
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
              >
                {GRADES.map(grade => (
                  <option key={grade} value={grade}>{grade}</option>
                ))}
              </select>
            </div>

            <button
              onClick={addSubject}
              disabled={!newSubject}
              className="mt-3 w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Subject</span>
            </button>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Your Subjects</h3>
            {subjects.length === 0 ? (
              <div className="text-center py-8 text-slate-400 bg-slate-900/30 border border-slate-700 rounded-xl">
                No subjects added yet
              </div>
            ) : (
              <div className="space-y-3">
                {subjects.map((subject) => (
                  <div
                    key={subject.subject}
                    className="flex items-center justify-between p-4 bg-slate-900/50 border border-cyan-500/30 rounded-xl"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-white">{subject.subject}</div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <select
                        value={subject.grade}
                        onChange={(e) => updateGrade(subject.subject, e.target.value)}
                        className="px-3 py-1.5 bg-slate-800 border border-slate-600 rounded-lg text-white text-sm focus:ring-2 focus:ring-cyan-500"
                      >
                        {GRADES.map(grade => (
                          <option key={grade} value={grade}>{grade}</option>
                        ))}
                      </select>

                      <button
                        onClick={() => removeSubject(subject.subject)}
                        className="text-slate-400 hover:text-red-400 transition p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-cyan-500/50 p-6 flex space-x-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save Progress'}</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
