'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from 'recharts';
import { useQuantum } from '@/context/QuantumContext';
import { BarChart3, Zap, Clock, Cpu } from 'lucide-react';
import { formatPercentage } from '@/lib/utils';

export const ProbabilityChart: React.FC = () => {
  const { simulationResult, isSimulating } = useQuantum();

  if (!simulationResult) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400 text-xs">
        <BarChart3 className="w-8 h-8 text-slate-300 mb-2 animate-pulse" />
        <span>Run simulation to generate measurement distributions.</span>
      </div>
    );
  }

  const { probabilities, counts, shots, executionTimeMs, backend } = simulationResult;

  const chartData = Object.entries(probabilities).map(([state, prob]) => ({
    state: `|${state}⟩`,
    rawState: state,
    probability: prob,
    percentage: Number((prob * 100).toFixed(1)),
    count: counts[state] || 0,
  }));

  const mostProbable = chartData.reduce(
    (max, cur) => (cur.probability > max.probability ? cur : max),
    chartData[0] || { state: '|0⟩', percentage: 0, count: 0 }
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 select-none p-4 overflow-y-auto">
      {/* Simulation Meta Stats Header */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        <div className="p-2.5 rounded-2xl bg-white border border-slate-200 flex flex-col shadow-sm">
          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <Cpu className="w-3 h-3 text-cyan-600" /> Backend
          </span>
          <span className="text-xs font-bold text-slate-800 truncate mt-0.5" title={backend}>
            {backend.split(' ')[0]}
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-white border border-slate-200 flex flex-col shadow-sm">
          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-600" /> Shots Sampled
          </span>
          <span className="text-xs font-mono font-bold text-amber-700 mt-0.5">
            {shots} shots
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-white border border-slate-200 flex flex-col shadow-sm">
          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
            <Clock className="w-3 h-3 text-emerald-600" /> Latency
          </span>
          <span className="text-xs font-mono font-bold text-emerald-700 mt-0.5">
            {executionTimeMs} ms
          </span>
        </div>
      </div>

      {/* Probability Distribution Bar Chart */}
      <div className="flex-1 min-h-[220px] w-full bg-white rounded-2xl border border-slate-200 p-3 flex flex-col shadow-sm">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-xs font-bold text-slate-800">
            Computational Basis Probabilities P(x)
          </span>
          <span className="text-[11px] font-mono text-cyan-700 font-bold">
            Dominant: {mostProbable.state} ({mostProbable.percentage}%)
          </span>
        </div>

        <div className="flex-1 w-full min-h-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="state"
                stroke="#64748b"
                tick={{ fill: '#475569', fontSize: 11, fontFamily: 'monospace' }}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: '#475569', fontSize: 10, fontFamily: 'monospace' }}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-slate-200 p-2.5 rounded-xl shadow-xl font-mono text-xs text-slate-800">
                        <div className="font-bold text-cyan-700">{data.state}</div>
                        <div className="text-slate-700 mt-0.5">
                          Probability: <span className="text-emerald-700 font-bold">{data.percentage}%</span>
                        </div>
                        <div className="text-slate-500 text-[10px]">
                          Measured Counts: {data.count} / {shots}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.rawState === mostProbable.rawState ? '#0891b2' : '#6366f1'}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* State List Breakdown Table */}
      <div className="mt-3 bg-white rounded-2xl border border-slate-200 p-3 shadow-sm">
        <div className="flex justify-between text-[10px] font-mono text-slate-500 uppercase tracking-wider pb-1.5 border-b border-slate-100 font-semibold">
          <span>Basis State</span>
          <span>Exact Probability</span>
          <span>Sampled Count</span>
        </div>
        <div className="divide-y divide-slate-100 max-h-28 overflow-y-auto">
          {chartData.map((item) => (
            <div
              key={item.state}
              className="flex justify-between items-center py-1.5 font-mono text-xs text-slate-700 hover:bg-slate-50 px-1 rounded-lg transition-colors"
            >
              <span className="font-bold text-cyan-700">{item.state}</span>
              <span className="text-slate-800 font-semibold">{item.percentage}%</span>
              <span className="text-amber-700 font-bold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
