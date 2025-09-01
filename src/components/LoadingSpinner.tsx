import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-brand-50 to-violet-100 flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="text-center relative z-10">
        <div className="relative mb-8">
          <div className="w-24 h-24 gradient-brand rounded-3xl flex items-center justify-center mx-auto shadow-large animate-bounce-gentle">
            <Brain className="h-12 w-12 text-white" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-violet-500 to-violet-600 rounded-full flex items-center justify-center animate-pulse-soft">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-4">CareerAI</h2>
        <p className="text-slate-600 text-lg font-medium mb-8">Loading your intelligent dashboard...</p>
        
        {/* Loading Progress */}
        <div className="w-64 mx-auto">
          <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
            <div className="bg-gradient-to-r from-brand-500 to-violet-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
          </div>
          <p className="text-sm text-slate-500 font-medium">Initializing AI systems...</p>
        </div>
      </div>
    </div>
  );
}