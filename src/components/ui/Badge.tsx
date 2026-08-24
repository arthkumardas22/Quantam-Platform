'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'plum' | 'lavender' | 'olive' | 'cream' | 'cyan' | 'indigo' | 'purple' | 'emerald' | 'slate' | 'outline' | 'sky' | 'storm' | 'steel' | 'coral' | 'forest' | 'blush' | 'amber';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'lavender',
  size = 'md',
  className,
  dot = false,
}) => {
  // STRICT 4-COLOR PALETTE ONLY: #FFFFE3, #DBD4FF, #808034, #723480
  const variants = {
    lavender: 'bg-[#DBD4FF] text-[#723480] border border-[#723480]/30 font-bold shadow-xs',
    plum: 'bg-[#723480] text-[#FFFFE3] border border-[#DBD4FF] font-bold shadow-xs',
    olive: 'bg-[#808034] text-[#FFFFE3] border border-[#FFFFE3]/40 font-bold shadow-xs',
    amber: 'bg-[#808034] text-[#FFFFE3] border border-[#FFFFE3]/40 font-bold shadow-xs',
    cream: 'bg-[#FFFFE3] text-[#723480] border border-[#DBD4FF] font-bold shadow-xs',
    cyan: 'bg-[#DBD4FF] text-[#723480] border border-[#723480]/30 font-bold shadow-xs',
    sky: 'bg-[#DBD4FF] text-[#723480] border border-[#723480]/30 font-bold shadow-xs',
    indigo: 'bg-[#723480] text-[#FFFFE3] border border-[#DBD4FF] font-bold shadow-xs',
    purple: 'bg-[#723480] text-[#FFFFE3] border border-[#DBD4FF] font-bold shadow-xs',
    emerald: 'bg-[#808034] text-[#FFFFE3] border border-[#FFFFE3]/40 font-bold shadow-xs',
    forest: 'bg-[#808034] text-[#FFFFE3] border border-[#FFFFE3]/40 font-bold shadow-xs',
    slate: 'bg-[#FFFFE3] text-[#723480] border border-[#DBD4FF]',
    storm: 'bg-[#723480] text-[#FFFFE3] border border-[#DBD4FF]',
    steel: 'bg-[#FFFFE3] text-[#723480] border border-[#DBD4FF]',
    blush: 'bg-[#DBD4FF] text-[#723480] border border-[#723480]/30',
    coral: 'bg-[#723480] text-[#FFFFE3] border border-[#DBD4FF]',
    outline: 'bg-transparent text-[#723480] border border-[#DBD4FF] font-semibold',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 rounded-md',
    md: 'text-xs px-2.5 py-1 rounded-full',
  };

  const dotColors = {
    lavender: 'bg-[#723480]',
    plum: 'bg-[#FFFFE3]',
    olive: 'bg-[#FFFFE3]',
    amber: 'bg-[#FFFFE3]',
    cream: 'bg-[#723480]',
    cyan: 'bg-[#723480]',
    sky: 'bg-[#723480]',
    indigo: 'bg-[#FFFFE3]',
    purple: 'bg-[#FFFFE3]',
    emerald: 'bg-[#FFFFE3]',
    forest: 'bg-[#FFFFE3]',
    slate: 'bg-[#723480]',
    storm: 'bg-[#FFFFE3]',
    steel: 'bg-[#723480]',
    blush: 'bg-[#723480]',
    coral: 'bg-[#FFFFE3]',
    outline: 'bg-[#723480]',
  };

  return (
    <span className={cn('inline-flex items-center gap-1 leading-none select-none tracking-wide', variants[variant], sizes[size], className)}>
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', dotColors[variant])} />}
      {children}
    </span>
  );
};
