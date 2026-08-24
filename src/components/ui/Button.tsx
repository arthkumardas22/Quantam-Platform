'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'quantum' | 'olive' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-bold tracking-tight transition-all duration-200 rounded-xl select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#531D5E]/50 disabled:opacity-50 disabled:cursor-not-allowed';

  // STRICT 4-COLOR PALETTE WITH DARKENED HOVER COLORS (#531D5E, #5E5E22, #BDB3FA)
  const variants = {
    primary:
      'bg-[#723480] hover:bg-[#531D5E] text-[#FFFFE3] shadow-md shadow-[#723480]/25 hover:shadow-lg hover:shadow-[#531D5E]/40 hover:-translate-y-0.5 active:translate-y-0 active:scale-98',
    glow:
      'bg-[#723480] hover:bg-[#531D5E] text-[#FFFFE3] shadow-lg shadow-[#723480]/35 hover:shadow-[#531D5E]/50 hover:-translate-y-0.5 active:scale-98',
    secondary:
      'bg-[#DBD4FF] hover:bg-[#BDB3FA] text-[#723480] hover:text-[#531D5E] border border-[#723480]/30 hover:border-[#531D5E] shadow-xs hover:-translate-y-0.5 active:scale-98',
    olive:
      'bg-[#808034] hover:bg-[#5E5E22] text-[#FFFFE3] shadow-md shadow-[#808034]/25 hover:shadow-lg hover:shadow-[#5E5E22]/40 hover:-translate-y-0.5 active:scale-98',
    quantum:
      'bg-gradient-to-r from-[#723480] via-[#808034] to-[#723480] hover:from-[#531D5E] hover:to-[#531D5E] text-[#FFFFE3] shadow-md hover:shadow-lg hover:shadow-[#531D5E]/40 hover:-translate-y-0.5 active:scale-98',
    outline:
      'border border-[#DBD4FF] hover:border-[#531D5E] bg-[#FFFFE3] text-[#723480] hover:text-[#531D5E] hover:bg-[#DBD4FF] shadow-xs hover:-translate-y-0.5 active:scale-98',
    ghost:
      'bg-transparent hover:bg-[#DBD4FF] text-[#723480] hover:text-[#531D5E]',
    danger:
      'bg-[#DBD4FF]/50 hover:bg-[#BDB3FA] text-[#723480] hover:text-[#531D5E] border border-[#723480]/40 hover:border-[#531D5E] active:scale-98',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-2.5 gap-2.5',
    icon: 'p-2 w-9 h-9',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
