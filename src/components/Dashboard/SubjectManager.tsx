import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { X, Plus, Trash2 } from 'lucide-react';

interface SubjectManagerProps {
  onClose: () => void;
}

const SUBJECT_TYPES = ['Pure', 'Combined', 'Higher', 'Standard'];

const COMMON_SUBJECTS = [
  'Mathematics',
  'English Language',
  'Mother Tongue',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'Literature',
  'Computing',
  'Design & Technology',
  'Food & Nutrition',
  'Art',
  'Music',
];

export function SubjectManager({ onClose }: SubjectManagerProps) {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSubject, setNewSubject] = useState({
    subject_name: '',
    subject_type: 'Pure',
    current_grade_estimate: 'B3',
    study_hours_per_week: 3
  });

  useEffect(() => {
    loadSubjects();
  }, [user]);

  const loadSubjects = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('subject_enrollments')
        .select('*')
        .eq('student_id', user.id)
        .eq('is_active', true)
        .order('subject_name');

      if (error) throw error;
      setSubjects(data || []);
    } catch (error) {
      console.error('Error loading subjects:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSubject = async () => {
    if (!user || !newSubject.subject_name) return;

    try {
      const { error } = await supabase
        .from('subject_enrollments')
        .insert({
          student_id: user.id,
          ...newSubject
        });

      if (error) throw error;

      setNewSubject({
        subject_name: '',
        subject_type: 'Pure',
        current_grade_estimate: 'B3',
        study_hours_per_week: 3
      });

      loadSubjects();
    } catch (error) {
      console.error('Error adding subject:', error);
    }
  };

  const removeSubject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('subject_enrollments')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      loadSubjects();
    } catch (error) {
      console.error('Error removing subject:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Manage Subjects</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-4">Add New Subject</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Name
                </label>
                <select
                  value={newSubject.subject_name}
                  onChange={(e) => setNewSubject({ ...newSubject, subject_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a subject</option>
                  {COMMON_SUBJECTS.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={newSubject.subject_type}
                    onChange={(e) => setNewSubject({ ...newSubject, subject_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {SUBJECT_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Grade
                  </label>
                  <select
                    value={newSubject.current_grade_estimate}
                    onChange={(e) => setNewSubject({ ...newSubject, current_grade_estimate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {['A1', 'A2', 'B3', 'B4', 'C5', 'C6', 'D7', 'E8', 'F9'].map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hours/Week
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={newSubject.study_hours_per_week}
                    onChange={(e) => setNewSubject({ ...newSubject, study_hours_per_week: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                onClick={addSubject}
                disabled={!newSubject.subject_name}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Subject</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Current Subjects</h3>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No subjects added yet</div>
            ) : (
              <div className="space-y-3">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{subject.subject_name}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {subject.subject_type} • Grade: {subject.current_grade_estimate} • {subject.study_hours_per_week}h/week
                      </div>
                    </div>
                    <button
                      onClick={() => removeSubject(subject.id)}
                      className="text-gray-400 hover:text-red-600 transition p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
