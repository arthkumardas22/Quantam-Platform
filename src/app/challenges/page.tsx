'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { CHALLENGES, submitChallenge, ChallengeSubmissionResult } from '@/services/challengeApi';
import { useQuantum } from '@/context/QuantumContext';
import { useUser } from '@/context/UserContext';
import { CircuitBuilder } from '@/components/quantum/CircuitBuilder';
import { GatePalette } from '@/components/quantum/GatePalette';
import {
  Trophy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  Cpu,
  Layers,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import confetti from 'canvas-confetti';
import { cn } from '@/lib/utils';

export default function ChallengesPage() {
  const { circuit, clearCircuit, loadPreset } = useQuantum();
  const { markChallengeCompleted, progress } = useUser();

  const [activeChallengeId, setActiveChallengeId] = useState(CHALLENGES[0].id);
  const [submissionResult, setSubmissionResult] = useState<ChallengeSubmissionResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showHintIndex, setShowHintIndex] = useState<number | null>(null);
  const [mobileTab, setMobileTab] = useState<'specs' | 'circuit' | 'palette'>('specs');

  const activeChallenge = CHALLENGES.find((c) => c.id === activeChallengeId) || CHALLENGES[0];
  const isCompleted = progress.completedChallengeIds.includes(activeChallenge.id);

  const handleSelectChallenge = (id: string) => {
    setActiveChallengeId(id);
    setSubmissionResult(null);
    setShowHintIndex(null);
  };

  const handleVerify = async () => {
    setIsEvaluating(true);
    try {
      const result = await submitChallenge(activeChallenge.id, circuit);
      setSubmissionResult(result);

      if (result.success) {
        markChallengeCompleted(activeChallenge.id, result.xpEarned);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-[#FFFFE3]/40 overflow-hidden text-[#723480]">
        {/* Header & Challenge Selector */}
        <div className="p-3 sm:p-4 bg-white border-b border-[#DBD4FF] flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#723480] flex items-center justify-center text-[#FFFFE3] shadow-md shadow-[#723480]/30 shrink-0">
              <Trophy className="w-5 h-5 text-[#FFFFE3]" />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black text-[#531D5E] flex items-center gap-2">
                <span>Interactive Challenges</span>
                <Badge variant="plum">+{activeChallenge.xp} XP</Badge>
              </h1>
              <p className="text-[11px] text-[#808034] font-bold">
                Synthesize target quantum unitaries and verify state fidelity
              </p>
            </div>
          </div>

          {/* Challenge Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CHALLENGES.map((ch) => {
              const isChDone = progress.completedChallengeIds.includes(ch.id);
              const isActive = ch.id === activeChallengeId;

              return (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChallenge(ch.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#531D5E] text-[#FFFFE3] shadow-xs'
                      : 'bg-[#FFFFE3] text-[#723480] hover:bg-[#DBD4FF] border border-[#DBD4FF]'
                  }`}
                >
                  {isChDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{ch.title.split(' ')[0]} {ch.title.split(' ')[1]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile View Toggle Tabs (<lg screens) */}
        <div className="lg:hidden flex items-center justify-around bg-white border-b border-[#DBD4FF] p-1 text-xs shadow-xs shrink-0">
          <button
            onClick={() => setMobileTab('specs')}
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer',
              mobileTab === 'specs'
                ? 'bg-[#531D5E] text-[#FFFFE3] shadow-xs'
                : 'text-[#723480] hover:bg-[#DBD4FF]'
            )}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Goals & Specs</span>
          </button>

          <button
            onClick={() => setMobileTab('circuit')}
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer',
              mobileTab === 'circuit'
                ? 'bg-[#531D5E] text-[#FFFFE3] shadow-xs'
                : 'text-[#723480] hover:bg-[#DBD4FF]'
            )}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Circuit Grid</span>
          </button>

          <button
            onClick={() => setMobileTab('palette')}
            className={cn(
              'flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer',
              mobileTab === 'palette'
                ? 'bg-[#531D5E] text-[#FFFFE3] shadow-xs'
                : 'text-[#723480] hover:bg-[#DBD4FF]'
            )}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Gates</span>
          </button>
        </div>

        {/* Challenge Main Workspace */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* Left / Instructions Panel */}
          <div
            className={cn(
              'w-full lg:w-96 bg-white border-r border-[#DBD4FF] flex flex-col overflow-y-auto p-4 sm:p-5 space-y-4 shrink-0 shadow-xs',
              mobileTab !== 'specs' && 'hidden lg:flex'
            )}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="plum">{activeChallenge.category}</Badge>
                <span className="text-xs font-mono text-[#531D5E] font-black">
                  {activeChallenge.targetQubits} Qubits
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-black text-[#531D5E]">{activeChallenge.title}</h2>
              <p className="text-xs text-[#723480] mt-1 leading-relaxed font-normal">
                {activeChallenge.description}
              </p>
            </div>

            {/* Step-by-step instructions */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-[#808034] uppercase tracking-wider">
                Instructions
              </h3>
              <ol className="space-y-1.5">
                {activeChallenge.instructions.map((ins, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-[#723480] flex items-start gap-2 bg-[#FFFFE3] p-2.5 rounded-2xl border border-[#DBD4FF] shadow-2xs font-medium"
                  >
                    <span className="w-4 h-4 rounded-full bg-[#DBD4FF] text-[#531D5E] text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{ins}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Expected Probability Distribution */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-[#FFFFE3] border border-[#DBD4FF] space-y-1.5 font-mono text-xs shadow-inner">
              <span className="text-[10px] uppercase font-bold text-[#808034]">
                Target Output States
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {Object.entries(activeChallenge.expectedDistribution).map(([st, p]) => (
                  <span
                    key={st}
                    className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs"
                  >
                    |{st}⟩: {(p * 100).toFixed(0)}%
                  </span>
                ))}
              </div>
            </div>

            {/* Hints Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#808034] uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-[#808034]" />
                  Hints ({activeChallenge.hints.length})
                </span>
                <button
                  onClick={() =>
                    setShowHintIndex((curr) =>
                      curr === null ? 0 : (curr + 1) % activeChallenge.hints.length
                    )
                  }
                  className="text-[#531D5E] hover:text-[#723480] normal-case font-bold text-xs cursor-pointer"
                >
                  {showHintIndex === null ? 'Reveal Hint' : 'Next Hint'}
                </button>
              </div>

              {showHintIndex !== null && (
                <div className="p-3 sm:p-3.5 rounded-2xl bg-[#FFFFE3] border-2 border-[#DBD4FF] text-xs text-[#531D5E] leading-relaxed shadow-xs">
                  💡 {activeChallenge.hints[showHintIndex]}
                </div>
              )}
            </div>

            {/* Verification Result Feedback Box */}
            {submissionResult && (
              <div
                className={`p-3.5 sm:p-4 rounded-2xl border-2 space-y-2 shadow-sm ${
                  submissionResult.success
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-900'
                    : 'bg-rose-50 border-rose-400 text-rose-900'
                }`}
              >
                <div className="flex items-center gap-2 font-bold text-xs">
                  {submissionResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{submissionResult.message}</span>
                </div>

                <div className="text-[11px] font-mono space-y-0.5 pt-2 border-t border-slate-200">
                  {submissionResult.details.map((d, i) => (
                    <div key={i}>{d}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Verification Button */}
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={handleVerify}
                isLoading={isEvaluating}
                leftIcon={<Play className="w-4 h-4 fill-current" />}
              >
                Submit & Verify Circuit
              </Button>
            </div>
          </div>

          {/* Right / Interactive Studio Grid */}
          <div
            className={cn(
              'flex-1 flex min-h-0 overflow-hidden',
              mobileTab === 'specs' && 'hidden lg:flex'
            )}
          >
            <div className={cn('h-full flex', mobileTab === 'circuit' && 'hidden lg:flex')}>
              <GatePalette />
            </div>
            <div
              className={cn(
                'flex-1 flex flex-col min-w-0 overflow-hidden',
                mobileTab === 'palette' && 'hidden lg:flex'
              )}
            >
              <CircuitBuilder />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

