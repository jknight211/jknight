import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { X, Save, GraduationCap, Briefcase, Wrench, ChevronDown, Sparkles, ArrowDown } from 'lucide-react';
import { POLYTECHNICS, POLY_COURSES, ITE_COURSES, JC_LIST } from '../../lib/coursesData';

interface PathwaySelectorProps {
  onClose: () => void;
  onSave: () => void;
  polyOnly?: boolean;
}

export function PathwaySelector({ onClose, onSave, polyOnly = false }: PathwaySelectorProps) {
  const { user } = useAuth();
  const [pathwayType, setPathwayType] = useState<'JC' | 'Polytechnic' | 'ITE' | null>(polyOnly ? 'Polytechnic' : null);
  const [institution, setInstitution] = useState('');
  const [course, setCourse] = useState('');
  const [saving, setSaving] = useState(false);
  const [subjects, setSubjects] = useState<Array<{ subject: string; grade: string }>>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    if (!user) return;

    try {
      if (polyOnly) {
        const { data } = await supabase
          .from('academic_records')
          .select('*')
          .eq('student_id', user.id);

        if (data) {
          setSubjects(data.map(d => ({ subject: d.subject_name, grade: d.grade || 'A1' })));
        }
      } else {
        const { data } = await supabase
          .from('academic_records')
          .select('*')
          .eq('student_id', user.id)
          .eq('exam_type', 'Secondary School');

        if (data) {
          setSubjects(data.map(d => ({ subject: d.subject_name, grade: d.grade || 'A1' })));
        }
      }
    } catch (error) {
      console.error('Error loading subjects:', error);
    }
  };

  const getRecommendations = () => {
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
      .slice(0, 10);

    const iteRecs = ITE_COURSES.map(course => {
      const matchingSubjects = course.subjects?.filter(s => subjectNames.includes(s)) || [];
      const missingSubjects = course.subjects?.filter(s => !subjectNames.includes(s)) || [];
      const score = matchingSubjects.length * 100 / (course.subjects?.length || 1);
      return { ...course, score, matchingSubjects, missingSubjects };
    }).filter(c => c.score > 20 && avgScore >= 5)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return { poly: polyRecs, ite: iteRecs };
  };

  const recommendations = getRecommendations();

  const handleSave = async () => {
    if (!user || !pathwayType || !institution) return;

    setSaving(true);
    try {
      if (polyOnly) {
        const { data: existingPathway } = await supabase
          .from('student_pathways')
          .select('*')
          .eq('student_id', user.id)
          .maybeSingle();

        if (existingPathway) {
          await supabase
            .from('student_pathways')
            .update({
              pathway_type: pathwayType,
              institution_name: institution,
              course_name: course || null,
              ite_course_name: existingPathway.course_name,
            })
            .eq('student_id', user.id);
        }

        await supabase.from('students').update({
          current_level: 'Polytechnic Year 1',
        }).eq('id', user.id);
      } else {
        await supabase.from('student_pathways').delete().eq('student_id', user.id);

        await supabase.from('student_pathways').insert({
          student_id: user.id,
          pathway_type: pathwayType,
          institution_name: institution,
          course_name: course || null,
        });

        const newLevel = pathwayType === 'JC' ? 'JC 1' : pathwayType === 'Polytechnic' ? 'Polytechnic Year 1' : 'ITE Year 1';

        await supabase.from('students').update({
          current_level: newLevel,
          pathway_completed: true,
        }).eq('id', user.id);
      }

      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving pathway:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 to-blue-900 border-2 border-cyan-500/50 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-cyan-500/50 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Choose Your Path</h2>
            <p className="text-sm text-cyan-400 mt-1">Select your post-secondary education pathway</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {subjects.length > 0 && (recommendations.poly.length > 0 || recommendations.ite.length > 0) && (
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-2 border-purple-400/70 rounded-2xl p-5 mb-6 shadow-2xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Personalized Recommendations</h3>
                  <p className="text-sm text-purple-200">Based on your Sec 1-4 subjects</p>
                </div>
              </div>

              <button
                onClick={() => setShowRecommendations(!showRecommendations)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-between shadow-lg"
              >
                <span>View {recommendations.poly.length + recommendations.ite.length} Course Matches</span>
                <ChevronDown className={`w-5 h-5 transition-transform ${showRecommendations ? 'rotate-180' : ''}`} />
              </button>

              {showRecommendations && (
                <div className="mt-6 space-y-6 max-h-96 overflow-y-auto">
                  {recommendations.poly.length > 0 && (
                    <div>
                      <div className="font-bold text-cyan-400 mb-3 flex items-center space-x-2 sticky top-0 bg-slate-900/95 py-2 rounded">
                        <GraduationCap className="w-5 h-5" />
                        <span>Polytechnic Recommendations</span>
                      </div>
                      <div className="space-y-3">
                        {recommendations.poly.map((rec) => (
                          <div
                            key={rec.name}
                            onClick={() => {
                              setPathwayType('Polytechnic');
                              setCourse(rec.name);
                              setShowRecommendations(false);
                            }}
                            className="bg-slate-800/80 border border-cyan-500/40 rounded-lg p-4 hover:border-cyan-400 hover:bg-slate-800 cursor-pointer transition"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="font-bold text-white text-base">Diploma in {rec.name}</div>
                                {rec.poly && (
                                  <div className="text-xs text-blue-400 mt-1 font-semibold">
                                    📍 School of {rec.category} @ {Array.isArray(rec.poly) ? rec.poly[0] : rec.poly}
                                    {Array.isArray(rec.poly) && rec.poly.length > 1 && (
                                      <span className="text-cyan-300"> (+{rec.poly.length - 1} more)</span>
                                    )}
                                  </div>
                                )}
                                <div className="text-xs text-slate-400 mt-1">{rec.category}</div>
                              </div>
                              <div className="px-3 py-1.5 bg-green-500/20 rounded-lg text-xs font-bold text-green-300 border border-green-500/30">
                                {Math.round(rec.score)}% Match
                              </div>
                            </div>

                            <div className="flex items-start gap-3 mt-3 text-xs">
                              <div className="flex-1">
                                <div className="text-green-400 font-semibold mb-1">✓ You Have:</div>
                                <div className="text-slate-300">{rec.matchingSubjects.join(', ') || 'None'}</div>
                              </div>
                              {rec.missingSubjects.length > 0 && (
                                <div className="flex-1">
                                  <div className="text-orange-400 font-semibold mb-1">⚠ Missing:</div>
                                  <div className="text-slate-300">{rec.missingSubjects.join(', ')}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {recommendations.ite.length > 0 && (
                    <div>
                      <div className="font-bold text-orange-400 mb-3 flex items-center space-x-2 sticky top-0 bg-slate-900/95 py-2 rounded">
                        <Wrench className="w-5 h-5" />
                        <span>ITE Recommendations</span>
                      </div>
                      <div className="space-y-3">
                        {recommendations.ite.map((rec) => (
                          <div
                            key={rec.name}
                            onClick={() => {
                              setPathwayType('ITE');
                              setCourse(rec.name);
                              setShowRecommendations(false);
                            }}
                            className="bg-slate-800/80 border border-orange-500/40 rounded-lg p-4 hover:border-orange-400 hover:bg-slate-800 cursor-pointer transition"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="font-bold text-white text-base">Higher Nitec in {rec.name}</div>
                                <div className="text-xs text-orange-300 mt-1">{rec.category}</div>
                                <div className="text-xs text-blue-400 mt-2 font-semibold">
                                  📍 ITE College Central, East, West
                                </div>
                              </div>
                              <div className="px-3 py-1.5 bg-green-500/20 rounded-lg text-xs font-bold text-green-300 border border-green-500/30">
                                {Math.round(rec.score)}% Match
                              </div>
                            </div>

                            <div className="flex items-start gap-3 mt-3 text-xs">
                              <div className="flex-1">
                                <div className="text-green-400 font-semibold mb-1">✓ You Have:</div>
                                <div className="text-slate-300">{rec.matchingSubjects.join(', ') || 'None'}</div>
                              </div>
                              {rec.missingSubjects.length > 0 && (
                                <div className="flex-1">
                                  <div className="text-orange-400 font-semibold mb-1">⚠ Missing:</div>
                                  <div className="text-slate-300">{rec.missingSubjects.join(', ')}</div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!polyOnly && (
            <div>
              <h3 className="font-semibold text-white mb-4">Or Choose Manually</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => { setPathwayType('JC'); setInstitution(''); setCourse(''); }}
                  className={`p-6 rounded-2xl border-2 transition transform hover:scale-105 ${
                    pathwayType === 'JC'
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-600 border-cyan-400 shadow-xl'
                      : 'bg-slate-900/50 border-slate-700 hover:border-cyan-500/50'
                  }`}
                >
                  <GraduationCap className={`w-12 h-12 mx-auto mb-3 ${pathwayType === 'JC' ? 'text-white' : 'text-cyan-400'}`} />
                  <div className={`font-bold text-lg ${pathwayType === 'JC' ? 'text-white' : 'text-slate-300'}`}>
                    Junior College
                  </div>
                  <div className={`text-sm mt-2 ${pathwayType === 'JC' ? 'text-cyan-100' : 'text-slate-500'}`}>
                    2 years • A-Levels
                  </div>
                </button>

                <button
                  onClick={() => { setPathwayType('Polytechnic'); setInstitution(''); setCourse(''); }}
                  className={`p-6 rounded-2xl border-2 transition transform hover:scale-105 ${
                    pathwayType === 'Polytechnic'
                      ? 'bg-gradient-to-br from-blue-600 to-cyan-600 border-cyan-400 shadow-xl'
                      : 'bg-slate-900/50 border-slate-700 hover:border-cyan-500/50'
                  }`}
                >
                  <Briefcase className={`w-12 h-12 mx-auto mb-3 ${pathwayType === 'Polytechnic' ? 'text-white' : 'text-cyan-400'}`} />
                  <div className={`font-bold text-lg ${pathwayType === 'Polytechnic' ? 'text-white' : 'text-slate-300'}`}>
                    Polytechnic
                  </div>
                  <div className={`text-sm mt-2 ${pathwayType === 'Polytechnic' ? 'text-cyan-100' : 'text-slate-500'}`}>
                    3 years • Diploma
                  </div>
                </button>

                <button
                  onClick={() => { setPathwayType('ITE'); setInstitution(''); setCourse(''); }}
                  className={`p-6 rounded-2xl border-2 transition transform hover:scale-105 ${
                    pathwayType === 'ITE'
                      ? 'bg-gradient-to-br from-orange-600 to-red-600 border-orange-400 shadow-xl'
                      : 'bg-slate-900/50 border-slate-700 hover:border-orange-500/50'
                  }`}
                >
                  <Wrench className={`w-12 h-12 mx-auto mb-3 ${pathwayType === 'ITE' ? 'text-white' : 'text-orange-400'}`} />
                  <div className={`font-bold text-lg ${pathwayType === 'ITE' ? 'text-white' : 'text-slate-300'}`}>
                    ITE
                  </div>
                  <div className={`text-sm mt-2 ${pathwayType === 'ITE' ? 'text-orange-100' : 'text-slate-500'}`}>
                    2-3 years • Higher Nitec
                  </div>
                </button>
              </div>
            </div>
          )}

          {polyOnly && (
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl p-6 text-center">
              <Briefcase className="w-16 h-16 text-white mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-white mb-2">Choose Your Polytechnic Course</h3>
              <p className="text-cyan-100">Select your polytechnic and course based on your ITE studies</p>
            </div>
          )}

          {pathwayType && (
            <div className="space-y-4 animate-in fade-in duration-500">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Select Institution
                </label>
                <select
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="">Choose...</option>
                  {pathwayType === 'JC' && JC_LIST.map(jc => (
                    <option key={jc} value={jc}>{jc}</option>
                  ))}
                  {pathwayType === 'Polytechnic' && POLYTECHNICS.map(poly => (
                    <option key={poly} value={poly}>{poly}</option>
                  ))}
                  {pathwayType === 'ITE' && ['ITE College Central', 'ITE College East', 'ITE College West'].map(ite => (
                    <option key={ite} value={ite}>{ite}</option>
                  ))}
                </select>
              </div>

              {pathwayType !== 'JC' && institution && (
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Select Course {pathwayType === 'Polytechnic' ? '(Diploma)' : '(Higher Nitec)'}
                  </label>
                  <select
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-cyan-500 max-h-64"
                  >
                    <option value="">Choose course...</option>
                    {pathwayType === 'Polytechnic' && POLY_COURSES.filter(c => {
                      const polyCode = institution.match(/\(([^)]+)\)/)?.[1];
                      return c.poly.includes(polyCode || '');
                    }).map(c => (
                      <option key={c.code} value={c.name}>{c.code} - {c.name}</option>
                    ))}
                    {pathwayType === 'ITE' && ITE_COURSES.map(c => (
                      <option key={c.name} value={c.name}>{c.name} ({c.category})</option>
                    ))}
                  </select>
                  {pathwayType === 'Polytechnic' && institution && POLY_COURSES.filter(c => {
                    const polyCode = institution.match(/\(([^)]+)\)/)?.[1];
                    return c.poly.includes(polyCode || '');
                  }).length === 0 && (
                    <p className="text-sm text-red-400 mt-2">No courses found for this polytechnic. Please contact support.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-xl border-t border-cyan-500/50 p-6 flex space-x-3">
          <button
            onClick={handleSave}
            disabled={saving || !pathwayType || !institution || (pathwayType !== 'JC' && !course)}
            className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'Saving...' : 'Save Pathway'}</span>
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
