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
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-[#808034] text-xs font-bold">
        <BarChart3 className="w-8 h-8 text-[#DBD4FF] mb-2 animate-pulse" />
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
    <div className="flex-1 flex flex-col h-full bg-[#FFFFE3]/40 select-none p-3 sm:p-4 overflow-y-auto text-[#723480]">
      {/* Simulation Meta Stats Header */}
      <div className="grid grid-cols-3 gap-2 sm:gap-2.5 mb-3 sm:mb-4">
        <div className="p-2 sm:p-2.5 rounded-2xl bg-white border border-[#DBD4FF] flex flex-col shadow-xs">
          <span className="text-[10px] text-[#808034] font-mono flex items-center gap-1 font-bold">
            <Cpu className="w-3 h-3 text-[#723480]" /> Backend
          </span>
          <span className="text-xs font-black text-[#531D5E] truncate mt-0.5" title={backend}>
            {backend.split(' ')[0]}
          </span>
        </div>

        <div className="p-2 sm:p-2.5 rounded-2xl bg-white border border-[#DBD4FF] flex flex-col shadow-xs">
          <span className="text-[10px] text-[#808034] font-mono flex items-center gap-1 font-bold">
            <Zap className="w-3 h-3 text-[#808034]" /> Shots
          </span>
          <span className="text-xs font-mono font-black text-[#531D5E] mt-0.5">
            {shots}
          </span>
        </div>

        <div className="p-2 sm:p-2.5 rounded-2xl bg-white border border-[#DBD4FF] flex flex-col shadow-xs">
          <span className="text-[10px] text-[#808034] font-mono flex items-center gap-1 font-bold">
            <Clock className="w-3 h-3 text-[#531D5E]" /> Latency
          </span>
          <span className="text-xs font-mono font-black text-[#531D5E] mt-0.5">
            {executionTimeMs} ms
          </span>
        </div>
      </div>

      {/* Probability Distribution Bar Chart */}
      <div className="flex-1 min-h-[200px] sm:min-h-[220px] w-full bg-white rounded-2xl border border-[#DBD4FF] p-2.5 sm:p-3 flex flex-col shadow-xs">
        <div className="flex justify-between items-center mb-2 px-1">
          <span className="text-xs font-bold text-[#723480]">
            Basis Probabilities P(x)
          </span>
          <span className="text-[11px] font-mono text-[#531D5E] font-bold">
            Top: {mostProbable.state} ({mostProbable.percentage}%)
          </span>
        </div>

        <div className="flex-1 w-full min-h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffe3" vertical={false} />
              <XAxis
                dataKey="state"
                stroke="#808034"
                tick={{ fill: '#723480', fontSize: 11, fontFamily: 'monospace' }}
              />
              <YAxis
                stroke="#808034"
                tick={{ fill: '#723480', fontSize: 10, fontFamily: 'monospace' }}
                unit="%"
                domain={[0, 100]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white border border-[#DBD4FF] p-2.5 rounded-xl shadow-xl font-mono text-xs text-[#723480]">
                        <div className="font-black text-[#531D5E]">{data.state}</div>
                        <div className="text-[#723480] mt-0.5 font-bold">
                          Probability: <span className="text-[#531D5E] font-black">{data.percentage}%</span>
                        </div>
                        <div className="text-[#808034] text-[10px] font-bold">
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
                    fill={entry.rawState === mostProbable.rawState ? '#531d5e' : '#808034'}
                    className="transition-all duration-300 hover:opacity-80"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* State List Breakdown Table */}
      <div className="mt-3 bg-white rounded-2xl border border-[#DBD4FF] p-2.5 sm:p-3 shadow-xs">
        <div className="flex justify-between text-[10px] font-mono text-[#808034] uppercase tracking-wider pb-1.5 border-b border-[#DBD4FF] font-bold">
          <span>Basis State</span>
          <span>Probability</span>
          <span>Sampled Count</span>
        </div>
        <div className="divide-y divide-[#DBD4FF]/40 max-h-28 overflow-y-auto">
          {chartData.map((item) => (
            <div
              key={item.state}
              className="flex justify-between items-center py-1.5 font-mono text-xs text-[#723480] hover:bg-[#FFFFE3] px-1 rounded-lg transition-colors"
            >
              <span className="font-black text-[#531D5E]">{item.state}</span>
              <span className="text-[#723480] font-bold">{item.percentage}%</span>
              <span className="text-[#808034] font-bold">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

