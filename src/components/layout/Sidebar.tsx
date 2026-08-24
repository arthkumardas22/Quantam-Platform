'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Atom,
  Cpu,
  BookOpen,
  GitFork,
  Trophy,
  Bot,
  BarChart3,
  Settings,
  Flame,
  Layers,
  Sparkles,
  ChevronRight,
  X,
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { cn } from '@/lib/utils';


interface SidebarProps {
  isMobileOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onClose }) => {
  const pathname = usePathname();
  const { progress } = useUser();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Layers },
    {
      name: 'Quantum Studio',
      href: '/workspace',
      icon: Cpu,
      badge: 'IDE',
      highlight: true,
    },
    { name: 'Learning Hub', href: '/learn', icon: BookOpen },
    { name: 'Algorithms', href: '/algorithms', icon: GitFork },
    {
      name: 'Challenges',
      href: '/challenges',
      icon: Trophy,
      badge: `${progress.challengesCompleted}/${progress.totalChallenges}`,
    },
    { name: 'AI Quantum Tutor', href: '/tutor', icon: Bot, isNew: true },
    { name: 'Progress & Badges', href: '/progress', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  const renderNavContent = () => (
    <>
      {/* Brand Header */}
      <div className="p-4 border-b border-[#DBD4FF] flex items-center justify-between bg-[#FFFFE3]">
        <Link href="/" onClick={handleLinkClick} className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#723480] group-hover:bg-[#531D5E] flex items-center justify-center shadow-md shadow-[#723480]/30 group-hover:scale-105 transition-all duration-300 border border-[#DBD4FF]">
            <Atom className="w-5 h-5 text-[#FFFFE3] animate-spin-slow" />
          </div>
          <div>
            <div className="font-black text-sm tracking-tight text-[#723480] group-hover:text-[#531D5E] transition-colors flex items-center gap-1.5">
              <span>QuantamStudio</span>
            </div>
            <div className="text-[11px] text-[#808034] font-bold">Interactive Quantum Studio</div>
          </div>
        </Link>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-xl text-[#723480] hover:bg-[#DBD4FF] hover:text-[#531D5E] transition-colors cursor-pointer"
            title="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1 bg-white">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-[#808034]">
          Navigation
        </div>
        {navigation.map((item) => {
          const isActive =
            pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={handleLinkClick}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group relative',
                isActive
                  ? item.highlight
                    ? 'bg-[#DBD4FF] text-[#531D5E] border border-[#531D5E] shadow-xs'
                    : 'bg-[#FFFFE3] text-[#531D5E] border border-[#531D5E]/40'
                  : 'text-[#723480] hover:text-[#531D5E] hover:bg-[#DBD4FF]/60 hover:border-[#531D5E]/30'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-[#531D5E]' : 'text-[#808034] group-hover:text-[#531D5E]'
                  )}
                />
                <span>{item.name}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold',
                      item.highlight
                        ? 'bg-[#723480] text-[#FFFFE3] group-hover:bg-[#531D5E] shadow-xs'
                        : 'bg-[#DBD4FF] text-[#531D5E] border border-[#531D5E]/30'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                {item.isNew && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#723480] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#723480]"></span>
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Gamification Streak & Progress Card */}
      <div className="p-3 border-t border-[#DBD4FF] bg-[#FFFFE3]">
        <div className="p-3 rounded-2xl bg-white border border-[#DBD4FF] hover:border-[#531D5E] transition-colors flex flex-col gap-2.5 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#723480]">
              <Flame className="w-4 h-4 fill-[#723480] text-[#723480]" />
              <span>{progress.streakDays} Day Streak</span>
            </div>
            <span className="text-[11px] font-mono text-[#531D5E] font-bold bg-[#DBD4FF] px-2 py-0.5 rounded-md border border-[#531D5E]/40">
              Lvl {progress.level}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-[#808034] mb-1 font-bold">
              <span>XP Progress</span>
              <span className="font-mono text-[#723480] font-bold">
                {progress.currentXp} / {progress.nextLevelXp}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#FFFFE3] rounded-full overflow-hidden border border-[#DBD4FF]">
              <div
                className="h-full bg-gradient-to-r from-[#723480] to-[#808034] rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (progress.currentXp / progress.nextLevelXp) * 100)}%`,
                }}
              />
            </div>
          </div>

          <Link
            href="/workspace"
            onClick={handleLinkClick}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-[#DBD4FF] hover:bg-[#531D5E] text-[#723480] hover:text-[#FFFFE3] text-[11px] font-bold border border-[#723480]/40 hover:border-[#531D5E] transition-all shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Quantum IDE</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Static Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 bg-white border-r border-[#DBD4FF] flex-col h-screen sticky top-0 select-none z-30 shadow-xs">
        {renderNavContent()}
      </aside>

      {/* Mobile & Tablet Slide-Over Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop blur overlay */}
          <div
            onClick={onClose}
            className="fixed inset-0 bg-[#531D5E]/40 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
          />

          {/* Drawer container */}
          <aside className="relative w-72 max-w-[85vw] bg-white border-r border-[#DBD4FF] flex flex-col h-full z-10 shadow-2xl animate-slide-in">
            {renderNavContent()}
          </aside>
        </div>
      )}
    </>
  );
};

