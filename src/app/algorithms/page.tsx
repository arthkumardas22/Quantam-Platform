'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { QUANTUM_ALGORITHMS } from '@/services/learningApi';
import { useQuantum } from '@/context/QuantumContext';
import {
  GitFork,
  ArrowRight,
  Search,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Play,
  BookOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function AlgorithmsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { loadPreset } = useQuantum();

  const categories = ['All', 'Search', 'Arithmetic & Fourier', 'Oracular', 'Communication'];

  const filteredAlgorithms = QUANTUM_ALGORITHMS.filter((algo) => {
    const matchCategory = selectedCategory === 'All' || algo.category === selectedCategory;
    const matchSearch =
      algo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      algo.inventor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <AppShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-purple-50 via-white to-cyan-50 border border-purple-200 shadow-md relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-100 border border-purple-300 text-xs font-bold text-purple-800 mb-3 shadow-xs">
              <GitFork className="w-4 h-4" />
              <span>Quantum Advantage Directory</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Quantum Algorithm Explorer
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore the theoretical foundations, speedup bounds, and circuit implementations
              of seminal quantum algorithms that outperform classical supercomputers.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search algorithms by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-600 shadow-inner"
            />
          </div>
        </div>

        {/* Algorithms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlgorithms.map((algo) => (
            <div
              key={algo.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-purple-300 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="purple">{algo.category}</Badge>
                  <span className="text-[11px] font-mono text-slate-500 font-semibold">
                    {algo.inventor} ({algo.year})
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-700 transition-colors mb-1">
                  {algo.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                  {algo.purpose}
                </p>

                {/* Classical vs Quantum Complexity Box */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-xs space-y-2 mb-5 shadow-inner">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Classical Complexity</span>
                    <span className="text-rose-700 font-bold">{algo.classicalComplexity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 text-[11px]">Quantum Complexity</span>
                    <span className="text-emerald-700 font-bold">{algo.quantumComplexity}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px]">
                    <span className="text-slate-500">Speedup Class</span>
                    <span className="text-cyan-700 font-bold">{algo.speedupType}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Link href={`/algorithms/${algo.id}`} className="flex-1">
                  <Button variant="secondary" size="sm" className="w-full">
                    Algorithm Theory
                  </Button>
                </Link>

                <Link
                  href="/workspace"
                  onClick={() => loadPreset(algo.defaultCircuitPresetId)}
                  className="shrink-0"
                >
                  <Button
                    variant="quantum"
                    size="sm"
                    title="Launch Circuit in Studio"
                    leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
                  >
                    Open Studio
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
