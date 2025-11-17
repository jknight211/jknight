import { AuthProvider, useAuth } from './contexts/AuthContext';
import { GameLanding } from './components/Auth/GameLanding';
import { RoadmapView } from './components/Roadmap/RoadmapView';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!user) {
    return <GameLanding />;
  }

  return <RoadmapView />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
