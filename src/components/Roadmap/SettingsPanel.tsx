import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { X, Save, Palette } from 'lucide-react';
import { Avatar3D } from '../Avatar/Avatar3D';
import { SECONDARY_SCHOOLS, POLYTECHNICS, JUNIOR_COLLEGES, ITE_COLLEGES } from '../../lib/coursesData';

interface SettingsPanelProps {
  profile: any;
  onClose: () => void;
  onSave: () => void;
}

const IP_SCHOOLS = [
  'Raffles Institution',
  'Hwa Chong Institution',
  'Dunman High School',
  'River Valley High School',
  'National Junior College',
  'Victoria School'
];

const EDUCATION_LEVELS = [
  'Secondary 1', 'Secondary 2', 'Secondary 3', 'Secondary 4',
  'JC 1', 'JC 2',
  'Polytechnic Year 1', 'Polytechnic Year 2', 'Polytechnic Year 3',
  'ITE Year 1', 'ITE Year 2', 'ITE Year 3'
];

const SKIN_TONES = [
  { name: 'Light', color: '#FFD6A5' },
  { name: 'Medium', color: '#D4A574' },
  { name: 'Tan', color: '#C68642' },
  { name: 'Deep', color: '#8D5524' },
];

const HAIR_COLORS = [
  { name: 'Black', color: '#1F1F1F' },
  { name: 'Dark Brown', color: '#4A2C2A' },
  { name: 'Brown', color: '#6F4E37' },
  { name: 'Blonde', color: '#F5DEB3' },
];

const EYE_COLORS = [
  { name: 'Dark Brown', color: '#1F2937' },
  { name: 'Brown', color: '#4A2C2A' },
  { name: 'Blue', color: '#3B82F6' },
  { name: 'Green', color: '#10B981' },
  { name: 'Gray', color: '#6B7280' },
];

export function SettingsPanel({ profile, onClose, onSave }: SettingsPanelProps) {
  const { user } = useAuth();
  const [schoolName, setSchoolName] = useState(profile?.school_name || '');
  const [currentLevel, setCurrentLevel] = useState(profile?.current_level || 'Secondary 1');
  const [isIPSchool, setIsIPSchool] = useState(IP_SCHOOLS.includes(profile?.school_name || ''));
  const [iteToPoly, setIteToPoly] = useState(profile?.ite_to_poly || false);
  const [avatarPrefs, setAvatarPrefs] = useState(profile?.avatar_preferences || {
    skinColor: '#FFD6A5',
    hairColor: '#4A2C2A',
    eyeColor: '#1F2937',
    eyeShape: 'round',
    noseSize: 'medium',
    mouthShape: 'smile',
    emotion: 'happy',
    gender: 'male'
  });
  const [saving, setSaving] = useState(false);

  const handleSchoolChange = (school: string) => {
    setSchoolName(school);
    const isIP = IP_SCHOOLS.includes(school);
    setIsIPSchool(isIP);
    if (isIP) {
      setCurrentLevel('Secondary 1');
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('students')
        .update({
          school_name: schoolName,
          current_level: currentLevel,
          is_ip_school: isIPSchool,
          ite_to_poly: iteToPoly,
          avatar_preferences: avatarPrefs,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      onSave();
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Palette className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Settings</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-white mb-4">School Information</h3>
                <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4 mb-4">
                  <p className="text-sm text-cyan-300">
                    <strong>Note:</strong> Select your current school to connect with your institution. This does not show your pathway choice. Use the "Choose Your Path" button on the map to select your post-secondary pathway.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Secondary School
                    </label>
                    <select
                      value={schoolName}
                      onChange={(e) => handleSchoolChange(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Choose your school...</option>
                      <optgroup label="Secondary Schools">
                        {SECONDARY_SCHOOLS.map(school => (
                          <option key={school} value={school}>{school}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Junior Colleges">
                        {JUNIOR_COLLEGES.map(school => (
                          <option key={school} value={school}>{school}</option>
                        ))}
                      </optgroup>
                      <optgroup label="Polytechnics">
                        {POLYTECHNICS.map(school => (
                          <option key={school} value={school}>{school}</option>
                        ))}
                      </optgroup>
                      <optgroup label="ITE Colleges">
                        {ITE_COLLEGES.map(school => (
                          <option key={school} value={school}>{school}</option>
                        ))}
                      </optgroup>
                    </select>
                    {isIPSchool && (
                      <div className="mt-2 bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
                        <p className="text-sm text-blue-300">
                          <strong>Integrated Programme (IP) School</strong> - 6-year program (Sec + JC combined)
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                      Current Level
                    </label>
                    <select
                      value={currentLevel}
                      onChange={(e) => setCurrentLevel(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-cyan-500"
                    >
                      <option value="">Select your level</option>
                      {EDUCATION_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                  </div>

                  <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={iteToPoly}
                        onChange={(e) => setIteToPoly(e.target.checked)}
                        className="w-5 h-5 rounded border-2 border-orange-500 bg-slate-900 checked:bg-orange-500 focus:ring-2 focus:ring-orange-500"
                      />
                      <div>
                        <div className="font-semibold text-white">Continue to Polytechnic after ITE?</div>
                        <div className="text-xs text-orange-300 mt-1">If checked, adds 3 more years to your roadmap for polytechnic after ITE graduation</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-white mb-4">Avatar Customization</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Gender</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[{ name: 'Male', value: 'male' }, { name: 'Female', value: 'female' }].map((gender) => (
                        <button
                          key={gender.value}
                          onClick={() => setAvatarPrefs({ ...avatarPrefs, gender: gender.value as any })}
                          className={`px-4 py-3 rounded-xl border-2 font-semibold transition ${
                            avatarPrefs.gender === gender.value ? 'border-cyan-500 bg-cyan-500/20 text-white' : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {gender.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Skin Tone</label>
                    <div className="grid grid-cols-4 gap-3">
                      {SKIN_TONES.map((tone) => (
                        <button
                          key={tone.color}
                          onClick={() => setAvatarPrefs({ ...avatarPrefs, skinColor: tone.color })}
                          className={`h-16 rounded-xl border-2 transition ${
                            avatarPrefs.skinColor === tone.color ? 'border-cyan-500 scale-105' : 'border-slate-600 hover:border-slate-500'
                          }`}
                          style={{ backgroundColor: tone.color }}
                          title={tone.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Hair Color</label>
                    <div className="grid grid-cols-4 gap-3">
                      {HAIR_COLORS.map((hair) => (
                        <button
                          key={hair.color}
                          onClick={() => setAvatarPrefs({ ...avatarPrefs, hairColor: hair.color })}
                          className={`h-16 rounded-xl border-2 transition ${
                            avatarPrefs.hairColor === hair.color ? 'border-cyan-500 scale-105' : 'border-slate-600 hover:border-slate-500'
                          }`}
                          style={{ backgroundColor: hair.color }}
                          title={hair.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Eye Color</label>
                    <div className="grid grid-cols-5 gap-3">
                      {EYE_COLORS.map((eye) => (
                        <button
                          key={eye.color}
                          onClick={() => setAvatarPrefs({ ...avatarPrefs, eyeColor: eye.color })}
                          className={`h-16 rounded-xl border-2 transition ${
                            avatarPrefs.eyeColor === eye.color ? 'border-cyan-500 scale-105' : 'border-slate-600 hover:border-slate-500'
                          }`}
                          style={{ backgroundColor: eye.color }}
                          title={eye.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Eye Shape</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[{ name: 'Round', value: 'round' }, { name: 'Almond', value: 'almond' }, { name: 'Wide', value: 'wide' }].map((shape) => (
                        <button
                          key={shape.value}
                          onClick={() => setAvatarPrefs({ ...avatarPrefs, eyeShape: shape.value as any })}
                          className={`px-4 py-3 rounded-xl border-2 font-semibold transition ${
                            avatarPrefs.eyeShape === shape.value ? 'border-cyan-500 bg-cyan-500/20 text-white' : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {shape.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Nose Size</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[{ name: 'Small', value: 'small' }, { name: 'Medium', value: 'medium' }, { name: 'Large', value: 'large' }].map((size) => (
                        <button
                          key={size.value}
                          onClick={() => setAvatarPrefs({ ...avatarPrefs, noseSize: size.value as any })}
                          className={`px-4 py-3 rounded-xl border-2 font-semibold transition ${
                            avatarPrefs.noseSize === size.value ? 'border-cyan-500 bg-cyan-500/20 text-white' : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {size.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-3">Mouth Shape</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[{ name: 'Smile', value: 'smile' }, { name: 'Neutral', value: 'neutral' }, { name: 'Small', value: 'small' }].map((mouth) => (
                        <button
                          key={mouth.value}
                          onClick={() => setAvatarPrefs({ ...avatarPrefs, mouthShape: mouth.value as any })}
                          className={`px-4 py-3 rounded-xl border-2 font-semibold transition ${
                            avatarPrefs.mouthShape === mouth.value ? 'border-cyan-500 bg-cyan-500/20 text-white' : 'border-slate-600 bg-slate-800/50 text-slate-300 hover:border-slate-500'
                          }`}
                        >
                          {mouth.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                    <div className="text-sm text-purple-300">
                      <strong className="text-purple-400">Note:</strong> Your outfit will automatically match your chosen course (Banking, Engineering, etc)!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Avatar Preview</h3>
              <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-xl h-96 border border-slate-700">
                <Avatar3D {...avatarPrefs} autoRotate />
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
            >
              <Save className="w-5 h-5" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
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
    </div>
  );
}
