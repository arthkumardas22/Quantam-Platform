'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Sparkles,
  Zap,
  CheckCircle2,
  Compass,
  Volume2,
  VolumeX,
  Menu,
} from 'lucide-react';
import { useQuantum } from '@/context/QuantumContext';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/Button';
import { InteractiveTutorialModal } from '@/components/ui/InteractiveTutorialModal';
import { quantumAudio } from '@/utils/quantumAudio';

interface TopbarProps {
  onToggleMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onToggleMobileMenu }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isSimulating, setIsExplainerOpen } = useQuantum();
  const { progress } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const toggleSound = () => {
    const muted = quantumAudio.toggleMute();
    setIsMuted(muted);
    if (!muted) quantumAudio.playGateChime(659.25);
  };

  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Student Analytics';
    if (pathname === '/workspace') return 'Quantum Studio IDE';
    if (pathname === '/learn') return 'Interactive Learning Hub';
    if (pathname.startsWith('/learn/')) return 'Lesson Module Player';
    if (pathname === '/algorithms') return 'Algorithm Explorer';
    if (pathname.startsWith('/algorithms/')) return 'Algorithm Specification';
    if (pathname === '/challenges') return 'Interactive Challenges';
    if (pathname === '/tutor') return 'AI Quantum Research Assistant';
    if (pathname === '/progress') return 'Mastery & Progress';
    if (pathname === '/settings') return 'Simulator Settings';
    return 'Quantum Studio';
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
    <>
      <header className="h-14 border-b border-[#DBD4FF] bg-[#FFFFE3]/95 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 select-none shadow-xs">
        {/* Left: Mobile Drawer Button + Route Title & Status */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {onToggleMobileMenu && (
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-[#723480] hover:bg-[#DBD4FF] hover:text-[#531D5E] border border-[#DBD4FF] transition-all cursor-pointer shrink-0"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          )}

          <h1 className="text-xs sm:text-sm font-black text-[#723480] tracking-tight truncate max-w-[140px] sm:max-w-xs md:max-w-none">
            {getPageTitle()}
          </h1>

          <div className="hidden md:flex items-center gap-2 shrink-0">
            <span className="text-[#DBD4FF]">/</span>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DBD4FF] border border-[#723480]/30 text-[11px] text-[#723480] font-bold shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#808034] animate-pulse" />
              <span>AerSim Online</span>
            </div>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="relative hidden xl:block">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#808034] pointer-events-none" />
            <input
              type="text"
              placeholder="Search algorithms, gates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 pl-8 pr-3 py-1.5 text-xs bg-white border border-[#DBD4FF] rounded-xl text-[#723480] placeholder-[#723480]/60 focus:outline-none focus:border-[#531D5E] focus:ring-1 focus:ring-[#531D5E]/40 transition-all shadow-inner font-medium"
            />
          </form>

          {/* Quantum Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isMuted
                ? 'bg-white border-[#DBD4FF] text-[#723480]/60 hover:text-[#531D5E]'
                : 'bg-[#DBD4FF] border-[#531D5E]/30 text-[#531D5E] hover:bg-[#531D5E] hover:text-[#FFFFE3]'
            }`}
            title={isMuted ? 'Unmute Quantum Audio FX' : 'Mute Quantum Audio FX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Interactive Tutorial Button */}
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#DBD4FF] hover:bg-[#531D5E] text-[#723480] hover:text-[#FFFFE3] border border-[#723480]/40 hover:border-[#531D5E] text-xs font-bold transition-all shadow-xs group cursor-pointer hover:shadow-md hover:shadow-[#531D5E]/30"
            title="Open Interactive Quantum Guided Tour"
          >
            <Compass className="w-3.5 h-3.5 text-[#723480] group-hover:text-[#FFFFE3] group-hover:rotate-45 transition-all duration-300" />
            <span className="hidden sm:inline">Tutorial</span>
            <span className="px-1.5 py-0.2 rounded-md bg-[#723480] group-hover:bg-[#DBD4FF] text-[#FFFFE3] group-hover:text-[#531D5E] text-[9px] font-mono font-bold transition-colors">
              Guide
            </span>
          </button>

          {/* Explain Circuit with AI button (only on workspace) */}
          {pathname === '/workspace' && (
            <div className="hidden sm:block">
              <Button
                size="sm"
                variant="primary"
                onClick={() => setIsExplainerOpen(true)}
                leftIcon={<Sparkles className="w-3.5 h-3.5 text-[#FFFFE3]" />}
              >
                AI Explain
              </Button>
            </div>
          )}

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-1.5 sm:pl-2.5 border-l border-[#DBD4FF]">
            <div className="w-8 h-8 rounded-xl bg-[#723480] hover:bg-[#531D5E] flex items-center justify-center font-bold text-xs text-[#FFFFE3] shadow-md shadow-[#723480]/30 border border-[#DBD4FF] transition-colors cursor-pointer">
              QS
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-[#723480]">Bigslayers</div>
              <div className="text-[10px] text-[#808034] font-mono font-bold">Lvl {progress.level}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Interactive Tutorial Modal */}
      <InteractiveTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </>
  );
};

