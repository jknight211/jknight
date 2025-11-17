import { X, GraduationCap, Wrench, BookOpen } from 'lucide-react';
import { POLY_COURSES, ITE_COURSES } from '../../lib/coursesData';

interface RecommendationsPanelProps {
  subjects: string[];
  onClose: () => void;
}

interface CourseRecommendation {
  name: string;
  category: string;
  poly?: string[];
  matchingSubjects: string[];
  missingSubjects: string[];
  score: number;
}

export function RecommendationsPanel({ subjects, onClose }: RecommendationsPanelProps) {
  const calculateRecommendations = () => {
    const polyRecs: CourseRecommendation[] = POLY_COURSES.map(course => {
      const matching = course.subjects.filter(s => subjects.includes(s));
      const missing = course.subjects.filter(s => !subjects.includes(s));
      const score = (matching.length / course.subjects.length) * 100;

      return {
        name: course.name,
        category: course.category,
        poly: course.poly,
        matchingSubjects: matching,
        missingSubjects: missing,
        score
      };
    }).filter(rec => rec.score > 0).sort((a, b) => b.score - a.score);

    const iteRecs: CourseRecommendation[] = ITE_COURSES.map(course => {
      const matching = course.subjects.filter(s => subjects.includes(s));
      const missing = course.subjects.filter(s => !subjects.includes(s));
      const score = (matching.length / course.subjects.length) * 100;

      return {
        name: course.name,
        category: course.category,
        matchingSubjects: matching,
        missingSubjects: missing,
        score
      };
    }).filter(rec => rec.score > 0).sort((a, b) => b.score - a.score);

    return { poly: polyRecs, ite: iteRecs };
  };

  const recommendations = calculateRecommendations();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border-2 border-cyan-500/30">
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Course Recommendations</h2>
            <p className="text-cyan-100 text-sm mt-1">Based on your Secondary 1-4 subjects</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-slate-800/50 border border-cyan-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <h3 className="font-bold text-white">Your Subjects ({subjects.length})</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {subjects.map(subject => (
                <span
                  key={subject}
                  className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/40 rounded-lg text-sm text-cyan-300 font-medium"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-6 max-h-[calc(90vh-300px)] overflow-y-auto pr-2">
            {recommendations.poly.length > 0 && (
              <div>
                <div className="sticky top-0 bg-gradient-to-r from-cyan-900/95 to-blue-900/95 backdrop-blur-sm py-3 px-4 rounded-xl mb-4 flex items-center space-x-2 border border-cyan-500/30">
                  <GraduationCap className="w-6 h-6 text-cyan-400" />
                  <h3 className="font-bold text-white text-lg">Polytechnic Courses ({recommendations.poly.length})</h3>
                </div>
                <div className="space-y-3">
                  {recommendations.poly.map((rec) => (
                    <div
                      key={rec.name}
                      className="bg-slate-800/80 border border-cyan-500/40 rounded-xl p-5 hover:border-cyan-400 transition shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="font-bold text-white text-lg">Diploma in {rec.name}</div>
                          {rec.poly && (
                            <div className="text-sm text-blue-400 mt-2 font-semibold flex flex-wrap gap-2">
                              {rec.poly.map(polyCode => (
                                <span key={polyCode} className="px-2 py-1 bg-blue-500/20 border border-blue-500/40 rounded">
                                  📍 School of {rec.category} @ {polyCode}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="px-4 py-2 bg-green-500/20 rounded-xl text-sm font-bold text-green-300 border border-green-500/30">
                          {Math.round(rec.score)}% Match
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                          <div className="text-green-400 font-semibold mb-2 flex items-center space-x-1">
                            <span>✓</span>
                            <span>You Have ({rec.matchingSubjects.length})</span>
                          </div>
                          <div className="text-slate-300 space-y-1">
                            {rec.matchingSubjects.map(subj => (
                              <div key={subj}>• {subj}</div>
                            ))}
                          </div>
                        </div>
                        {rec.missingSubjects.length > 0 && (
                          <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-3">
                            <div className="text-orange-400 font-semibold mb-2 flex items-center space-x-1">
                              <span>⚠</span>
                              <span>Missing ({rec.missingSubjects.length})</span>
                            </div>
                            <div className="text-slate-300 space-y-1">
                              {rec.missingSubjects.map(subj => (
                                <div key={subj}>• {subj}</div>
                              ))}
                            </div>
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
                <div className="sticky top-0 bg-gradient-to-r from-orange-900/95 to-red-900/95 backdrop-blur-sm py-3 px-4 rounded-xl mb-4 flex items-center space-x-2 border border-orange-500/30">
                  <Wrench className="w-6 h-6 text-orange-400" />
                  <h3 className="font-bold text-white text-lg">ITE Courses ({recommendations.ite.length})</h3>
                </div>
                <div className="space-y-3">
                  {recommendations.ite.map((rec) => (
                    <div
                      key={rec.name}
                      className="bg-slate-800/80 border border-orange-500/40 rounded-xl p-5 hover:border-orange-400 transition shadow-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="font-bold text-white text-lg">Higher Nitec in {rec.name}</div>
                          <div className="text-sm text-orange-400 mt-2 font-semibold">
                            📍 ITE College Central, East, West
                          </div>
                        </div>
                        <div className="px-4 py-2 bg-green-500/20 rounded-xl text-sm font-bold text-green-300 border border-green-500/30">
                          {Math.round(rec.score)}% Match
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                        <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-3">
                          <div className="text-green-400 font-semibold mb-2 flex items-center space-x-1">
                            <span>✓</span>
                            <span>You Have ({rec.matchingSubjects.length})</span>
                          </div>
                          <div className="text-slate-300 space-y-1">
                            {rec.matchingSubjects.map(subj => (
                              <div key={subj}>• {subj}</div>
                            ))}
                          </div>
                        </div>
                        {rec.missingSubjects.length > 0 && (
                          <div className="bg-orange-900/30 border border-orange-500/30 rounded-lg p-3">
                            <div className="text-orange-400 font-semibold mb-2 flex items-center space-x-1">
                              <span>⚠</span>
                              <span>Missing ({rec.missingSubjects.length})</span>
                            </div>
                            <div className="text-slate-300 space-y-1">
                              {rec.missingSubjects.map(subj => (
                                <div key={subj}>• {subj}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
