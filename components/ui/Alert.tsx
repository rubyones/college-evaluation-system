import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({
  variant = 'info',
  title,
  children,
  className = '',
}: AlertProps) {
  const variantConfig = {
    info: {
      bg: 'bg-purple-50 dark:bg-purple-900/30',
      border: 'border-purple-200 dark:border-purple-700',
      icon: Info,
      text: 'text-purple-800 dark:text-purple-200',
      titleColor: 'text-purple-900 dark:text-purple-100',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/30',
      border: 'border-green-200 dark:border-green-700',
      icon: CheckCircle,
      text: 'text-green-800 dark:text-green-200',
      titleColor: 'text-green-900 dark:text-green-100',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/30',
      border: 'border-yellow-200 dark:border-yellow-700',
      icon: AlertTriangle,
      text: 'text-yellow-800 dark:text-yellow-200',
      titleColor: 'text-yellow-900 dark:text-yellow-100',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-900/30',
      border: 'border-red-200 dark:border-red-700',
      icon: AlertCircle,
      text: 'text-red-800 dark:text-red-200',
      titleColor: 'text-red-900 dark:text-red-100',
    },
  };

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4 ${className}`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.text}`} />
        <div className="flex-1">
          {title && <h4 className={`font-semibold ${config.titleColor} mb-1`}>{title}</h4>}
          <div className={config.text}>{children}</div>
        </div>
      </div>
    </div>
  );
}
