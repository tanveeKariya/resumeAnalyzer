import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Brain, Home, Upload, Target, Calendar, MessageSquare, Users, BarChart3, Settings, Sparkles, Zap
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Sidebar() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const candidateNavItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', description: 'Overview & stats' },
    { path: '/upload', icon: Upload, label: 'Upload Resume', description: 'AI analysis' },
    { path: '/matches', icon: Target, label: 'Job Matches', description: 'Find opportunities' },
    { path: '/candidate-dashboard', icon: Calendar, label: 'Interviews', description: 'Schedule & manage' },
  ];

  const hrNavItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', description: 'Overview & insights' },
    { path: '/hr-dashboard', icon: BarChart3, label: 'HR Dashboard', description: 'Manage recruitment' },
    { path: '/matches', icon: Target, label: 'Candidates', description: 'Review applications' },
  ];

  const navItems = user?.role === 'hr' ? hrNavItems : candidateNavItems;

  return (
    <div className="w-80 glass border-r border-slate-200/60 min-h-screen">
      {/* Logo Section */}
      <div className="p-8 border-b border-slate-200/60">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 gradient-brand rounded-2xl flex items-center justify-center shadow-medium group-hover:shadow-large transition-all duration-300 group-hover:scale-105">
            <Brain className="h-7 w-7 text-white" />
          </div>
          <div>
            <span className="text-2xl font-bold gradient-text">CareerAI</span>
            <p className="text-xs text-slate-500 font-medium">Intelligent Hiring</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="p-6">
        <div className="mb-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
            Navigation
          </p>
        </div>
        
        <div className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={active ? 'nav-item-active' : 'nav-item-inactive'}
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    active 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${active ? 'text-white' : 'text-slate-900'}`}>
                      {item.label}
                    </p>
                    <p className={`text-xs ${active ? 'text-white/80' : 'text-slate-500'}`}>
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Profile Card */}
      <div className="absolute bottom-0 w-80 p-6">
        <div className="gradient-brand rounded-3xl p-6 text-white shadow-large relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
          </div>
          
          <div className="relative">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-medium">
                <span className="text-xl font-bold text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg text-white">{user?.name}</p>
                <p className="text-sm text-white/80 capitalize font-medium">
                  {user?.role === 'hr' ? 'HR Manager' : 'Job Candidate'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-white/80" />
              <p className="text-sm text-white/90 font-medium">
                {user?.role === 'hr' ? 'Recruitment Dashboard' : 'Career Portal'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}