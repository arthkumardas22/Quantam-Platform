'use client';

import React from 'react';
import { useQuantum } from '@/context/QuantumContext';
import { SimulatorBackend } from '@/types/quantum';
import { Cpu, Zap } from 'lucide-react';

export const SimulationControls: React.FC = () => {
  const { backend, setBackend, shots, setShots } = useQuantum();

  const backends: { id: SimulatorBackend; label: string; tag: string }[] = [
    { id: 'qiskit_aer', label: 'Qiskit Aer Simulator', tag: 'Statevector GPU' },
    { id: 'cirq_simulator', label: 'Google Cirq DensityMatrix', tag: 'Density Matrix' },
    { id: 'pennylane_lightning', label: 'PennyLane Lightning', tag: 'Differentiable' },
    { id: 'ibm_quantum_cloud', label: 'IBM Quantum Falcon Cloud', tag: 'Noisy QPU' },
  ];

  const shotOptions = [100, 1024, 4096, 8192];

  return (
    <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-sm">
      {/* Backend Selector */}
      <div className="flex items-center gap-2">
        <Cpu className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
        <span className="text-slate-600 font-semibold">Backend:</span>
        <select
          value={backend}
          onChange={(e) => setBackend(e.target.value as SimulatorBackend)}
          className="bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-slate-800 font-bold focus:outline-none focus:border-cyan-600 shadow-inner"
        >
          {backends.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label} ({b.tag})
            </option>
          ))}
        </select>
      </div>

      {/* Shots Option Selector */}
      <div className="flex items-center gap-2">
        <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        <span className="text-slate-600 font-semibold">Shots:</span>
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-0.5 rounded-xl shadow-inner">
          {shotOptions.map((s) => (
            <button
              key={s}
              onClick={() => setShots(s)}
              className={`px-2 py-0.5 rounded-lg font-mono text-[11px] transition-all ${
                shots === s
                  ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
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
