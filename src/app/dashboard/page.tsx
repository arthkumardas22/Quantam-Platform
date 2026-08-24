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
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-5 sm:space-y-6 text-[#723480]">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#531D5E] tracking-tight flex items-center gap-2">
              <span>Welcome Back, Quantum Scholar</span>
              <span className="text-lg">⚛️</span>
            </h1>
            <p className="text-xs text-[#808034] font-bold mt-1">
              You are on a <span className="text-[#531D5E] font-black">{progress.streakDays}-day streak</span>! Ready to explore quantum circuits today?
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/workspace">
              <Button variant="primary" size="sm" leftIcon={<Cpu className="w-3.5 h-3.5" />}>
                Launch Quantum Studio
              </Button>
            </Link>
          </div>
        </div>

        {/* 4 Metric Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Daily Streak */}
          <div className="p-3.5 sm:p-4 rounded-3xl bg-white border-2 border-[#DBD4FF] flex items-center gap-3.5 shadow-xs">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FFFFE3] text-[#808034] flex items-center justify-center shrink-0 border border-[#DBD4FF] shadow-xs">
              <Flame className="w-5 h-5 sm:w-6 sm:h-6 fill-[#808034] text-[#808034]" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black font-mono text-[#531D5E]">
                {progress.streakDays} <span className="text-xs font-bold">Days</span>
              </div>
              <div className="text-xs font-bold text-[#808034]">Active Study Streak</div>
            </div>
          </div>

          {/* Algorithms Mastered */}
          <div className="p-3.5 sm:p-4 rounded-3xl bg-white border-2 border-[#DBD4FF] flex items-center gap-3.5 shadow-xs">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#DBD4FF] text-[#531D5E] flex items-center justify-center shrink-0 border border-[#DBD4FF] shadow-xs">
              <Atom className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black font-mono text-[#531D5E]">
                {progress.algorithmsMastered} / {progress.totalAlgorithms}
              </div>
              <div className="text-xs font-bold text-[#808034]">Algorithms Mastered</div>
            </div>
          </div>

          {/* Circuit Challenges */}
          <div className="p-3.5 sm:p-4 rounded-3xl bg-white border-2 border-[#DBD4FF] flex items-center gap-3.5 shadow-xs">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#FFFFE3] text-[#723480] flex items-center justify-center shrink-0 border border-[#DBD4FF] shadow-xs">
              <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black font-mono text-[#723480]">
                {progress.challengesCompleted} / {progress.totalChallenges}
              </div>
              <div className="text-xs font-bold text-[#808034]">Challenges Solved</div>
            </div>
          </div>

          {/* Simulations Run */}
          <div className="p-3.5 sm:p-4 rounded-3xl bg-white border-2 border-[#DBD4FF] flex items-center gap-3.5 shadow-xs">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#DBD4FF] text-[#723480] flex items-center justify-center shrink-0 border border-[#DBD4FF] shadow-xs">
              <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-black font-mono text-[#531D5E]">
                {progress.simulationsRun}
              </div>
              <div className="text-xs font-bold text-[#808034]">Circuits Simulated</div>
            </div>
          </div>
        </div>

        {/* Continue Learning & Weekly Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* Continue Learning Hero Card */}
          <div className="lg:col-span-1 p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#DBD4FF] shadow-xs flex flex-col justify-between relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Badge variant="plum">In Progress • 72%</Badge>
                <span className="text-[11px] font-mono text-[#808034] font-bold">15 min left</span>
              </div>

              <h3 className="text-base sm:text-lg font-black text-[#531D5E] mb-1">
                {activeLesson.title}
              </h3>
              <p className="text-xs text-[#723480]/80 leading-relaxed line-clamp-2 mb-4">
                {activeLesson.subtitle}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-[11px] text-[#808034] font-mono font-bold">
                  <span>Module Progress</span>
                  <span className="text-[#531D5E]">Step 3 of 4</span>
                </div>
                <div className="w-full h-2.5 bg-[#DBD4FF] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#723480] to-[#531D5E] w-[72%] rounded-full" />
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
          <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#DBD4FF] shadow-xs flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-[#531D5E] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#723480]" />
                  Weekly Quantum Activity
                </h3>
                <p className="text-[11px] text-[#808034] font-bold">Simulations executed per day</p>
              </div>
              <span className="text-xs font-mono font-bold text-[#531D5E] bg-[#DBD4FF] px-2.5 py-1 rounded-xl border border-[#531D5E]/30">
                +24% vs last week
              </span>
            </div>

            <div className="flex-1 w-full min-h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={progress.weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSimsGarden" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#531D5E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#531D5E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffe3" vertical={false} />
                  <XAxis dataKey="day" stroke="#808034" tick={{ fill: '#723480', fontSize: 11 }} />
                  <YAxis stroke="#808034" tick={{ fill: '#723480', fontSize: 11 }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-[#DBD4FF] p-2.5 rounded-xl shadow-xl font-mono text-xs text-[#723480]">
                            <div className="font-black text-[#531D5E]">{data.day}</div>
                            <div className="text-[#723480] font-bold">
                              Simulations: <span className="text-[#531D5E] font-black">{data.simulations}</span>
                            </div>
                            <div className="text-[#808034] text-[10px] font-bold">Study Time: {data.minutes} mins</div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="simulations"
                    stroke="#531D5E"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#colorSimsGarden)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recommended Algorithms Section */}
        <div>
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div>
              <h3 className="text-sm sm:text-base font-black text-[#531D5E]">Recommended Algorithms</h3>
              <p className="text-xs text-[#808034] font-bold">Hand-picked modules based on your progress</p>
            </div>
            <Link href="/algorithms" className="text-xs font-bold text-[#531D5E] hover:text-[#723480] flex items-center gap-1">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {recommendedAlgorithms.map((algo) => (
              <div
                key={algo.id}
                className="p-4 sm:p-5 rounded-3xl bg-white border-2 border-[#DBD4FF] hover-card-garden transition-all flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="plum">{algo.category}</Badge>
                    <span className="text-[10px] font-mono text-[#531D5E] font-black">
                      {algo.quantumComplexity}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-[#723480] mb-1 group-hover:text-[#531D5E] transition-colors">
                    {algo.name}
                  </h4>
                  <p className="text-xs text-[#723480]/80 line-clamp-2 mb-4 leading-relaxed">
                    {algo.purpose}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#DBD4FF]">
                  <Link href={`/algorithms/${algo.id}`} className="flex-1">
                    <Button variant="primary" size="sm" className="w-full">
                      Learn
                    </Button>
                  </Link>
                  <Link href="/workspace">
                    <Button variant="outline" size="sm" className="border-[#DBD4FF]">
                      <Play className="w-3 h-3 fill-current text-[#723480]" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Challenge Spotlight */}
        <div className="p-4 sm:p-6 rounded-3xl bg-[#FFFFE3] border-2 border-[#DBD4FF] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#DBD4FF] text-[#531D5E] flex items-center justify-center shrink-0 border border-[#531D5E]/30 shadow-xs">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-[#531D5E] uppercase tracking-wider">
                  Upcoming Challenge
                </span>
                <Badge variant="plum">+{featuredChallenge.xp} XP</Badge>
              </div>
              <h4 className="text-sm font-black text-[#723480] mt-0.5">{featuredChallenge.title}</h4>
              <p className="text-xs text-[#723480]/80 mt-1 max-w-xl">{featuredChallenge.description}</p>
            </div>
          </div>

          <Link href="/challenges" className="shrink-0 w-full sm:w-auto">
            <Button variant="primary" size="sm" className="w-full sm:w-auto" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Solve Challenge
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

