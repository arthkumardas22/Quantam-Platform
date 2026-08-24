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
    <div className="p-3 sm:p-4 bg-[#FFFFE3]/40 select-none h-full overflow-y-auto space-y-3 sm:space-y-4 font-mono text-xs text-[#723480]">
      {/* Dirac Notation Box */}
      <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#DBD4FF] shadow-xs">
        <div className="flex items-center justify-between text-[#808034] text-[10px] uppercase font-mono tracking-wider mb-1.5 font-bold">
          <span className="flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-[#723480]" /> Complete State Vector |ψ⟩
          </span>
          <span className="text-[#531D5E]">2^{stateVector.numQubits} = {1 << stateVector.numQubits} D</span>
        </div>
        <div className="p-2.5 sm:p-3 rounded-xl bg-[#FFFFE3] border border-[#DBD4FF] text-[#531D5E] font-bold text-xs leading-relaxed break-all shadow-inner">
          |ψ⟩ = {diracString}
        </div>
      </div>

      {/* Amplitude Table with Phase Wheel */}
      <div className="rounded-2xl bg-white border border-[#DBD4FF] overflow-hidden shadow-xs">
        <div className="p-2.5 sm:p-3 bg-[#FFFFE3]/60 border-b border-[#DBD4FF] flex justify-between text-[10px] text-[#808034] font-bold uppercase tracking-wider">
          <span>Basis State</span>
          <span>Amplitude α + iβ</span>
          <span>Phase</span>
          <span>Prob</span>
        </div>

        <div className="divide-y divide-[#DBD4FF]/40 max-h-56 overflow-y-auto">
          {stateVector.amplitudes.map((amp) => {
            const isNonZero = amp.probability > 0.001;
            const phaseDeg = (amp.phase * 180) / Math.PI;

            return (
              <div
                key={amp.basisState}
                className={`flex items-center justify-between p-2.5 sm:p-3 transition-colors ${
                  isNonZero ? 'bg-[#DBD4FF]/30 text-[#723480]' : 'text-[#723480]/50'
                }`}
              >
                {/* Basis State */}
                <div className="w-14 sm:w-16 font-black text-[#531D5E]">
                  |{amp.basisState}⟩
                </div>

                {/* Complex Amplitude */}
                <div className="flex-1 font-mono text-[#723480] font-bold text-[11px] truncate pr-2">
                  {formatComplex(amp.amplitude.re, amp.amplitude.im)}
                </div>

                {/* Phase Indicator Clock */}
                <div className="w-18 sm:w-20 flex items-center gap-1.5 shrink-0">
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-[#DBD4FF] relative flex items-center justify-center bg-white shadow-xs shrink-0"
                    title={`Phase: ${phaseDeg.toFixed(1)}°`}
                  >
                    <div
                      className="w-1 h-0.5 bg-[#531D5E] absolute right-0.5 origin-left"
                      style={{ transform: `rotate(${-phaseDeg}deg)` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#531D5E] font-bold">
                    {(amp.phase / Math.PI).toFixed(2)}π
                  </span>
                </div>

                {/* Probability Bar */}
                <div className="w-16 sm:w-20 flex items-center gap-1.5 shrink-0">
                  <div className="flex-1 h-1.5 bg-[#FFFFE3] rounded-full overflow-hidden border border-[#DBD4FF]">
                    <div
                      className="h-full bg-[#531D5E] rounded-full transition-all duration-300"
                      style={{ width: `${amp.probability * 100}%` }}
                    />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold text-[#531D5E] w-8 text-right">
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

