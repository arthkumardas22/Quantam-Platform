'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose' | 'slate' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'cyan',
  size = 'md',
  className,
}) => {
  const variants = {
    cyan: 'bg-cyan-50 text-cyan-700 border border-cyan-300 shadow-sm',
    purple: 'bg-purple-50 text-purple-700 border border-purple-300 shadow-sm',
    emerald: 'bg-emerald-50 text-emerald-700 border border-emerald-300 shadow-sm',
    amber: 'bg-amber-50 text-amber-800 border border-amber-300 shadow-sm',
    rose: 'bg-rose-50 text-rose-700 border border-rose-300 shadow-sm',
    slate: 'bg-slate-100 text-slate-700 border border-slate-300',
    outline: 'bg-transparent text-slate-600 border border-slate-300',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded-md',
    md: 'text-xs px-2.5 py-1 font-semibold rounded-full',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 leading-none tracking-wide select-none', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};
