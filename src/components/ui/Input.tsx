import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

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
  className = ''
}: InputProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          disabled={disabled}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
            error ? 'border-red-500 focus:ring-red-500' : ''
          } ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}