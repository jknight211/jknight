import { useState, useEffect } from 'react';
import { Header } from './Header';
import { SimulationPanel } from './SimulationPanel';
import { ProfilePanel } from './ProfilePanel';
import { SimulationHistory } from './SimulationHistory';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

interface StudentProfile {
  id: string;
  full_name: string;
  current_level: string;
  school_name: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulationCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {profile && (
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back, {profile.full_name}</h2>
            <p className="text-gray-600 mt-1">{profile.current_level} at {profile.school_name}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SimulationPanel onSimulationCreated={handleSimulationCreated} />
            <SimulationHistory key={refreshKey} />
          </div>

          <div className="lg:col-span-1">
            <ProfilePanel profile={profile} />
          </div>
        </div>
      </main>
    </div>
  );
}
