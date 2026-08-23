'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/context/UserContext';
import { QUANTUM_ALGORITHMS, LESSONS } from '@/services/learningApi';
import { CHALLENGES } from '@/services/challengeApi';
import {
  Flame,
  Trophy,
  Cpu,
  BookOpen,
  ArrowRight,
  Sparkles,
  BarChart3,
  Clock,
  Play,
  CheckCircle2,
  Atom,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const { progress } = useUser();

  const activeLesson = LESSONS[0];
  const recommendedAlgorithms = QUANTUM_ALGORITHMS.slice(0, 3);
  const featuredChallenge = CHALLENGES[0];

  return (
    <AppShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Welcome Back, Quantum Scholar</span>
              <span className="text-xl">⚛️</span>
            </h1>
            <p className="text-xs text-slate-600 mt-1">
              You are on a <span className="text-amber-700 font-bold">{progress.streakDays}-day streak</span>! Ready to explore quantum superposition today?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/workspace">
              <Button variant="quantum" size="sm" leftIcon={<Cpu className="w-3.5 h-3.5" />}>
                Launch Quantum Studio
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Daily Streak */}
          <div className="p-4 rounded-3xl bg-white border border-amber-200 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200 shadow-sm">
              <Flame className="w-6 h-6 fill-amber-500 text-amber-500" />
            </div>
            <div>
              <div className="text-2xl font-extrabold font-mono text-amber-800">
                {progress.streakDays} <span className="text-xs font-normal">Days</span>
              </div>
              <div className="text-xs font-medium text-slate-500">Active Study Streak</div>
            </div>
          </div>

          {/* Algorithms Mastered */}
          <div className="p-4 rounded-3xl bg-white border border-cyan-200 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-cyan-50 text-cyan-700 flex items-center justify-center shrink-0 border border-cyan-200 shadow-sm">
              <Atom className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold font-mono text-cyan-800">
                {progress.algorithmsMastered} / {progress.totalAlgorithms}
              </div>
              <div className="text-xs font-medium text-slate-500">Algorithms Mastered</div>
            </div>
          </div>

          {/* Circuit Challenges */}
          <div className="p-4 rounded-3xl bg-white border border-purple-200 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200 shadow-sm">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold font-mono text-purple-800">
                {progress.challengesCompleted} / {progress.totalChallenges}
              </div>
              <div className="text-xs font-medium text-slate-500">Challenges Solved</div>
            </div>
          </div>

          {/* Simulations Run */}
          <div className="p-4 rounded-3xl bg-white border border-emerald-200 flex items-center gap-3.5 shadow-sm">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200 shadow-sm">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-extrabold font-mono text-emerald-800">
                {progress.simulationsRun}
              </div>
              <div className="text-xs font-medium text-slate-500">Circuits Simulated</div>
            </div>
          </div>
        </div>

        {/* Continue Learning & Weekly Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Continue Learning Hero Card */}
          <div className="lg:col-span-1 p-6 rounded-3xl bg-gradient-to-br from-cyan-50 via-white to-purple-50 border border-cyan-200 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="cyan">In Progress • 72%</Badge>
                <span className="text-[11px] font-mono text-slate-500 font-semibold">15 min remaining</span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {activeLesson.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                {activeLesson.subtitle}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-[11px] text-slate-500 font-mono font-medium">
                  <span>Module Progress</span>
                  <span className="text-cyan-800 font-bold">Step 3 of 4</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 w-[72%] rounded-full" />
                </div>
              </div>
            </div>

            <Link href={`/learn/${activeLesson.slug}`} className="w-full">
              <Button variant="primary" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Resume Lesson
              </Button>
            </Link>
          </div>

          {/* Weekly Learning Activity Chart */}
          <div className="lg:col-span-2 p-6 rounded-3xl bg-white border border-slate-200 shadow-md flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-cyan-600" />
                  Weekly Quantum Activity
                </h3>
                <p className="text-[11px] text-slate-500">Simulations executed per day</p>
              </div>
              <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-xl border border-cyan-200">
                +24% vs last week
              </span>
            </div>

            <div className="flex-1 w-full min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progress.weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSimsLight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0891b2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="day" stroke="#64748b" tick={{ fill: '#475569', fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: '#475569', fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-xl font-mono text-xs text-slate-800">
                            <div className="font-bold text-cyan-700">{data.day}</div>
                            <div className="text-slate-700">
                              Simulations: <span className="text-emerald-700 font-bold">{data.simulations}</span>
                            </div>
                            <div className="text-slate-500 text-[10px]">Study Time: {data.minutes} mins</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="simulations"
                    stroke="#0891b2"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorSimsLight)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recommended Algorithms Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recommended Quantum Algorithms</h3>
              <p className="text-xs text-slate-500">Hand-picked modules based on your current progress</p>
            </div>
            <Link href="/algorithms" className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendedAlgorithms.map((algo) => (
              <div
                key={algo.id}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-cyan-400 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="purple">{algo.category}</Badge>
                    <span className="text-[10px] font-mono text-emerald-700 font-bold">
                      {algo.quantumComplexity}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-cyan-700 transition-colors">
                    {algo.name}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {algo.purpose}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Link href={`/algorithms/${algo.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      Learn
                    </Button>
                  </Link>
                  <Link href="/workspace">
                    <Button variant="primary" size="sm">
                      <Play className="w-3 h-3 fill-current" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Challenge Spotlight */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-50 via-white to-indigo-50 border border-purple-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 border border-purple-200 shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
                  Upcoming Challenge
                </span>
                <Badge variant="amber">+{featuredChallenge.xp} XP</Badge>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-0.5">{featuredChallenge.title}</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-xl">{featuredChallenge.description}</p>
            </div>
          </div>

          <Link href="/challenges" className="shrink-0">
            <Button variant="quantum" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Solve Challenge
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
