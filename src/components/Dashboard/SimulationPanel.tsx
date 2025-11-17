import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { runSimulation } from '../../lib/simulationEngine';
import { Play, Sparkles } from 'lucide-react';

interface SimulationPanelProps {
  onSimulationCreated: () => void;
}

const SIMULATION_TYPES = [
  {
    id: 'o-level-prediction',
    name: 'O-Level L1R5 Prediction',
    description: 'Predict your O-Level score based on current performance'
  },
  {
    id: 'subject-change',
    name: 'Subject Combination Change',
    description: 'See impact of changing subject combinations'
  },
  {
    id: 'pathway-analysis',
    name: 'Course Pathway Analysis',
    description: 'Analyze your path to desired courses'
  },
  {
    id: 'leaps-impact',
    name: 'LEAPS 2.0 Impact',
    description: 'Project your co-curricular points'
  },
];

export function SimulationPanel({ onSimulationCreated }: SimulationPanelProps) {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState('o-level-prediction');
  const [scenario, setScenario] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleRunSimulation = async () => {
    if (!user || !scenario.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const { data: subjects } = await supabase
        .from('subject_enrollments')
        .select('*')
        .eq('student_id', user.id)
        .eq('is_active', true);

      const { data: history } = await supabase
        .from('academic_records')
        .select('*')
        .eq('student_id', user.id);

      const { data: ccaData } = await supabase
        .from('cca_records')
        .select('*')
        .eq('student_id', user.id);

      const simulationResult = runSimulation({
        simulationType: selectedType,
        currentSubjects: subjects || [],
        academicHistory: history || [],
        ccaRecords: ccaData || [],
        studyHabits: {
          hoursPerWeek: 20,
        }
      });

      const { data: simulation, error } = await supabase
        .from('simulations')
        .insert({
          student_id: user.id,
          simulation_type: selectedType,
          scenario_description: scenario,
          input_parameters: {
            subjects: subjects?.length || 0,
            history: history?.length || 0
          },
          predicted_outcomes: simulationResult.predicted_outcomes,
          confidence_score: simulationResult.confidence_score,
          recommendations: simulationResult.recommendations
        })
        .select()
        .single();

      if (error) throw error;

      setResult(simulationResult);
      onSimulationCreated();
      setScenario('');
    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-green-500 p-2.5 rounded-xl">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Run Simulation</h2>
          <p className="text-sm text-gray-600">Explore what-if scenarios for your academic future</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Simulation Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SIMULATION_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`text-left p-4 rounded-xl border-2 transition ${
                  selectedType === type.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="font-semibold text-gray-900 text-sm mb-1">{type.name}</div>
                <div className="text-xs text-gray-600">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="scenario" className="block text-sm font-medium text-gray-700 mb-2">
            Describe Your Scenario
          </label>
          <textarea
            id="scenario"
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="E.g., What if I increase my study hours to 25 per week?"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
          />
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={loading || !scenario.trim()}
          className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center space-x-2"
        >
          <Play className="w-5 h-5" />
          <span>{loading ? 'Running Simulation...' : 'Run Simulation'}</span>
        </button>
      </div>

      {result && (
        <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Simulation Results</h3>
            <div className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-blue-600 border border-blue-200">
              {result.confidence_score}% Confidence
            </div>
          </div>

          <div className="space-y-3">
            {Object.entries(result.predicted_outcomes).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center py-2 border-b border-blue-100 last:border-0">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {key.replace(/_/g, ' ')}
                </span>
                <span className="text-sm font-bold text-gray-900">
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </span>
              </div>
            ))}
          </div>

          {result.recommendations && result.recommendations.length > 0 && (
            <div className="mt-4 pt-4 border-t border-blue-200">
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Recommendations</h4>
              <div className="space-y-2">
                {result.recommendations.map((rec: any, idx: number) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      rec.priority === 'high'
                        ? 'bg-orange-50 border border-orange-200'
                        : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <div className="font-semibold text-xs text-gray-700 mb-1">{rec.type}</div>
                    <div className="text-sm text-gray-600">{rec.message}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
