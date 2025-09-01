import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
}

export default function Card({ children, className = '', hover = false, gradient = false }: CardProps) {
  const baseClasses = 'bg-white rounded-2xl shadow-sm border border-gray-100';
  const hoverClasses = hover ? 'hover:shadow-lg hover:border-gray-200 transition-all duration-300' : '';
  const gradientClasses = gradient ? 'bg-gradient-to-br from-white to-gray-50' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`}>
      {children}
    </div>
  );
}