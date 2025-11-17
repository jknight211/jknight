import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { X, Sparkles, Briefcase, TrendingUp, Target, DollarSign, GraduationCap, BookOpen } from 'lucide-react';
import { Avatar3D } from '../Avatar/Avatar3D';
import { CAREER_PREDICTIONS } from '../../lib/coursesData';

interface CareerPredictionProps {
  onClose: () => void;
}

interface CareerMatch {
  title: string;
  match: number;
  description: string;
  skills: string[];
  icon: string;
  salary?: string;
}

export function CareerPrediction({ onClose }: CareerPredictionProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [careers, setCareers] = useState<CareerMatch[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [courseName, setCourseName] = useState('');
  const [pathwayType, setPathwayType] = useState('');
  const [avatarPrefs, setAvatarPrefs] = useState({
    skinColor: '#FFD6A5',
    hairColor: '#4A2C2A',
    shirtColor: '#3B82F6',
    emotion: 'excited' as const
  });

  useEffect(() => {
    analyzeCareers();
  }, []);

  const analyzeCareers = async () => {
    if (!user) return;

    setLoading(true);

    try {
      const { data: profile } = await supabase
        .from('students')
        .select('avatar_preferences')
        .eq('id', user.id)
        .maybeSingle();

      if (profile?.avatar_preferences) {
        setAvatarPrefs({ ...profile.avatar_preferences, emotion: 'excited' });
      }

      const { data: pathway } = await supabase
        .from('student_pathways')
        .select('*')
        .eq('student_id', user.id)
        .maybeSingle();

      if (pathway) {
        if (pathway.ite_course_name && pathway.course_name) {
          setCourseName(`${pathway.ite_course_name} → ${pathway.course_name}`);
        } else {
          setCourseName(pathway.course_name || '');
        }
        setPathwayType(pathway.pathway_type || '');
      }

      const { data: records } = await supabase
        .from('academic_records')
        .select('*')
        .eq('student_id', user.id);

      const uniqueSubjects = Array.from(new Set(records?.map(r => r.subject_name) || []));
      setSubjects(uniqueSubjects);

      const subjectScores: Record<string, number[]> = {};
      records?.forEach(record => {
        if (!subjectScores[record.subject_name]) {
          subjectScores[record.subject_name] = [];
        }
        const gradePoints: Record<string, number> = {
          'A1': 90, 'A2': 85, 'B3': 80, 'B4': 75, 'C5': 70, 'C6': 65,
          'D7': 60, 'E8': 55, 'F9': 50, 'A': 85, 'B': 75, 'C': 65, 'D': 55, 'F': 40
        };
        if (record.grade && gradePoints[record.grade]) {
          subjectScores[record.subject_name].push(gradePoints[record.grade]);
        }
      });

      const avgScores: Record<string, number> = {};
      Object.keys(subjectScores).forEach(subject => {
        const scores = subjectScores[subject];
        avgScores[subject] = scores.reduce((a, b) => a + b, 0) / scores.length;
      });

      let predictedCareers: CareerMatch[] = [];

      if (courseName && pathway) {
        const courses = pathway.ite_course_name && pathway.course_name
          ? [pathway.ite_course_name, pathway.course_name]
          : [courseName];

        const allCareers: CareerMatch[] = [];
        courses.forEach(course => {
          const careerData = CAREER_PREDICTIONS.find(c => c.course === course);
          if (careerData) {
            careerData.jobs.forEach(career => {
              if (!allCareers.find(c => c.title === career.title)) {
                allCareers.push({
                  title: career.title,
                  match: career.demand === 'Very High' ? 95 : career.demand === 'High' ? 85 : career.demand === 'Medium' ? 70 : 60,
                  description: `Growth: ${career.growth}`,
                  skills: [],
                  icon: career.title.includes('Engineer') ? '⚙️' : career.title.includes('Software') ? '💻' : career.title.includes('Data') ? '📊' : career.title.includes('Business') ? '📈' : career.title.includes('Health') ? '⚕️' : '💼',
                  salary: career.salary
                });
              }
            });
          }
        });
        predictedCareers = allCareers;
      }

      if (predictedCareers.length === 0) {
        const mathScore = avgScores['Mathematics'] || 70;
        const scienceScore = (avgScores['Physics'] || avgScores['Chemistry'] || avgScores['Biology'] || avgScores['Science'] || 70);
        const languageScore = avgScores['English Language'] || avgScores['English'] || 70;
        const computingScore = avgScores['Computer Applications'] || avgScores['Computing'] || 0;

        if (computingScore > 75 || mathScore > 80) {
          predictedCareers.push({
            title: 'Software Engineer',
            match: Math.round((computingScore * 0.4 + mathScore * 0.4 + scienceScore * 0.2)),
            description: 'Design and develop software applications',
            skills: ['Programming', 'Problem Solving'],
            icon: '💻',
            salary: '$4,500 - $7,000'
          });
        }

        if (scienceScore > 75 && mathScore > 75) {
          predictedCareers.push({
            title: 'Data Scientist',
            match: Math.round((mathScore * 0.5 + scienceScore * 0.3 + computingScore * 0.2)),
            description: 'Analyze complex data for insights',
            skills: ['Statistics', 'Programming'],
            icon: '📊',
            salary: '$5,000 - $8,000'
          });
        }

        if (mathScore > 75 || scienceScore > 75) {
          predictedCareers.push({
            title: 'Engineer',
            match: Math.round((mathScore * 0.5 + scienceScore * 0.5)),
            description: 'Apply scientific principles to solve problems',
            skills: ['Mathematics', 'Physics'],
            icon: '⚙️',
            salary: '$4,000 - $6,500'
          });
        }

        if (scienceScore > 70) {
          predictedCareers.push({
            title: 'Healthcare Professional',
            match: Math.round((scienceScore * 0.6 + mathScore * 0.2 + languageScore * 0.2)),
            description: 'Provide medical care and support',
            skills: ['Biology', 'Chemistry'],
            icon: '⚕️',
            salary: '$3,800 - $6,000'
          });
        }

        predictedCareers.push({
          title: 'Business Analyst',
          match: Math.round((mathScore * 0.3 + languageScore * 0.4 + scienceScore * 0.3)),
          description: 'Help businesses make data-driven decisions',
          skills: ['Analysis', 'Communication'],
          icon: '📈',
          salary: '$4,200 - $6,800'
        });
      }

      predictedCareers.sort((a, b) => b.match - a.match);

      setCareers(predictedCareers.slice(0, 5));
    } catch (error) {
      console.error('Error analyzing careers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-slate-800 to-blue-900 border border-cyan-500/50 rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-cyan-500/50 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">AI Career Prediction</h2>
              <p className="text-sm text-cyan-400">Your perfect career matches</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-white font-semibold">Analyzing your academic journey...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <div className="bg-slate-900/50 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 sticky top-24">
                  <div className="text-center mb-4">
                    <div className="text-sm font-semibold text-cyan-400 mb-2">YOUR AI TWIN</div>
                    <div className="h-64 bg-gradient-to-br from-slate-900 to-blue-900 rounded-xl overflow-hidden border border-cyan-500/30">
                      <Avatar3D {...avatarPrefs} autoRotate />
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    {courseName && (
                      <div className="p-4 bg-blue-900/40 rounded-xl border border-blue-500/40">
                        <div className="flex items-center space-x-2 text-blue-300 mb-2">
                          <GraduationCap className="w-4 h-4" />
                          <div className="text-xs font-bold">YOUR COURSE</div>
                        </div>
                        <div className="text-sm font-semibold text-white">{courseName}</div>
                        <div className="text-xs text-blue-200 mt-1">{pathwayType}</div>
                      </div>
                    )}

                    {subjects.length > 0 && (
                      <div className="p-4 bg-purple-900/40 rounded-xl border border-purple-500/40">
                        <div className="flex items-center space-x-2 text-purple-300 mb-2">
                          <BookOpen className="w-4 h-4" />
                          <div className="text-xs font-bold">YOUR SUBJECTS</div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {subjects.slice(0, 8).map(subject => (
                            <span key={subject} className="px-2 py-0.5 bg-purple-500/20 text-purple-200 text-xs rounded">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="p-4 bg-slate-900/70 rounded-xl border border-cyan-500/30">
                      <div className="text-xs text-cyan-400 mb-2">ANALYSIS COMPLETE</div>
                      <div className="text-lg font-bold text-white">Top {careers.length} Career Matches</div>
                      <div className="text-xs text-slate-400 mt-2">Based on your path and subjects</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6 mb-6">
                  <div className="flex items-center space-x-3 mb-2">
                    <Target className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-xl font-bold text-white">Career Recommendations</h3>
                  </div>
                  <p className="text-slate-300 text-sm">
                    Based on your subjects and grades, here are careers that align with your strengths and interests.
                  </p>
                </div>

                {careers.map((career, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/50 backdrop-blur-xl border-2 border-cyan-500/30 rounded-2xl p-6 hover:border-cyan-500/60 transition transform hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="text-4xl">{career.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 flex-wrap">
                            <h3 className="text-xl font-bold text-white">{career.title}</h3>
                            {index === 0 && (
                              <span className="px-2 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full">
                                TOP MATCH
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-slate-400 mt-1">{career.description}</p>

                          {courseName && (
                            <div className="flex items-center space-x-2 mt-2">
                              <GraduationCap className="w-4 h-4 text-blue-400" />
                              <span className="text-xs text-blue-300">Through: <span className="font-semibold">{courseName}</span></span>
                            </div>
                          )}

                          {subjects.length > 0 && (
                            <div className="flex items-center space-x-2 mt-2">
                              <BookOpen className="w-4 h-4 text-purple-400" />
                              <span className="text-xs text-purple-300">Your subjects: {subjects.slice(0, 3).join(', ')}{subjects.length > 3 ? '...' : ''}</span>
                            </div>
                          )}

                          {career.salary && (
                            <div className="flex items-center space-x-2 mt-2">
                              <DollarSign className="w-4 h-4 text-green-400" />
                              <span className="text-sm font-bold text-green-400">Average: {career.salary}/month</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end ml-4">
                        <div className="text-3xl font-black text-cyan-400">{career.match}%</div>
                        <div className="text-xs text-slate-500">Match</div>
                      </div>
                    </div>

                    {career.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {career.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm font-medium rounded-lg"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 mt-6">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-6 h-6 text-blue-400 mt-1" />
                    <div>
                      <h4 className="font-bold text-white mb-2">Keep Growing!</h4>
                      <p className="text-sm text-slate-300">
                        These predictions are based on your current academic performance. Continue working hard,
                        explore your interests, and remember that your career path can evolve as you grow!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
