import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Brain, Home, Upload, Target, Calendar, MessageSquare, Users, BarChart3, Settings, Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const candidateNavItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/upload', icon: Upload, label: 'Upload Resume' },
    { path: '/matches', icon: Target, label: 'Job Matches' },
    { path: '/candidate-dashboard', icon: Calendar, label: 'Interviews' },
  ];

  const hrNavItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/hr-dashboard', icon: BarChart3, label: 'HR Dashboard' },
    { path: '/matches', icon: Target, label: 'Candidates' },
  ];

  const navItems = user?.role === 'hr' ? hrNavItems : candidateNavItems;

  return (
    <div className="w-72 bg-gradient-to-b from-white to-gray-50/50 shadow-2xl border-r border-gray-100/50 backdrop-blur-sm">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">CareerAI</span>
        </Link>
      </div>

      <nav className="mt-8">
        <div className="px-6 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Navigation
          </p>
        </div>
        
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center mx-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                isActive(item.path)
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/60 hover:shadow-md'
              }`}
            >
              <Icon className={`mr-3 h-5 w-5 ${isActive(item.path) ? 'text-white' : ''}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-72 p-6">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-lg">Welcome!</p>
              <p className="text-sm opacity-90">{user?.name}</p>
            </div>
          </div>
          <p className="text-sm opacity-90 capitalize">{user?.role === 'hr' ? 'HR Dashboard' : 'Candidate Portal'}</p>
        </div>
      </div>
    </div>
  );
}