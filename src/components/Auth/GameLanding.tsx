import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Gamepad2, Sparkles, Trophy, Zap, Target, BookOpen } from 'lucide-react';

export function GameLanding() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp(email, password, fullName, 'Primary 1', 'Not Set');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (showLogin || showSignUp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative w-full max-w-md">
          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-3xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 animate-bounce">
                <Gamepad2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-black text-white mb-2 tracking-tight">
                {showSignUp ? 'JOIN THE GAME' : 'WELCOME BACK'}
              </h2>
              <p className="text-slate-400">
                {showSignUp ? 'Create your account to start your journey' : 'Sign in to continue your adventure'}
              </p>
            </div>

            <form onSubmit={showSignUp ? handleSignUp : handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {showSignUp && (
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                    placeholder="Enter your name"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3.5 rounded-xl font-bold hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-[1.02]"
              >
                {loading ? 'LOADING...' : showSignUp ? 'START ADVENTURE' : 'ENTER GAME'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setShowLogin(!showLogin);
                  setShowSignUp(!showSignUp);
                  setError('');
                }}
                className="text-cyan-400 font-semibold hover:text-cyan-300 transition"
              >
                {showSignUp ? 'Already have an account? Sign In' : "Don't have an account? Join Now"}
              </button>
            </div>

            <button
              onClick={() => {
                setShowLogin(false);
                setShowSignUp(false);
                setError('');
              }}
              className="mt-4 w-full text-slate-400 hover:text-white transition text-sm"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]"></div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-50 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-6 rounded-3xl">
                <Gamepad2 className="w-16 h-16 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-7xl font-black mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
            IDARETHON
          </h1>

          <p className="text-3xl font-bold text-white mb-6">
            DO YOU DARE TO JOIN UP?
          </p>

          <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Embark on an epic educational journey. Chart your academic path from primary school to your dream career.
            Build your roadmap, track your progress, and discover your future with AI-powered insights.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/70 transition transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Map Your Journey</h3>
              <p className="text-sm text-slate-400">13 steps from Primary 1 to your dream career</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/70 transition transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Companion</h3>
              <p className="text-sm text-slate-400">Your personalized 3D avatar guides you</p>
            </div>

            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 hover:bg-slate-800/70 transition transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Career Match</h3>
              <p className="text-sm text-slate-400">AI predicts your perfect career path</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setShowSignUp(true)}
              className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-lg rounded-xl hover:from-blue-700 hover:to-cyan-700 transition transform hover:scale-105 shadow-2xl"
            >
              <span className="flex items-center space-x-2">
                <Zap className="w-5 h-5" />
                <span>START YOUR JOURNEY</span>
              </span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 blur-xl opacity-50 group-hover:opacity-75 transition -z-10"></div>
            </button>

            <button
              onClick={() => setShowLogin(true)}
              className="px-10 py-4 bg-slate-800 text-white font-bold text-lg rounded-xl border-2 border-slate-700 hover:bg-slate-700 transition transform hover:scale-105"
            >
              CONTINUE GAME
            </button>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 text-slate-400">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span className="text-sm">13 Levels</span>
            </div>
            <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm">AI Powered</span>
            </div>
            <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
            <div className="flex items-center space-x-2">
              <Trophy className="w-5 h-5" />
              <span className="text-sm">Career Insights</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
