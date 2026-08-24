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
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 text-[#723480]">
        {/* Header Hero */}
        <div className="p-5 sm:p-8 rounded-3xl bg-[#FFFFE3] border-2 border-[#DBD4FF] shadow-xs relative overflow-hidden">
          <div className="max-w-2xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DBD4FF] border border-[#723480]/30 text-xs font-bold text-[#723480] mb-3 shadow-xs">
              <GraduationCap className="w-4 h-4 text-[#723480]" />
              <span>Interactive Quantum Curriculum</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#723480] tracking-tight">
              Master Quantum Computing Step-by-Step
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-[#808034] font-bold leading-relaxed">
              Explore hands-on interactive modules covering qubits, phase kickback, quantum
              entanglement, and algorithmic speedups with embedded circuit simulations.
            </p>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 bg-white p-3.5 sm:p-4 rounded-3xl border-2 border-[#DBD4FF] shadow-xs">
          {/* Category Tabs */}
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

          {/* Search Input & Difficulty Filter */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="text-xs bg-[#FFFFE3] border border-[#DBD4FF] rounded-xl px-3.5 py-2 text-[#723480] font-bold focus:outline-none focus:border-[#531D5E] cursor-pointer"
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff === 'All' ? 'All Difficulties' : diff}
                </option>
              ))}
            </select>

            <div className="relative flex-1 sm:w-60">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#808034]" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-[#FFFFE3] border border-[#DBD4FF] rounded-xl pl-8 pr-3 py-2 text-[#723480] placeholder-[#723480]/60 focus:outline-none focus:border-[#531D5E] shadow-inner font-medium"
              />
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {filteredLessons.map((lesson) => {
            const isCompleted = progress.completedLessonIds.includes(lesson.id);

            return (
              <div
                key={lesson.id}
                className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#DBD4FF] hover-card-garden transition-all duration-300 flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={lesson.difficulty === 'Beginner' ? 'cyan' : lesson.difficulty === 'Intermediate' ? 'plum' : 'olive'}>
                      {lesson.difficulty}
                    </Badge>
                    {isCompleted ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-[#531D5E] font-bold bg-[#DBD4FF] px-2 py-0.5 rounded-md border border-[#531D5E]/30">
                        +{lesson.xpReward} XP
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-[#723480] group-hover:text-[#531D5E] transition-colors mb-1.5">
                    {lesson.title}
                  </h3>
                  <p className="text-xs text-[#723480]/80 leading-relaxed line-clamp-3 mb-4">
                    {lesson.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-[#808034] font-mono py-2 border-y border-[#DBD4FF] mb-4 font-bold">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#723480]" /> {lesson.durationMinutes} mins
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-[#723480]" /> {lesson.totalSteps} steps
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

