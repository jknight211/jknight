import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Clock, TrendingUp, Trash2 } from 'lucide-react';

interface Simulation {
  id: string;
  simulation_type: string;
  scenario_description: string;
  predicted_outcomes: any;
  confidence_score: number;
  recommendations: any;
  created_at: string;
}

export function SimulationHistory() {
  const { user } = useAuth();
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSimulations();
  }, [user]);

  const loadSimulations = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('simulations')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setSimulations(data || []);
    } catch (error) {
      console.error('Error loading simulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteSimulation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('simulations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSimulations(simulations.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting simulation:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-SG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSimulationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'o-level-prediction': 'O-Level Prediction',
      'subject-change': 'Subject Change',
      'pathway-analysis': 'Pathway Analysis',
      'leaps-impact': 'LEAPS Impact'
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-orange-500 to-pink-500 p-2.5 rounded-xl">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Simulation History</h2>
          <p className="text-sm text-gray-600">Your recent predictions and analyses</p>
        </div>
      </div>

      {simulations.length === 0 ? (
        <div className="text-center py-12">
          <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">No simulations yet. Run your first simulation above!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {simulations.map((sim) => (
            <div
              key={sim.id}
              className="p-4 border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-lg">
                      {getSimulationTypeLabel(sim.simulation_type)}
                    </span>
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">
                      {sim.confidence_score}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 font-medium mt-2">{sim.scenario_description}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(sim.created_at)}</p>
                </div>
                <button
                  onClick={() => deleteSimulation(sim.id)}
                  className="text-gray-400 hover:text-red-600 transition p-2"
                  title="Delete simulation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {sim.predicted_outcomes && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-3 bg-gray-50 rounded-lg">
                  {Object.entries(sim.predicted_outcomes).slice(0, 3).map(([key, value]) => (
                    <div key={key}>
                      <div className="text-xs text-gray-500 capitalize mb-1">
                        {key.replace(/_/g, ' ')}
                      </div>
                      <div className="text-sm font-bold text-gray-900">
                        {typeof value === 'object' ? 'Complex' : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {sim.recommendations && Array.isArray(sim.recommendations) && sim.recommendations.length > 0 && (
                <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <div className="text-xs font-semibold text-orange-900 mb-2">
                    Top Recommendation
                  </div>
                  <div className="text-sm text-gray-700">
                    {sim.recommendations[0].message}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
