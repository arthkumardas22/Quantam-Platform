'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Bell,
  Sparkles,
  Zap,
  CheckCircle2,
  Sliders,
  Terminal,
} from 'lucide-react';
import { useQuantum } from '@/context/QuantumContext';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/Button';

export const Topbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { backend, isSimulating, runSimulation, setIsExplainerOpen } = useQuantum();
  const { progress } = useUser();
  const [searchQuery, setSearchQuery] = useState('');

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Student Analytics & Overview';
    if (pathname === '/workspace') return 'Quantum Studio IDE';
    if (pathname === '/learn') return 'Interactive Learning Hub';
    if (pathname.startsWith('/learn/')) return 'Lesson Module Player';
    if (pathname === '/algorithms') return 'Quantum Algorithm Explorer';
    if (pathname.startsWith('/algorithms/')) return 'Algorithm Specification & Math';
    if (pathname === '/challenges') return 'Interactive Quantum Challenges';
    if (pathname === '/tutor') return 'AI Quantum Research Assistant';
    if (pathname === '/progress') return 'Mastery & Certification Progress';
    if (pathname === '/settings') return 'Simulator & Hardware Settings';
    return 'Quantum Computing Studio';
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const q = searchQuery.toLowerCase();
    if (q.includes('grover') || q.includes('search')) router.push('/algorithms/grover');
    else if (q.includes('teleport')) router.push('/algorithms/teleportation');
    else if (q.includes('deutsch')) router.push('/algorithms/deutsch-jozsa');
    else if (q.includes('shor')) router.push('/algorithms/shor');
    else if (q.includes('challenge')) router.push('/challenges');
    else if (q.includes('workspace') || q.includes('circuit')) router.push('/workspace');
    else router.push('/learn');
  };

  return (
    <header className="h-14 border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 select-none shadow-sm">
      {/* Route Title & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <h1 className="text-sm font-bold text-slate-800 tracking-tight">
          {getPageTitle()}
        </h1>
        <div className="hidden md:flex items-center gap-2">
          <span className="text-slate-300">/</span>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-700 font-semibold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>AerSim Engine Online</span>
          </div>
        </div>
      </div>

      {/* Right Controls & Search */}
      <div className="flex items-center gap-3">
        {/* Quick Search */}
        <form onSubmit={handleSearchSubmit} className="relative hidden lg:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search algorithms, gates, lessons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-inner"
          />
        </form>

        {/* Explain Circuit with AI button (active on workspace) */}
        {pathname === '/workspace' && (
          <Button
            size="sm"
            variant="quantum"
            onClick={() => setIsExplainerOpen(true)}
            leftIcon={<Sparkles className="w-3.5 h-3.5 text-amber-200" />}
          >
            Explain with AI
          </Button>
        )}

        {/* User Profile / Level badge */}
        <div className="flex items-center gap-2.5 pl-2.5 border-l border-slate-200">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center font-bold text-xs text-white shadow-md shadow-cyan-600/20">
            QS
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-800">Bigslayers Explorer</div>
            <div className="text-[10px] text-slate-500 font-mono font-medium">Level {progress.level} Scholar</div>
          </div>
        </div>
      </div>
    </header>
  );
};
