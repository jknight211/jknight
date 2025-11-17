import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { User, BookOpen, Trophy, Target, Plus, Palette } from 'lucide-react';
import { SubjectManager } from './SubjectManager';
import { GoalManager } from './GoalManager';
import { Avatar3D } from '../Avatar/Avatar3D';

interface ProfilePanelProps {
  profile: any;
}

export function ProfilePanel({ profile }: ProfilePanelProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    subjects: 0,
    simulations: 0,
    goals: 0,
    ccaRecords: 0
  });
  const [showSubjectManager, setShowSubjectManager] = useState(false);
  const [showGoalManager, setShowGoalManager] = useState(false);
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
  const [avatarPrefs, setAvatarPrefs] = useState({
    skinColor: '#FFD6A5',
    hairColor: '#4A2C2A',
    shirtColor: '#3B82F6',
    emotion: 'neutral' as 'happy' | 'neutral' | 'excited' | 'focused'
  });

  useEffect(() => {
    loadStats();
    loadAvatarPrefs();
  }, [user]);

  const loadStats = async () => {
    if (!user) return;

    try {
      const [subjects, simulations, goals, cca] = await Promise.all([
        supabase.from('subject_enrollments').select('id', { count: 'exact' }).eq('student_id', user.id).eq('is_active', true),
        supabase.from('simulations').select('id', { count: 'exact' }).eq('student_id', user.id),
        supabase.from('goals').select('id', { count: 'exact' }).eq('student_id', user.id).eq('status', 'Active'),
        supabase.from('cca_records').select('id', { count: 'exact' }).eq('student_id', user.id)
      ]);

      setStats({
        subjects: subjects.count || 0,
        simulations: simulations.count || 0,
        goals: goals.count || 0,
        ccaRecords: cca.count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadAvatarPrefs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('students')
        .select('avatar_preferences')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;

      if (data?.avatar_preferences) {
        setAvatarPrefs(data.avatar_preferences as any);
      }
    } catch (error) {
      console.error('Error loading avatar preferences:', error);
    }
  };

  const saveAvatarPrefs = async (prefs: typeof avatarPrefs) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('students')
        .update({ avatar_preferences: prefs })
        .eq('id', user.id);

      if (error) throw error;
      setAvatarPrefs(prefs);
    } catch (error) {
      console.error('Error saving avatar preferences:', error);
    }
  };

  useEffect(() => {
    const emotions: Array<'happy' | 'neutral' | 'excited' | 'focused'> = ['happy', 'neutral', 'excited', 'focused'];

    if (stats.simulations > 10) {
      setAvatarPrefs(prev => ({ ...prev, emotion: 'excited' }));
    } else if (stats.subjects > 8) {
      setAvatarPrefs(prev => ({ ...prev, emotion: 'focused' }));
    } else if (stats.goals >= 3) {
      setAvatarPrefs(prev => ({ ...prev, emotion: 'happy' }));
    }
  }, [stats]);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2.5 rounded-xl">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Profile</h2>
            <p className="text-sm text-gray-600">Academic overview</p>
          </div>
        </div>

        <div className="mb-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden border border-gray-200">
          <div className="h-64">
            <Avatar3D {...avatarPrefs} autoRotate />
          </div>
          <button
            onClick={() => setShowAvatarCustomizer(true)}
            className="w-full px-4 py-3 bg-white hover:bg-gray-50 text-gray-700 font-medium transition flex items-center justify-center space-x-2 border-t border-gray-200"
          >
            <Palette className="w-4 h-4" />
            <span>Customize Avatar</span>
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">Active Subjects</span>
              </div>
              <span className="text-2xl font-bold text-blue-600">{stats.subjects}</span>
            </div>
            <button
              onClick={() => setShowSubjectManager(true)}
              className="w-full mt-2 px-3 py-2 bg-white text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-50 transition flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Manage Subjects</span>
            </button>
          </div>

          <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-gray-700">Active Goals</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{stats.goals}</span>
            </div>
            <button
              onClick={() => setShowGoalManager(true)}
              className="w-full mt-2 px-3 py-2 bg-white text-green-600 text-sm font-medium rounded-lg hover:bg-green-50 transition flex items-center justify-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Set Goals</span>
            </button>
          </div>

          <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Trophy className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-gray-700">CCA Records</span>
              </div>
              <span className="text-2xl font-bold text-orange-600">{stats.ccaRecords}</span>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold text-gray-700">Total Simulations</span>
              </div>
              <span className="text-2xl font-bold text-purple-600">{stats.simulations}</span>
            </div>
          </div>
        </div>

        {profile && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Level</span>
                <span className="font-semibold text-gray-900">{profile.current_level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">School</span>
                <span className="font-semibold text-gray-900">{profile.school_name}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {showSubjectManager && (
        <SubjectManager
          onClose={() => {
            setShowSubjectManager(false);
            loadStats();
          }}
        />
      )}

      {showGoalManager && (
        <GoalManager
          onClose={() => {
            setShowGoalManager(false);
            loadStats();
          }}
        />
      )}

      {showAvatarCustomizer && (
        <AvatarCustomizer
          currentPrefs={avatarPrefs}
          onSave={(prefs) => {
            saveAvatarPrefs(prefs);
            setShowAvatarCustomizer(false);
          }}
          onClose={() => setShowAvatarCustomizer(false)}
        />
      )}
    </>
  );
}

function AvatarCustomizer({ currentPrefs, onSave, onClose }: {
  currentPrefs: any;
  onSave: (prefs: any) => void;
  onClose: () => void;
}) {
  const [prefs, setPrefs] = useState(currentPrefs);

  const skinTones = [
    { name: 'Light', color: '#FFD6A5' },
    { name: 'Medium', color: '#D4A574' },
    { name: 'Tan', color: '#C68642' },
    { name: 'Deep', color: '#8D5524' },
  ];

  const hairColors = [
    { name: 'Black', color: '#1F1F1F' },
    { name: 'Dark Brown', color: '#4A2C2A' },
    { name: 'Brown', color: '#6F4E37' },
    { name: 'Blonde', color: '#F5DEB3' },
  ];

  const shirtColors = [
    { name: 'Blue', color: '#3B82F6' },
    { name: 'Green', color: '#10B981' },
    { name: 'Red', color: '#EF4444' },
    { name: 'Purple', color: '#8B5CF6' },
    { name: 'Orange', color: '#F97316' },
    { name: 'Gray', color: '#6B7280' },
  ];

  const emotions = [
    { name: 'Neutral', value: 'neutral' as const },
    { name: 'Happy', value: 'happy' as const },
    { name: 'Excited', value: 'excited' as const },
    { name: 'Focused', value: 'focused' as const },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Palette className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Customize Your Avatar</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-2"
          >
            <User className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl h-96 border border-gray-200">
              <Avatar3D {...prefs} autoRotate />
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Skin Tone</label>
                <div className="grid grid-cols-4 gap-3">
                  {skinTones.map((tone) => (
                    <button
                      key={tone.color}
                      onClick={() => setPrefs({ ...prefs, skinColor: tone.color })}
                      className={`h-16 rounded-xl border-2 transition ${
                        prefs.skinColor === tone.color ? 'border-blue-500 scale-105' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: tone.color }}
                      title={tone.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Hair Color</label>
                <div className="grid grid-cols-4 gap-3">
                  {hairColors.map((hair) => (
                    <button
                      key={hair.color}
                      onClick={() => setPrefs({ ...prefs, hairColor: hair.color })}
                      className={`h-16 rounded-xl border-2 transition ${
                        prefs.hairColor === hair.color ? 'border-blue-500 scale-105' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: hair.color }}
                      title={hair.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Shirt Color</label>
                <div className="grid grid-cols-6 gap-3">
                  {shirtColors.map((shirt) => (
                    <button
                      key={shirt.color}
                      onClick={() => setPrefs({ ...prefs, shirtColor: shirt.color })}
                      className={`h-16 rounded-xl border-2 transition ${
                        prefs.shirtColor === shirt.color ? 'border-blue-500 scale-105' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: shirt.color }}
                      title={shirt.name}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-3">Emotion</label>
                <div className="grid grid-cols-2 gap-3">
                  {emotions.map((emotion) => (
                    <button
                      key={emotion.value}
                      onClick={() => setPrefs({ ...prefs, emotion: emotion.value })}
                      className={`px-4 py-3 rounded-xl border-2 font-medium transition ${
                        prefs.emotion === emotion.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      {emotion.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={() => onSave(prefs)}
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition"
            >
              Save Avatar
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
