import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  gradient?: boolean;
  glass?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  shadow?: 'none' | 'soft' | 'medium' | 'large';
}

export default function Card({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false,
  glass = false,
  padding = 'lg',
  shadow = 'soft'
}: CardProps) {
  const baseClasses = 'rounded-3xl border transition-all duration-300';
  
  const backgroundClasses = glass 
    ? 'glass' 
    : gradient 
    ? 'gradient-surface border-white/20' 
    : 'bg-white border-slate-200/60';
  
  const hoverClasses = hover ? 'card-hover' : '';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const shadowClasses = {
    none: '',
    soft: 'shadow-soft',
    medium: 'shadow-medium',
    large: 'shadow-large'
  };
  
  return (
    <div className={`${baseClasses} ${backgroundClasses} ${hoverClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${className}`}>
      {children}
    </div>
  );
}