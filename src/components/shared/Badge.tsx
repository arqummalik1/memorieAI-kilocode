'use client';

import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: 'violet' | 'green' | 'yellow' | 'red' | 'blue' | 'gray';
  className?: string;
}

export function Badge({ children, color = 'violet', className = '' }: BadgeProps) {
  const colors = {
    violet: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    green: 'bg-green-500/20 text-green-300 border-green-500/30',
    yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    red: 'bg-red-500/20 text-red-300 border-red-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    gray: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]} ${className}`}
    >
      {children}
    </span>
  );
}
