'use client';

import React from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { useUser } from '@/context/UserContext';
import {
  Trophy,
  Flame,
  Award,
  BarChart3,
  Clock,
  Cpu,
  Atom,
  CheckCircle2,
  Lock,
  Sparkles,
  Layers,
  GraduationCap,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function ProgressPage() {
  const { progress } = useUser();

  const skillsData = [
    { skill: 'Qubits & States', mastery: 95 },
    { skill: 'Single-Qubit Rotations', mastery: 85 },
    { skill: 'Entanglement & Bell States', mastery: 75 },
    { skill: 'Quantum Search (Grover)', mastery: 65 },
    { skill: 'Quantum Fourier Transform', mastery: 40 },
    { skill: 'Quantum Cryptography & Shor', mastery: 30 },
  ];

  return (
    <AppShell>
      <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
        {/* Header Hero */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-50 via-white to-purple-50 border border-cyan-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-100 border border-cyan-300 text-xs font-bold text-cyan-800 mb-3 shadow-xs">
              <Award className="w-4 h-4" />
              <span>Quantum Scholar Progress Matrix</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900">
              Level {progress.level} Quantum Architect
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              You have completed {progress.completedLessonIds.length} lesson modules and simulated {progress.simulationsRun} circuits.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-4 shrink-0 shadow-sm">
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">Total XP Earned</div>
              <div className="text-2xl font-extrabold font-mono text-cyan-700">
                {progress.currentXp} / {progress.nextLevelXp}
              </div>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-md shadow-cyan-600/20">
              {progress.level}
            </div>
          </div>
        </div>

        {/* Skill Mastery Grid & Weekly Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Skill Mastery Chart */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-800">Quantum Competency Matrix</h3>
                <p className="text-xs text-slate-500">Skill mastery scores across core domains</p>
              </div>
              <Badge variant="cyan">Avg: 65%</Badge>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData} layout="vertical" margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#64748b" tick={{ fill: '#475569', fontSize: 11 }} unit="%" />
                  <YAxis type="category" dataKey="skill" stroke="#64748b" tick={{ fill: '#334155', fontSize: 10 }} width={120} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-xl font-mono text-xs text-cyan-800 font-bold">
                            {payload[0].payload.skill}: {payload[0].payload.mastery}% Mastery
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="mastery" radius={[0, 6, 6, 0]}>
                    {skillsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.mastery > 70 ? '#0891b2' : entry.mastery > 50 ? '#9333ea' : '#94a3b8'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Achievement Badges Showcase */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Quantum Achievement Badges</h3>
              <p className="text-xs text-slate-500">Milestones unlocked during your quantum journey</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {progress.badges.map((badge) => {
                const isUnlocked = Boolean(badge.unlockedAt);

                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-2xl border transition-all shadow-2xs ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-cyan-50 to-purple-50 border-cyan-200'
                        : 'bg-slate-50 border-slate-200 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isUnlocked ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-200 text-slate-400'
                        }`}
                      >
                        {isUnlocked ? <Trophy className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                      {isUnlocked && (
                        <span className="text-[10px] font-mono text-cyan-700 font-bold">
                          {badge.unlockedAt}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">{badge.name}</h4>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Certificate Eligibility Banner */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-50 via-white to-cyan-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 border border-purple-200 flex items-center justify-center shrink-0 shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Quantum Computing Practitioner Certificate
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Complete 1 more challenge to unlock verified certification.
              </p>
            </div>
          </div>

          <Button variant="quantum" size="md">
            View Certificate Progress
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
