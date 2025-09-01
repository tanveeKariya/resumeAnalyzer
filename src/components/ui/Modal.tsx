import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl'
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-fade-in" 
          onClick={onClose} 
        />
        <div className={`relative glass shadow-large ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto animate-scale-in rounded-3xl`}>
          <div className="flex items-center justify-between p-8 border-b border-slate-200/60">
            <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors group"
            >
              <X className="h-6 w-6 text-slate-500 group-hover:text-slate-700" />
            </button>
          </div>
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}