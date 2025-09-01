import React from 'react';
import { Bell, Search, LogOut, Sparkles, Settings, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="glass border-b border-slate-200/60 px-8 py-6 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        {/* Search Section */}
        <div className="flex items-center space-x-6 flex-1">
          <div className="relative max-w-lg flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidates, jobs, interviews..."
              className="w-full pl-12 pr-6 py-4 glass rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 text-slate-900 placeholder-slate-500"
            />
          </div>
        </div>

        {/* Actions Section */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-3 text-slate-500 hover:text-slate-700 transition-colors hover:bg-slate-100 rounded-2xl group">
            <Bell className="h-6 w-6" />
            <span className="absolute top-2 right-2 w-3 h-3 bg-rose-500 rounded-full animate-pulse-soft shadow-glow"></span>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded-lg whitespace-nowrap">
                3 new notifications
              </div>
            </div>
          </button>
          
          {/* Settings */}
          <button className="p-3 text-slate-500 hover:text-slate-700 transition-colors hover:bg-slate-100 rounded-2xl">
            <Settings className="h-6 w-6" />
          </button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-4 pl-4 border-l border-slate-200">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500 capitalize font-semibold">
                {user?.role === 'hr' ? 'HR Manager' : 'Job Candidate'}
              </p>
            </div>
            
            <div className="relative group">
              <div className="w-12 h-12 gradient-brand rounded-2xl flex items-center justify-center text-white font-bold shadow-medium group-hover:shadow-large transition-all duration-300 cursor-pointer">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 glass rounded-2xl shadow-large opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-slate-200/60">
                <div className="p-2">
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-100 rounded-xl transition-colors">
                    <User className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Profile Settings</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-slate-100 rounded-xl transition-colors">
                    <Settings className="h-4 w-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-700">Preferences</span>
                  </button>
                  <hr className="my-2 border-slate-200" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-rose-50 rounded-xl transition-colors group/logout"
                  >
                    <LogOut className="h-4 w-4 text-slate-500 group-hover/logout:text-rose-500" />
                    <span className="text-sm font-medium text-slate-700 group-hover/logout:text-rose-600">Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}