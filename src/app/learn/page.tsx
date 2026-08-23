'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { LESSONS } from '@/services/learningApi';
import { useUser } from '@/context/UserContext';
import {
  BookOpen,
  Clock,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Search,
  Atom,
  GraduationCap,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function LearnHubPage() {
  const { progress } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Fundamentals', 'Circuits', 'Algorithms'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredLessons = LESSONS.filter((lesson) => {
    const matchCategory = selectedCategory === 'All' || lesson.category === selectedCategory;
    const matchDifficulty = selectedDifficulty === 'All' || lesson.difficulty === selectedDifficulty;
    const matchSearch =
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchDifficulty && matchSearch;
  });

  return (
    <AppShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-50 via-white to-purple-50 border border-cyan-200 shadow-md relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 border border-cyan-300 text-xs font-bold text-cyan-800 mb-3 shadow-xs">
              <GraduationCap className="w-4 h-4" />
              <span>Interactive Quantum Curriculum</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Master Quantum Computing Step-by-Step
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore hands-on interactive modules covering qubits, phase kickback, quantum
              entanglement, and algorithmic speedups with embedded circuit simulations.
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all',
                  selectedCategory === cat
                    ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                    : 'bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input & Difficulty Filter */}
          <div className="flex items-center gap-3">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-slate-800 font-semibold focus:outline-none focus:border-cyan-600"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'All' ? 'All Difficulties' : diff}
                </option>
              ))}
            </select>

            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-cyan-600 shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson) => {
            const isCompleted = progress.completedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-cyan-400 transition-all duration-300 flex flex-col justify-between group shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={lesson.difficulty === 'Beginner' ? 'cyan' : lesson.difficulty === 'Intermediate' ? 'purple' : 'amber'}>
                      {lesson.difficulty}
                    </Badge>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-cyan-700 font-bold bg-cyan-50 px-2 py-0.5 rounded-md border border-cyan-200">
                        +{lesson.xpReward} XP
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors mb-1.5">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
                    {lesson.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 font-mono py-2 border-y border-slate-100 mb-4 font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-600" /> {lesson.durationMinutes} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-purple-600" /> {lesson.totalSteps} steps
                    </span>
                  </div>
                </div>

                <Link href={`/learn/${lesson.slug}`} className="w-full">
                  <Button
                    variant={isCompleted ? 'secondary' : 'primary'}
                    size="sm"
                    className="w-full"
                    rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                  >
                    {isCompleted ? 'Review Lesson' : 'Start Module'}
                  </Button>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
