import React from 'react';
import { Bell, Search, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-100 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full transition-all duration-200 bg-white/60"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-3 text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 rounded-xl">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600 capitalize font-medium">{user?.role}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="p-3 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-xl"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}