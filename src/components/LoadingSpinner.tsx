import React from 'react';
import { Brain } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-bounce-gentle mb-4">
          <Brain className="h-12 w-12 text-primary-600 mx-auto" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">CareerAI</h2>
        <p className="text-gray-600">Loading your dashboard...</p>
      </div>
    </div>
  );
}