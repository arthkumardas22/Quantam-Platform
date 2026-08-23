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
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import confetti from 'canvas-confetti';

export default function ChallengesPage() {
  const { circuit, clearCircuit, loadPreset } = useQuantum();
  const { markChallengeCompleted, progress } = useUser();

  const [activeChallengeId, setActiveChallengeId] = useState(CHALLENGES[0].id);
  const [submissionResult, setSubmissionResult] = useState<ChallengeSubmissionResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showHintIndex, setShowHintIndex] = useState<number | null>(null);

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
      <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
        {/* Header & Challenge Selector */}
        <div className="p-4 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>Interactive Quantum Challenges</span>
                <Badge variant="amber">+{activeChallenge.xp} XP</Badge>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Synthesize target quantum unitaries and verify state fidelity
              </p>
            </div>
          </div>

          {/* Challenge Selector Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {CHALLENGES.map((ch) => {
              const isChDone = progress.completedChallengeIds.includes(ch.id);
              const isActive = ch.id === activeChallengeId;

              return (
                <button
                  key={ch.id}
                  onClick={() => handleSelectChallenge(ch.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shadow-xs ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {isChDone && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                  <span>{ch.title.split(' ')[0]} {ch.title.split(' ')[1]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Challenge Main Workspace */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
          {/* Left / Instructions Panel */}
          <div className="w-full lg:w-96 bg-white border-r border-slate-200 flex flex-col overflow-y-auto p-5 space-y-4 shrink-0 shadow-sm">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge variant="purple">{activeChallenge.category}</Badge>
                <span className="text-xs font-mono text-cyan-700 font-bold">
                  {activeChallenge.targetQubits} Qubits Required
                </span>
              </div>
              <h2 className="text-base font-bold text-slate-900">{activeChallenge.title}</h2>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {activeChallenge.description}
              </p>
            </div>

            {/* Step-by-step instructions */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Instructions
              </h3>
              <ol className="space-y-1.5">
                {activeChallenge.instructions.map((ins, idx) => (
                  <li
                    key={idx}
                    className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 shadow-2xs"
                  >
                    <span className="w-4 h-4 rounded-full bg-cyan-100 text-cyan-800 text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{ins}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Expected Probability Distribution */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono text-xs shadow-inner">
              <span className="text-[10px] uppercase font-bold text-slate-500">
                Target Output States
              </span>
              <div className="flex flex-wrap gap-2 pt-1">
                {Object.entries(activeChallenge.expectedDistribution).map(([st, p]) => (
                  <span
                    key={st}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-bold shadow-xs"
                  >
                    |{st}⟩: {(p * 100).toFixed(0)}%
                  </span>
                ))}
              </div>
            </div>

            {/* Hints Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                  Hints ({activeChallenge.hints.length})
                </span>
                <button
                  onClick={() =>
                    setShowHintIndex((curr) =>
                      curr === null ? 0 : (curr + 1) % activeChallenge.hints.length
                    )
                  }
                  className="text-cyan-700 hover:text-cyan-800 normal-case font-bold text-xs"
                >
                  {showHintIndex === null ? 'Reveal Hint' : 'Next Hint'}
                </button>
              </div>

              {showHintIndex !== null && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed animate-in fade-in shadow-xs">
                  💡 {activeChallenge.hints[showHintIndex]}
                </div>
              )}
            </div>

            {/* Verification Result Feedback Box */}
            {submissionResult && (
              <div
                className={`p-4 rounded-2xl border space-y-2 animate-in fade-in shadow-sm ${
                  submissionResult.success
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                    : 'bg-rose-50 border-rose-300 text-rose-900'
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
                variant="quantum"
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
          <div className="flex-1 flex min-h-0 overflow-hidden">
            <GatePalette />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
              <CircuitBuilder />
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
