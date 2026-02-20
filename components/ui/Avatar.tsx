import React from 'react';
import { generateInitials } from '@/utils/helpers';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className = '',
}: AvatarProps) {
  const sizeMap = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const initials = name ? generateInitials(name) : '?';

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-purple-600 text-white font-semibold overflow-hidden ${sizeMap[size]} ${className}`}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}
