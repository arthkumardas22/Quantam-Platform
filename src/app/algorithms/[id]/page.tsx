'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { QUANTUM_ALGORITHMS } from '@/services/learningApi';
import { useQuantum } from '@/context/QuantumContext';
import {
  ArrowLeft,
  Cpu,
  Play,
  Layers,
  Sparkles,
  GitFork,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function AlgorithmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { loadPreset } = useQuantum();

  const algo =
    QUANTUM_ALGORITHMS.find((a) => a.id === resolvedParams.id) ||
    QUANTUM_ALGORITHMS[0];

  const handleLaunchStudio = () => {
    loadPreset(algo.defaultCircuitPresetId);
    router.push('/workspace');
  };

  return (
    <AppShell>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
        {/* Back and Action Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/algorithms"
            className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-purple-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Algorithms Explorer</span>
          </Link>

          <Button
            variant="quantum"
            size="sm"
            onClick={handleLaunchStudio}
            leftIcon={<Cpu className="w-3.5 h-3.5" />}
          >
            Open in Quantum Studio
          </Button>
        </div>

        {/* Hero Card */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-purple-50 via-white to-cyan-50 border border-purple-200 shadow-xl space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="purple">{algo.category}</Badge>
            <Badge variant="cyan">{algo.speedupType} Speedup</Badge>
            <Badge variant="amber">{algo.difficulty}</Badge>
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900">{algo.name}</h1>
          <p className="text-sm text-purple-800 font-bold">{algo.subtitle}</p>
          <p className="text-xs text-slate-700 leading-relaxed max-w-3xl font-normal">{algo.overview}</p>

          {/* Complexity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200">
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                Classical Runtime Bound
              </span>
              <div className="text-xl font-bold font-mono text-rose-700 mt-1">
                {algo.classicalComplexity}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">
                Quantum Runtime Bound
              </span>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
                {algo.quantumComplexity}
              </div>
            </div>
          </div>
        </div>

        {/* Mathematical Formalism */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Mathematical Formalism & Unitary Operator
          </h3>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center font-mono text-cyan-800 font-bold text-base sm:text-lg shadow-inner">
            {algo.mathFormalism}
          </div>
        </div>

        {/* Step-by-Step Circuit Decomposition */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Algorithmic Circuit Execution Pipeline
          </h3>

          <div className="space-y-3">
            {algo.stepsExplanation.map((step) => (
              <div
                key={step.stepNumber}
                className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-4 shadow-xs"
              >
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 border border-purple-300 flex items-center justify-center font-mono font-bold text-xs shrink-0">
                  0{step.stepNumber}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{step.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real-World Applications */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 space-y-3 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
            Real-World Quantum Applications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {algo.realWorldApplications.map((app, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-700 shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Launch Bottom Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-cyan-50 via-white to-purple-50 border border-cyan-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div>
            <h4 className="text-base font-bold text-slate-900">Ready to simulate this algorithm?</h4>
            <p className="text-xs text-slate-600">
              Load this circuit directly into the Quantum Studio IDE with 1 click.
            </p>
          </div>
          <Button variant="quantum" size="md" onClick={handleLaunchStudio} leftIcon={<Play className="w-4 h-4 fill-current" />}>
            Open in Quantum Studio
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
