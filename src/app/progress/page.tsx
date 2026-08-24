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
    { skill: 'Rotations & Gates', mastery: 85 },
    { skill: 'Entanglement & Bell', mastery: 75 },
    { skill: 'Grover Search', mastery: 65 },
    { skill: 'Quantum Fourier', mastery: 40 },
    { skill: 'Shor Factoring', mastery: 30 },
  ];

  return (
    <AppShell>
      <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 sm:space-y-8 text-[#723480]">
        {/* Header Hero */}
        <div className="p-5 sm:p-8 rounded-3xl bg-[#FFFFE3] border-2 border-[#DBD4FF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#DBD4FF] border border-[#723480]/30 text-xs font-bold text-[#723480] mb-3 shadow-xs">
              <Award className="w-4 h-4 text-[#723480]" />
              <span>Quantum Scholar Progress Matrix</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#531D5E]">
              Level {progress.level} Quantum Architect
            </h1>
            <p className="text-xs sm:text-sm text-[#808034] font-bold mt-1">
              You have completed {progress.completedLessonIds.length} lesson modules and simulated {progress.simulationsRun} circuits.
            </p>
          </div>

          <div className="p-3.5 sm:p-4 rounded-2xl bg-white border-2 border-[#DBD4FF] flex items-center gap-4 shrink-0 shadow-xs">
            <div className="text-right">
              <div className="text-xs text-[#808034] font-bold">Total XP Earned</div>
              <div className="text-xl sm:text-2xl font-black font-mono text-[#531D5E]">
                {progress.currentXp} / {progress.nextLevelXp}
              </div>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#531D5E] flex items-center justify-center font-black text-[#FFFFE3] shadow-md shadow-[#531D5E]/30">
              {progress.level}
            </div>
          </div>
        </div>

        {/* Skill Mastery Grid & Weekly Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          {/* Skill Mastery Chart */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#DBD4FF] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-[#531D5E]">Competency Matrix</h3>
                <p className="text-xs text-[#808034] font-bold">Skill mastery across domains</p>
              </div>
              <Badge variant="plum">Avg: 65%</Badge>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffe3" horizontal={false} />
                  <XAxis type="number" domain={[0, 100]} stroke="#808034" tick={{ fill: '#723480', fontSize: 11 }} unit="%" />
                  <YAxis type="category" dataKey="skill" stroke="#808034" tick={{ fill: '#531D5E', fontSize: 10, fontWeight: 700 }} width={110} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white border border-[#DBD4FF] p-2.5 rounded-xl shadow-xl font-mono text-xs text-[#531D5E] font-black">
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
                        fill={entry.mastery > 70 ? '#531D5E' : entry.mastery > 50 ? '#723480' : '#808034'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Achievement Badges Showcase */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white border-2 border-[#DBD4FF] shadow-xs space-y-4">
            <div>
              <h3 className="text-sm font-black text-[#531D5E]">Achievement Badges</h3>
              <p className="text-xs text-[#808034] font-bold">Milestones unlocked during your journey</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
              {progress.badges.map((badge) => {
                const isUnlocked = Boolean(badge.unlockedAt);

                return (
                  <div
                    key={badge.id}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 transition-all shadow-2xs ${
                      isUnlocked
                        ? 'bg-[#FFFFE3] border-[#DBD4FF]'
                        : 'bg-white border-[#DBD4FF]/40 opacity-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isUnlocked ? 'bg-[#DBD4FF] text-[#531D5E]' : 'bg-[#DBD4FF]/40 text-[#723480]/50'
                        }`}
                      >
                        {isUnlocked ? <Trophy className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                      </div>
                      {isUnlocked && (
                        <span className="text-[10px] font-mono text-[#808034] font-bold">
                          {badge.unlockedAt}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-black text-[#723480]">{badge.name}</h4>
                    <p className="text-[11px] text-[#723480]/80 mt-0.5 leading-relaxed font-normal">
                      {badge.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Certificate Eligibility Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFFE3] border-2 border-[#DBD4FF] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3.5 sm:gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-[#DBD4FF] text-[#531D5E] border border-[#531D5E]/30 flex items-center justify-center shrink-0 shadow-xs">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-[#531D5E]">
                Practitioner Certificate
              </h4>
              <p className="text-xs text-[#808034] font-bold mt-0.5">
                Complete 1 more challenge to unlock verified certification.
              </p>
            </div>
          </div>

          <Button variant="primary" size="md" className="w-full sm:w-auto">
            View Certificate Progress
          </Button>
        </div>
      </div>
    </AppShell>
  );
}

