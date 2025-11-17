import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Settings, ChevronRight, CheckCircle2, Circle, Sparkles, LogOut, ShieldAlert, ShieldCheck, Lightbulb } from 'lucide-react';
import { Avatar3D } from '../Avatar/Avatar3D';
import { StepDetail } from './StepDetail';
import { SettingsPanel } from './SettingsPanel';
import { CareerPrediction } from './CareerPrediction';
import { PathwaySelector } from './PathwaySelector';
import { RecommendationsPanel } from './RecommendationsPanel';

interface RoadmapStep {
  id: string;
  title: string;
  level: string;
  completed: boolean;
  current: boolean;
  isPathwayChoice?: boolean;
}

export function RoadmapView() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [pathway, setPathway] = useState<any>(null);
  const [steps, setSteps] = useState<RoadmapStep[]>([]);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showCareer, setShowCareer] = useState(false);
  const [showPathway, setShowPathway] = useState(false);
  const [isPolyOnly, setIsPolyOnly] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [hasRecommendations, setHasRecommendations] = useState(false);
  const [userSubjects, setUserSubjects] = useState<string[]>([]);
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [avatarPrefs, setAvatarPrefs] = useState({
    skinColor: '#FFD6A5',
    hairColor: '#4A2C2A',
    eyeColor: '#1F2937',
    eyeShape: 'round' as const,
    noseSize: 'medium' as const,
    mouthShape: 'smile' as const,
    course: 'Default',
    emotion: 'happy' as const
  });

  useEffect(() => {
    loadProfile();
  }, [user]);

  const generateSteps = (currentLevel: string, pathwayType: string | null, isIPSchool: boolean = false, iteToPoly: boolean = false): RoadmapStep[] => {
    if (isIPSchool) {
      const ipSteps: RoadmapStep[] = [
        { id: 's1', title: 'Secondary 1', level: 'Secondary 1', completed: false, current: false },
        { id: 's2', title: 'Secondary 2', level: 'Secondary 2', completed: false, current: false },
        { id: 's3', title: 'Secondary 3', level: 'Secondary 3', completed: false, current: false },
        { id: 's4', title: 'Secondary 4', level: 'Secondary 4', completed: false, current: false },
        { id: 'jc1', title: 'JC Year 1', level: 'JC 1', completed: false, current: false },
        { id: 'jc2', title: 'JC Year 2', level: 'JC 2', completed: false, current: false },
        { id: 'career', title: 'Career Discovery', level: 'Career', completed: false, current: false },
      ];

      const currentIndex = ipSteps.findIndex(s => s.level === currentLevel);

      return ipSteps.map((step, index) => ({
        ...step,
        completed: index < currentIndex,
        current: index === currentIndex
      }));
    }

    const baseSteps: RoadmapStep[] = [
      { id: 's1', title: 'Secondary 1', level: 'Secondary 1', completed: false, current: false },
      { id: 's2', title: 'Secondary 2', level: 'Secondary 2', completed: false, current: false },
      { id: 's3', title: 'Secondary 3', level: 'Secondary 3', completed: false, current: false },
      { id: 's4', title: 'Secondary 4', level: 'Secondary 4', completed: false, current: false },
      { id: 'pathway', title: 'Choose Your Path', level: 'Pathway Choice', completed: false, current: false, isPathwayChoice: true },
    ];

    if (pathwayType === 'JC') {
      baseSteps.push(
        { id: 'jc1', title: 'JC Year 1', level: 'JC 1', completed: false, current: false },
        { id: 'jc2', title: 'JC Year 2', level: 'JC 2', completed: false, current: false },
      );
    } else if (pathwayType === 'Polytechnic' && !iteToPoly) {
      baseSteps.push(
        { id: 'poly1', title: 'Polytechnic Year 1', level: 'Polytechnic Year 1', completed: false, current: false },
        { id: 'poly2', title: 'Polytechnic Year 2', level: 'Polytechnic Year 2', completed: false, current: false },
        { id: 'poly3', title: 'Polytechnic Year 3', level: 'Polytechnic Year 3', completed: false, current: false },
      );
    } else if (pathwayType === 'ITE' || (pathwayType === 'Polytechnic' && iteToPoly)) {
      baseSteps.push(
        { id: 'ite1', title: 'ITE Year 1', level: 'ITE Year 1', completed: false, current: false },
        { id: 'ite2', title: 'ITE Year 2', level: 'ITE Year 2', completed: false, current: false },
      );
      if (iteToPoly) {
        baseSteps.push(
          { id: 'poly-pathway', title: 'Choose Poly Course', level: 'Poly Pathway Choice', completed: false, current: false, isPathwayChoice: true },
          { id: 'poly1', title: 'Polytechnic Year 1', level: 'Polytechnic Year 1', completed: false, current: false },
          { id: 'poly2', title: 'Polytechnic Year 2', level: 'Polytechnic Year 2', completed: false, current: false },
          { id: 'poly3', title: 'Polytechnic Year 3', level: 'Polytechnic Year 3', completed: false, current: false },
        );
      }
    }

    baseSteps.push({ id: 'career', title: 'Career Discovery', level: 'Career', completed: false, current: false });

    const currentIndex = baseSteps.findIndex(s => s.level === currentLevel);

    return baseSteps.map((step, index) => ({
      ...step,
      completed: index < currentIndex,
      current: index === currentIndex
    }));
  };

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data: profileData } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      const { data: pathwayData } = await supabase
        .from('student_pathways')
        .select('*')
        .eq('student_id', user.id)
        .maybeSingle();

      if (profileData) {
        setProfile(profileData);
        setPathway(pathwayData);

        if (profileData.avatar_preferences) {
          setAvatarPrefs({
            ...profileData.avatar_preferences,
            course: pathwayData?.course_name || 'Default'
          });
        }

        const isIteToPoly = profileData.ite_to_poly || (pathwayData?.ite_course_name ? true : false);
        const generatedSteps = generateSteps(
          profileData.current_level,
          pathwayData?.pathway_type || null,
          profileData.is_ip_school || false,
          isIteToPoly
        );

        setSteps(generatedSteps);

        const { data: records } = await supabase
          .from('academic_records')
          .select('subject_name')
          .eq('student_id', user.id);

        if (records) {
          const subjects = records.map(r => r.subject_name);
          setUserSubjects(subjects);
          setHasRecommendations(subjects.length >= 1);
        }
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const handleStepClick = (step: RoadmapStep) => {
    if (step.isPathwayChoice) {
      setIsPolyOnly(step.id === 'poly-pathway');
      setShowPathway(true);
    } else if (step.id === 'career') {
      setShowCareer(true);
    } else {
      setSelectedStep(step.id);
    }
  };

  const markStepComplete = async (step: RoadmapStep) => {
    if (!user || !profile) return;

    try {
      const currentIndex = steps.findIndex(s => s.id === step.id);
      const nextStep = steps[currentIndex + 1];

      if (nextStep) {
        await supabase
          .from('students')
          .update({ current_level: nextStep.level })
          .eq('id', user.id);

        await loadProfile();
      }
    } catch (error) {
      console.error('Error completing step:', error);
    }
  };

  const markStepUncomplete = async (step: RoadmapStep) => {
    if (!user || !profile) return;

    try {
      const currentIndex = steps.findIndex(s => s.id === step.id);
      const prevStep = steps[currentIndex - 1];

      if (prevStep) {
        await supabase
          .from('students')
          .update({ current_level: prevStep.level })
          .eq('id', user.id);

        await loadProfile();
      }
    } catch (error) {
      console.error('Error uncompleting step:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-green-300 to-green-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzAgMzBMMzUgMjVMNDAgMzBMMzUgMzVaIiBmaWxsPSIjMEFBMDAwIiBvcGFjaXR5PSIwLjEiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-blue-400 to-transparent"></div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bottom-0 w-4 h-8 bg-green-600 rounded-t-full"
            style={{
              left: `${i * 5 + 2}%`,
              height: `${20 + Math.random() * 20}px`,
              opacity: 0.6
            }}
          />
        ))}
      </div>

      <header className="relative z-10 border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent animate-pulse">
                IDARETHON
              </div>
              {profile && (
                <div className="text-sm text-slate-400">{profile.full_name}</div>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-slate-300 hover:text-white rounded-xl border border-slate-700 hover:border-cyan-500 transition transform hover:scale-105"
              >
                <Settings className="w-4 h-4" />
                <span className="text-sm font-medium">Settings</span>
              </button>

              <button
                onClick={signOut}
                className="flex items-center space-x-2 px-4 py-2 bg-slate-800 text-slate-300 hover:text-red-400 rounded-xl border border-slate-700 hover:border-red-900 transition transform hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Exit</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 h-[calc(100vh-4rem)] overflow-x-auto overflow-y-hidden px-8 py-8 flex">
        {hasRecommendations && (
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
            <button
              onClick={() => setShowRecommendations(true)}
              className="group relative bg-gradient-to-br from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white p-4 rounded-2xl shadow-2xl transition transform hover:scale-110 animate-bounce"
            >
              <Lightbulb className="w-8 h-8" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full border-2 border-white flex items-center justify-center animate-pulse">
                <span className="text-white text-xs font-bold">!</span>
              </div>
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none shadow-xl border border-yellow-400">
                <div className="font-bold">Course Recommendations</div>
                <div className="text-xs text-slate-300">Based on your subjects</div>
              </div>
            </button>
          </div>
        )}

        <div className="min-w-max flex items-center space-x-8 h-full flex-1">
          {steps.map((step, index) => {
            const currentIndex = steps.findIndex(s => s.current);

            return (
              <div key={step.id} className="flex flex-col items-center relative" style={{ minWidth: '180px' }}>
                {step.current && !step.isPathwayChoice && step.id !== 'career' && (
                  <div className="mb-2 flex flex-col space-y-1">
                    <button
                      onClick={() => markStepComplete(step)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold text-sm flex items-center space-x-1 transition transform hover:scale-105 shadow-lg"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed?</span>
                    </button>
                    {index > 0 && (
                      <button
                        onClick={() => markStepUncomplete(step)}
                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-semibold text-xs flex items-center space-x-1 transition transform hover:scale-105 shadow-lg"
                      >
                        <span>Uncomplete</span>
                      </button>
                    )}
                  </div>
                )}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleStepClick(step)}
                    className={`w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 transition transform hover:scale-110 relative ${
                      step.current
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-yellow-300 shadow-2xl shadow-yellow-500/50 animate-pulse'
                        : step.completed
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600 border-green-300 shadow-xl'
                        : step.isPathwayChoice
                        ? 'bg-gradient-to-br from-purple-500 to-pink-500 border-purple-300 shadow-xl animate-pulse'
                        : 'bg-gradient-to-br from-gray-400 to-gray-500 border-gray-300 shadow-lg opacity-60'
                    }`}
                  >
                    <div className="text-center">
                      {step.completed ? (
                        <CheckCircle2 className="w-12 h-12 text-white mx-auto mb-1" />
                      ) : step.current ? (
                        <Sparkles className="w-12 h-12 text-white mx-auto mb-1 animate-spin" />
                      ) : step.isPathwayChoice ? (
                        <Circle className="w-12 h-12 text-white mx-auto mb-1" />
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center text-3xl font-black text-white">{index + 1}</div>
                      )}
                      <div className="text-xs font-bold text-white px-2">{step.title}</div>
                    </div>
                  </button>

                  {step.current && (
                    <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-32 h-56 z-50">
                      <Avatar3D {...avatarPrefs} />
                    </div>
                  )}
                </div>

                {index < steps.length - 1 && (
                  <div className="absolute top-16 left-full w-8 h-1">
                    <div className={`h-1 w-full ${
                      step.completed ? 'bg-green-500' : 'bg-gray-400'
                    }`}></div>
                    <ChevronRight className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 ${
                      step.completed ? 'text-green-500' : 'text-gray-400'
                    }`} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {profile && (
          <div className={`fixed top-20 transition-all duration-300 ${panelCollapsed ? 'right-0' : 'right-8'} bg-white/90 backdrop-blur-xl border-4 border-yellow-400 rounded-2xl shadow-2xl ${panelCollapsed ? 'max-w-[60px]' : 'max-w-xs'} overflow-hidden`}>
            <button
              onClick={() => setPanelCollapsed(!panelCollapsed)}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-l-xl transition shadow-lg z-10"
            >
              <ChevronRight className={`w-5 h-5 transition-transform ${panelCollapsed ? 'rotate-180' : ''}`} />
            </button>
            <div className={`p-4 space-y-3 ${panelCollapsed ? 'hidden' : ''}`}>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                <div className="font-black text-gray-800">{profile.full_name}</div>
              </div>

              <div className="text-sm">
                <div className="text-gray-600 font-semibold">Level</div>
                <div className="text-gray-900 font-bold">{profile.current_level}</div>
              </div>

              <div className="text-sm">
                <div className="text-gray-600 font-semibold">School</div>
                <div className="text-gray-900 font-bold">{profile.school_name}</div>
              </div>

              {pathway && (
                <div className="text-sm bg-purple-100 p-2 rounded-lg space-y-1">
                  <div className="text-purple-700 font-semibold">{pathway.pathway_type}</div>
                  <div className="text-purple-900 font-bold text-xs">{pathway.institution_name}</div>
                  {pathway.ite_course_name && profile.ite_to_poly && (
                    <div className="bg-orange-100 p-2 rounded mt-1">
                      <div className="text-orange-700 font-semibold text-xs">ITE Course</div>
                      <div className="text-orange-900 text-xs">{pathway.ite_course_name}</div>
                    </div>
                  )}
                  {pathway.course_name && (
                    <div className={`p-2 rounded mt-1 ${pathway.ite_course_name && profile.ite_to_poly ? 'bg-blue-100' : ''}`}>
                      {pathway.ite_course_name && profile.ite_to_poly && (
                        <div className="text-blue-700 font-semibold text-xs">Poly Course</div>
                      )}
                      <div className={`text-xs ${pathway.ite_course_name && profile.ite_to_poly ? 'text-blue-900' : 'text-purple-800'}`}>
                        {pathway.course_name}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className={`text-sm p-2 rounded-lg flex items-center space-x-2 ${
                profile.school_verified ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {profile.school_verified ? (
                  <>
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span className="text-green-800 font-bold text-xs">Verified</span>
                  </>
                ) : (
                  <>
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span className="text-red-800 font-bold text-xs">Not Verified</span>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {selectedStep && (
        <StepDetail
          step={steps.find(s => s.id === selectedStep)!}
          onClose={() => setSelectedStep(null)}
          onSave={loadProfile}
        />
      )}

      {showSettings && (
        <SettingsPanel
          profile={profile}
          onClose={() => setShowSettings(false)}
          onSave={() => { loadProfile(); setShowSettings(false); }}
        />
      )}

      {showCareer && (
        <CareerPrediction onClose={() => setShowCareer(false)} />
      )}

      {showPathway && (
        <PathwaySelector
          onClose={() => { setShowPathway(false); setIsPolyOnly(false); }}
          onSave={() => { loadProfile(); setShowPathway(false); setIsPolyOnly(false); }}
          polyOnly={isPolyOnly}
        />
      )}

      {showRecommendations && (
        <RecommendationsPanel
          subjects={userSubjects}
          onClose={() => setShowRecommendations(false)}
        />
      )}
    </div>
  );
}
