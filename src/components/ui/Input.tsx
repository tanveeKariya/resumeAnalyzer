import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  error?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Input({
  type = 'text',
  placeholder,
  value,
  onChange,
  icon: Icon,
  error,
  label,
  required = false,
  disabled = false,
  className = '',
  size = 'md'
}: InputProps) {
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg'
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative group">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-brand-500 transition-colors" />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`input-field ${Icon ? 'pl-12' : ''} ${sizeClasses[size]} ${
            error 
              ? 'border-rose-300 focus:ring-rose-500 focus:border-rose-500' 
              : 'focus:ring-brand-500 focus:border-brand-500'
          } ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-60' : 'hover:border-slate-400'}`}
        />
      </div>
      {error && (
        <p className="text-sm text-rose-600 font-medium animate-slide-down">{error}</p>
      )}
    </div>
  );
}