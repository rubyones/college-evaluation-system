import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200',
    destructive: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200',
    outline: 'border border-gray-300 text-gray-800 dark:border-gray-700 dark:text-gray-200',
    success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200',
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
