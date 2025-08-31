import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Brain, 
  Home, 
  Upload, 
  Target, 
  Calendar, 
  MessageSquare, 
  Users,
  BarChart3,
  Settings 
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
    <div className="w-64 bg-white shadow-lg border-r border-gray-200">
      <div className="p-6">
        <Link to="/" className="flex items-center space-x-2">
          <Brain className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold text-gray-900">CareerAI</span>
        </Link>
      </div>

      <nav className="mt-6">
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
              className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive(item.path)
                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-64 p-6">
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-lg p-4 text-white text-sm">
          <p className="font-semibold">Welcome, {user?.name}!</p>
          <p className="opacity-90">{user?.role === 'hr' ? 'HR Account' : 'Candidate Account'}</p>
        </div>
      </div>
    </div>
  );
}