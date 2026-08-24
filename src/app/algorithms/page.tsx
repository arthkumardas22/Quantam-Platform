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
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 text-[#723480]">
        {/* Hero Header */}
        <div className="p-5 sm:p-8 rounded-3xl bg-[#FFFFE3] border-2 border-[#DBD4FF] shadow-xs relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DBD4FF] border border-[#723480]/30 text-xs font-bold text-[#723480] mb-3 shadow-xs">
              <GitFork className="w-4 h-4 text-[#723480]" />
              <span>Quantum Advantage Directory</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#723480] tracking-tight">
              Quantum Algorithm Explorer
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#808034] font-bold leading-relaxed">
              Explore the theoretical foundations, speedup bounds, and circuit implementations
              of seminal quantum algorithms that outperform classical supercomputers.
            </p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 bg-white p-3.5 sm:p-4 rounded-3xl border-2 border-[#DBD4FF] shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer',
                  selectedCategory === cat
                    ? 'bg-[#531D5E] text-[#FFFFE3] shadow-xs'
                    : 'bg-[#FFFFE3] text-[#723480] hover:bg-[#DBD4FF] border border-[#DBD4FF]'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#808034]" />
            <input
              type="text"
              placeholder="Search algorithms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-[#FFFFE3] border border-[#DBD4FF] rounded-xl pl-8 pr-3 py-2 text-[#723480] placeholder-[#723480]/60 focus:outline-none focus:border-[#531D5E] shadow-inner font-medium"
            />
          </div>
        </div>

        {/* Algorithms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredAlgorithms.map((algo) => (
            <div
              key={algo.id}
              className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#DBD4FF] hover-card-garden transition-all duration-300 flex flex-col justify-between group shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="plum">{algo.category}</Badge>
                  <span className="text-[11px] font-mono text-[#808034] font-bold">
                    {algo.inventor}
                  </span>
                </div>

                <h3 className="text-base font-black text-[#723480] group-hover:text-[#531D5E] transition-colors mb-1.5">
                  {algo.name}
                </h3>
                <p className="text-xs text-[#723480]/80 leading-relaxed line-clamp-2 mb-4">
                  {algo.purpose}
                </p>

                {/* Speedup Badge Comparison */}
                <div className="p-3 rounded-2xl bg-[#FFFFE3] border border-[#DBD4FF] mb-4 space-y-1 text-[11px] font-mono">
                  <div className="flex justify-between text-[#808034] font-bold">
                    <span>Classical Complexity:</span>
                    <span className="text-rose-700 font-bold">{algo.classicalComplexity}</span>
                  </div>
                  <div className="flex justify-between text-[#531D5E] font-black">
                    <span>Quantum Complexity:</span>
                    <span className="text-[#531D5E] font-black">{algo.quantumComplexity}</span>
                  </div>
                  <div className="text-[10px] text-[#808034] font-bold mt-1 text-right">
                    Advantage: <span className="text-[#531D5E] font-black">{algo.speedupType}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/algorithms/${algo.id}`} className="flex-1">
                  <Button variant="primary" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Details
                  </Button>
                </Link>

                <Link href="/workspace">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadPreset(algo.id)}
                    title="Load into Quantum Studio IDE"
                    className="border-[#DBD4FF] hover:border-[#531D5E]"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-[#723480]" />
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
