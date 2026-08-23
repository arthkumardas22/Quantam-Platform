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
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import { cn } from '@/lib/utils';

export const Sidebar: React.FC = () => {
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
    { name: 'Challenges', href: '/challenges', icon: Trophy, badge: `${progress.challengesCompleted}/${progress.totalChallenges}` },
    { name: 'AI Quantum Tutor', href: '/tutor', icon: Bot, isNew: true },
    { name: 'Progress & Badges', href: '/progress', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 select-none z-30 shadow-sm">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center shadow-md shadow-cyan-600/20 group-hover:scale-105 transition-transform duration-300">
            <Atom className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>QuantamStudio_Bigslayers</span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Interactive Quantum Studio</div>
          </div>
        </Link>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group relative',
                isActive
                  ? item.highlight
                    ? 'bg-gradient-to-r from-cyan-50 to-purple-50 text-cyan-800 border border-cyan-300 shadow-sm font-semibold'
                    : 'bg-slate-100 text-cyan-700 border border-slate-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    isActive ? 'text-cyan-600' : 'text-slate-400 group-hover:text-slate-700'
                  )}
                />
                <span>{item.name}</span>
              </div>

              <div className="flex items-center gap-1.5">
                {item.badge && (
                  <span
                    className={cn(
                      'text-[10px] px-1.5 py-0.5 rounded-md font-mono',
                      item.highlight
                        ? 'bg-cyan-600 text-white font-bold shadow-sm'
                        : 'bg-slate-200 text-slate-700 border border-slate-300'
                    )}
                  >
                    {item.badge}
                  </span>
                )}
                {item.isNew && (
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-600"></span>
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Gamification & User Streak Card */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/50">
        <div className="p-3 rounded-2xl bg-white border border-slate-200 flex flex-col gap-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-bounce" />
              <span>{progress.streakDays} Day Streak</span>
            </div>
            <span className="text-[11px] font-mono text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
              Lvl {progress.level}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-slate-500 mb-1">
              <span>XP Progress</span>
              <span className="font-mono text-slate-700 font-semibold">
                {progress.currentXp} / {progress.nextLevelXp}
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(100, (progress.currentXp / progress.nextLevelXp) * 100)}%`,
                }}
              />
            </div>
          </div>

          <Link
            href="/workspace"
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-[11px] font-semibold border border-cyan-200 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Launch Quantum IDE</span>
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
