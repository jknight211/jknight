import { useAuth } from '../../contexts/AuthContext';
import { LogOut, Brain } from 'lucide-react';

export function Header() {
  const { signOut } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-600 to-green-600 p-2 rounded-xl">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Academic Digital Twin</h1>
              <p className="text-xs text-gray-500">Simulate Your Future</p>
            </div>
          </div>

          <button
            onClick={signOut}
            className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
