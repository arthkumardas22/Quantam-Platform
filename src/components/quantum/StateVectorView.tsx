'use client';

import React from 'react';
import { useQuantum } from '@/context/QuantumContext';
import { formatComplex } from '@/lib/utils';
import { Activity } from 'lucide-react';

export const StateVectorView: React.FC = () => {
  const { simulationResult } = useQuantum();

  if (!simulationResult) return null;

  const { stateVector } = simulationResult;

  const significant = stateVector.amplitudes.filter((a) => a.probability > 0.0001);

  const diracString =
    significant
      .map((a) => {
        const re = a.amplitude.re;
        const im = a.amplitude.im;
        const formatted = formatComplex(re, im);
        return `(${formatted})|${a.basisState}⟩`;
      })
      .join(' + ') || '|0...0⟩';

  return (
    <div className="p-4 bg-slate-50 select-none h-full overflow-y-auto space-y-4 font-mono text-xs">
      {/* Dirac Notation Box */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between text-slate-500 text-[10px] uppercase font-mono tracking-wider mb-1.5 font-bold">
          <span className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-cyan-600" /> Complete State Vector |ψ⟩
          </span>
          <span className="text-cyan-700">2^{stateVector.numQubits} = {1 << stateVector.numQubits} Dimensions</span>
        </div>
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-cyan-800 font-bold text-xs leading-relaxed break-all shadow-inner">
          |ψ⟩ = {diracString}
        </div>
      </div>

      {/* Amplitude Table with Phase Wheel */}
      <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <span>Basis State</span>
          <span>Complex Amplitude α + iβ</span>
          <span>Phase (rad)</span>
          <span>Probability</span>
        </div>

        <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
          {stateVector.amplitudes.map((amp) => {
            const isNonZero = amp.probability > 0.001;
            const phaseDeg = (amp.phase * 180) / Math.PI;

            return (
              <div
                key={amp.basisState}
                className={`flex items-center justify-between p-3 transition-colors ${
                  isNonZero ? 'bg-cyan-50/50 text-slate-900' : 'text-slate-400'
                }`}
              >
                {/* Basis State */}
                <div className="w-16 font-bold text-cyan-700">
                  |{amp.basisState}⟩
                </div>

                {/* Complex Amplitude */}
                <div className="flex-1 font-mono text-slate-800 font-medium">
                  {formatComplex(amp.amplitude.re, amp.amplitude.im)}
                </div>

                {/* Phase Indicator Clock */}
                <div className="w-24 flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full border border-slate-300 relative flex items-center justify-center bg-white shadow-xs"
                    title={`Phase: ${phaseDeg.toFixed(1)}°`}
                  >
                    <div
                      className="w-1.5 h-0.5 bg-pink-500 absolute right-1 origin-left"
                      style={{ transform: `rotate(${-phaseDeg}deg)` }}
                    />
                  </div>
                  <span className="text-[10px] text-pink-700 font-bold">
                    {(amp.phase / Math.PI).toFixed(2)}π
                  </span>
                </div>

                {/* Probability Bar */}
                <div className="w-24 flex items-center gap-2">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-600 rounded-full transition-all duration-300"
                      style={{ width: `${amp.probability * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-800 w-10 text-right">
                    {(amp.probability * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
