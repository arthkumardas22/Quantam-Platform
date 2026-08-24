'use client';

import React from 'react';
import { useQuantum } from '@/context/QuantumContext';
import { SimulatorBackend } from '@/types/quantum';
import { Cpu, Zap } from 'lucide-react';

export const SimulationControls: React.FC = () => {
  const { backend, setBackend, shots, setShots } = useQuantum();

  const backends: { id: SimulatorBackend; label: string; tag: string }[] = [
    { id: 'qiskit_aer', label: 'Qiskit Aer', tag: 'Statevector' },
    { id: 'cirq_simulator', label: 'Google Cirq', tag: 'Density Matrix' },
    { id: 'pennylane_lightning', label: 'PennyLane', tag: 'Differentiable' },
    { id: 'ibm_quantum_cloud', label: 'IBM Falcon', tag: 'Noisy QPU' },
  ];

  const shotOptions = [100, 1024, 4096, 8192];

  return (
    <div className="p-2 sm:p-2.5 bg-white border-b border-[#DBD4FF] flex flex-wrap items-center justify-between gap-2 text-xs shadow-xs text-[#723480]">
      {/* Backend Selector */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Cpu className="w-3.5 h-3.5 text-[#723480] shrink-0" />
        <span className="text-[#808034] font-bold text-[11px] sm:text-xs">Backend:</span>
        <select
          value={backend}
          onChange={(e) => setBackend(e.target.value as SimulatorBackend)}
          className="bg-[#FFFFE3] border border-[#DBD4FF] rounded-xl px-2 py-1 text-[#531D5E] font-bold focus:outline-none focus:border-[#531D5E] shadow-inner text-[11px] sm:text-xs cursor-pointer max-w-[150px] sm:max-w-none truncate"
        >
          {backends.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label} ({b.tag})
            </option>
          ))}
        </select>
      </div>

      {/* Shots Option Selector */}
      <div className="flex items-center gap-1.5 shrink-0">
        <Zap className="w-3.5 h-3.5 text-[#808034] shrink-0" />
        <span className="text-[#808034] font-bold text-[11px] sm:text-xs">Shots:</span>
        <div className="flex items-center gap-0.5 sm:gap-1 bg-[#FFFFE3] border border-[#DBD4FF] p-0.5 rounded-xl shadow-inner">
          {shotOptions.map((s) => (
            <button
              key={s}
              onClick={() => setShots(s)}
              className={`px-1.5 sm:px-2 py-0.5 rounded-lg font-mono text-[10px] sm:text-[11px] transition-all cursor-pointer ${
                shots === s
                  ? 'bg-[#531D5E] text-[#FFFFE3] font-bold shadow-xs'
                  : 'text-[#723480] hover:text-[#531D5E]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

