import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { X, Plus, Trash2, Target } from 'lucide-react';

interface GoalManagerProps {
  onClose: () => void;
}

const GOAL_TYPES = [
  'Junior College',
  'Polytechnic',
  'ITE',
  'University',
  'Scholarship',
  'Competition'
];

export function GoalManager({ onClose }: GoalManagerProps) {
  const { user } = useAuth();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newGoal, setNewGoal] = useState({
    goal_type: 'Junior College',
    target_institution: '',
    target_score: '',
    target_year: new Date().getFullYear() + 1
  });

  useEffect(() => {
    loadGoals();
  }, [user]);

  const loadGoals = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async () => {
    if (!user || !newGoal.target_institution) return;

    try {
      const { error } = await supabase
        .from('goals')
        .insert({
          student_id: user.id,
          ...newGoal
        });

      if (error) throw error;

      setNewGoal({
        goal_type: 'Junior College',
        target_institution: '',
        target_score: '',
        target_year: new Date().getFullYear() + 1
      });

      loadGoals();
    } catch (error) {
      console.error('Error adding goal:', error);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const updateGoalStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      loadGoals();
    } catch (error) {
      console.error('Error updating goal:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Manage Goals</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <h3 className="font-semibold text-gray-900 mb-4">Add New Goal</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Goal Type
                  </label>
                  <select
                    value={newGoal.goal_type}
                    onChange={(e) => setNewGoal({ ...newGoal, goal_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    {GOAL_TYPES.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Year
                  </label>
                  <input
                    type="number"
                    min={new Date().getFullYear()}
                    max={new Date().getFullYear() + 10}
                    value={newGoal.target_year}
                    onChange={(e) => setNewGoal({ ...newGoal, target_year: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Institution / Course
                </label>
                <input
                  type="text"
                  value={newGoal.target_institution}
                  onChange={(e) => setNewGoal({ ...newGoal, target_institution: e.target.value })}
                  placeholder="e.g., Raffles Institution, NUS Computer Science"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Score (Optional)
                </label>
                <input
                  type="text"
                  value={newGoal.target_score}
                  onChange={(e) => setNewGoal({ ...newGoal, target_score: e.target.value })}
                  placeholder="e.g., L1R5 of 8, GPA 3.8"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>

              <button
                onClick={addGoal}
                disabled={!newGoal.target_institution}
                className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Goal</span>
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Your Goals</h3>
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : goals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No goals set yet</div>
            ) : (
              <div className="space-y-3">
                {goals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
                            {goal.goal_type}
                          </span>
                          <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
                            {goal.target_year}
                          </span>
                          <select
                            value={goal.status}
                            onChange={(e) => updateGoalStatus(goal.id, e.target.value)}
                            className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-gray-300"
                          >
                            <option value="Active">Active</option>
                            <option value="Achieved">Achieved</option>
                            <option value="Modified">Modified</option>
                          </select>
                        </div>
                        <div className="font-semibold text-gray-900">{goal.target_institution}</div>
                        {goal.target_score && (
                          <div className="text-sm text-gray-600 mt-1">Target: {goal.target_score}</div>
                        )}
                      </div>
                      <button
                        onClick={() => deleteGoal(goal.id)}
                        className="text-gray-400 hover:text-red-600 transition p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
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
