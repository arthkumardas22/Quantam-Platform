'use client';

import React, { useState } from 'react';
import { GateType, GateDefinition } from '@/types/quantum';
import { useQuantum } from '@/context/QuantumContext';
import { cn, getGateColor } from '@/lib/utils';
import { HelpCircle, Sparkles, Layers, Zap } from 'lucide-react';

export const GATE_DEFINITIONS: GateDefinition[] = [
  // Single Qubit
  {
    type: 'H',
    name: 'Hadamard',
    symbol: 'H',
    category: 'single',
    description: 'Creates equal superposition: |0⟩ → (|0⟩+|1⟩)/√2 and |1⟩ → (|0⟩-|1⟩)/√2.',
    matrixDisplay: '1/√2 [[1, 1], [1, -1]]',
    color: 'text-cyan-700',
    borderGlow: 'border-cyan-400',
  },
  {
    type: 'X',
    name: 'Pauli-X (NOT)',
    symbol: 'X',
    category: 'single',
    description: 'Quantum bit flip: flips |0⟩ ↔ |1⟩ (180° rotation around X axis).',
    matrixDisplay: '[[0, 1], [1, 0]]',
    color: 'text-purple-700',
    borderGlow: 'border-purple-400',
  },
  {
    type: 'Y',
    name: 'Pauli-Y',
    symbol: 'Y',
    category: 'single',
    description: 'Bit and phase flip: 180° rotation around Y axis on Bloch sphere.',
    matrixDisplay: '[[0, -i], [i, 0]]',
    color: 'text-purple-700',
    borderGlow: 'border-purple-400',
  },
  {
    type: 'Z',
    name: 'Pauli-Z (Phase)',
    symbol: 'Z',
    category: 'phase',
    description: 'Phase flip: leaves |0⟩ unchanged and maps |1⟩ → -|1⟩.',
    matrixDisplay: '[[1, 0], [0, -1]]',
    color: 'text-pink-700',
    borderGlow: 'border-pink-400',
  },
  {
    type: 'S',
    name: 'Phase S (√Z)',
    symbol: 'S',
    category: 'phase',
    description: 'Applies π/2 phase shift to |1⟩: |1⟩ → i|1⟩.',
    matrixDisplay: '[[1, 0], [0, i]]',
    color: 'text-pink-700',
    borderGlow: 'border-pink-400',
  },
  {
    type: 'T',
    name: 'π/8 Gate (T)',
    symbol: 'T',
    category: 'phase',
    description: 'Applies π/4 phase shift to |1⟩: essential for universal fault-tolerant QC.',
    matrixDisplay: '[[1, 0], [0, e^(iπ/4)]]',
    color: 'text-pink-700',
    borderGlow: 'border-pink-400',
  },
  {
    type: 'Rx',
    name: 'Rx Rotation',
    symbol: 'Rx',
    category: 'phase',
    description: 'Continuous rotation around X-axis by angle θ.',
    hasParameter: true,
    defaultParam: Math.PI / 2,
    color: 'text-blue-700',
    borderGlow: 'border-blue-400',
  },
  {
    type: 'Ry',
    name: 'Ry Rotation',
    symbol: 'Ry',
    category: 'phase',
    description: 'Continuous rotation around Y-axis by angle θ.',
    hasParameter: true,
    defaultParam: Math.PI / 2,
    color: 'text-blue-700',
    borderGlow: 'border-blue-400',
  },
  {
    type: 'Rz',
    name: 'Rz Rotation',
    symbol: 'Rz',
    category: 'phase',
    description: 'Continuous rotation around Z-axis by angle θ.',
    hasParameter: true,
    defaultParam: Math.PI / 2,
    color: 'text-blue-700',
    borderGlow: 'border-blue-400',
  },

  // Multi-Qubit Controlled Gates
  {
    type: 'CNOT',
    name: 'Controlled-NOT',
    symbol: 'CX',
    category: 'controlled',
    description: 'Flips target qubit if control qubit is in state |1⟩. Entangles qubits.',
    isMultiQubit: true,
    qubitCount: 2,
    color: 'text-emerald-700',
    borderGlow: 'border-emerald-400',
  },
  {
    type: 'CZ',
    name: 'Controlled-Z',
    symbol: 'CZ',
    category: 'controlled',
    description: 'Applies phase flip (-1) if both control and target qubits are |1⟩.',
    isMultiQubit: true,
    qubitCount: 2,
    color: 'text-emerald-700',
    borderGlow: 'border-emerald-400',
  },
  {
    type: 'SWAP',
    name: 'SWAP Gate',
    symbol: 'SW',
    category: 'controlled',
    description: 'Exchanges the quantum states of two qubits: |ab⟩ ↔ |ba⟩.',
    isMultiQubit: true,
    qubitCount: 2,
    color: 'text-teal-700',
    borderGlow: 'border-teal-400',
  },
  {
    type: 'CCX',
    name: 'Toffoli (CCX)',
    symbol: 'CCX',
    category: 'controlled',
    description: 'Controlled-Controlled-NOT: flips target if both control qubits are |1⟩.',
    isMultiQubit: true,
    qubitCount: 3,
    color: 'text-emerald-700',
    borderGlow: 'border-emerald-400',
  },

  // Measurement & Special
  {
    type: 'M',
    name: 'Measurement',
    symbol: 'M',
    category: 'measurement',
    description: 'Measures qubit state in computational Z-basis and collapses wavefunction.',
    color: 'text-amber-700',
    borderGlow: 'border-amber-400',
  },
  {
    type: 'BARRIER',
    name: 'Barrier',
    symbol: '||',
    category: 'special',
    description: 'Prevents compiler circuit optimization across this boundary.',
    color: 'text-slate-600',
    borderGlow: 'border-slate-400',
  },
];

export const GatePalette: React.FC = () => {
  const { selectedPaletteGate, setSelectedPaletteGate } = useQuantum();
  const [activeCategory, setActiveCategory] = useState<'all' | 'single' | 'controlled' | 'phase' | 'measurement'>('all');
  const [hoveredGate, setHoveredGate] = useState<GateDefinition | null>(null);

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'single', label: 'Single' },
    { id: 'controlled', label: 'Multi/CX' },
    { id: 'phase', label: 'Phase' },
    { id: 'measurement', label: 'Measure' },
  ];

  const filteredGates = GATE_DEFINITIONS.filter((g) => {
    if (activeCategory === 'all') return true;
    if (activeCategory === 'controlled') return g.category === 'controlled';
    if (activeCategory === 'single') return g.category === 'single';
    if (activeCategory === 'phase') return g.category === 'phase';
    if (activeCategory === 'measurement') return g.category === 'measurement' || g.category === 'special';
    return true;
  });

  const handleDragStart = (e: React.DragEvent, gateType: GateType) => {
    e.dataTransfer.setData('application/quantum-gate', gateType);
    e.dataTransfer.effectAllowed = 'copy';
    setSelectedPaletteGate(gateType);
  };

  return (
    <div className="w-full lg:w-60 shrink-0 bg-white border-r border-[#DBD4FF] flex flex-col h-full select-none shadow-xs text-[#723480]">
      {/* Header */}
      <div className="p-3 sm:p-3.5 border-b border-[#DBD4FF] flex items-center justify-between bg-[#FFFFE3]">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#723480]" />
          <h2 className="text-xs font-black text-[#723480] uppercase tracking-wider">
            Gate Palette
          </h2>
        </div>
        <span className="text-[10px] text-[#808034] font-mono font-bold">Tap / Drag</span>
      </div>

      {/* Selected Gate Touch Banner */}
      {selectedPaletteGate && (
        <div className="px-3 py-1.5 bg-[#DBD4FF] border-b border-[#531D5E]/30 flex items-center justify-between text-xs font-bold text-[#531D5E] animate-fade-in">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#531D5E] animate-ping" />
            <span>Gate [{selectedPaletteGate}] active: Tap wire to place</span>
          </div>
          <button
            onClick={() => setSelectedPaletteGate(null)}
            className="text-[10px] text-[#531D5E] underline font-mono cursor-pointer"
          >
            Clear
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-1 p-2 sm:p-2.5 border-b border-[#DBD4FF] bg-[#FFFFE3]/50 overflow-x-auto scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id as any)}
            className={cn(
              'text-[11px] px-2.5 py-1 rounded-xl font-bold transition-all shrink-0 cursor-pointer',
              activeCategory === cat.id
                ? 'bg-[#531D5E] text-[#FFFFE3] shadow-xs'
                : 'text-[#723480] hover:text-[#531D5E] hover:bg-[#DBD4FF]/60 border border-transparent'
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Gates Grid */}
      <div className="flex-1 overflow-y-auto p-2.5 sm:p-3 space-y-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
          {filteredGates.map((gate) => {
            const isSelected = selectedPaletteGate === gate.type;
            const style = getGateColor(gate.type);

            return (
              <div
                key={gate.type}
                draggable
                onDragStart={(e) => handleDragStart(e, gate.type)}
                onClick={() => setSelectedPaletteGate(isSelected ? null : gate.type)}
                onMouseEnter={() => setHoveredGate(gate)}
                onMouseLeave={() => setHoveredGate(null)}
                className={cn(
                  'relative group flex flex-col items-center justify-center p-2.5 rounded-2xl cursor-pointer border shadow-xs transition-all duration-200 bg-white select-none',
                  style.border,
                  isSelected
                    ? 'ring-2 ring-[#531D5E] bg-[#DBD4FF] shadow-md scale-102 font-black border-[#531D5E]'
                    : 'hover:scale-103 hover:border-[#531D5E] hover:bg-[#FFFFE3]'
                )}
              >
                <span className={cn('font-mono font-black text-base', style.text)}>
                  {gate.symbol}
                </span>
                <span className="text-[10px] text-[#808034] font-bold truncate max-w-[85px] mt-0.5">
                  {gate.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Gate Information Inspector */}
      <div className="p-3 border-t border-[#DBD4FF] bg-[#FFFFE3] min-h-[100px] flex flex-col justify-center">
        {hoveredGate || (selectedPaletteGate && GATE_DEFINITIONS.find((g) => g.type === selectedPaletteGate)) ? (
          (() => {
            const current = hoveredGate || GATE_DEFINITIONS.find((g) => g.type === selectedPaletteGate)!;
            return (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#531D5E]">{current.name}</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded-md bg-[#DBD4FF] text-[#531D5E] border border-[#531D5E]/30 font-bold">
                    {current.symbol}
                  </span>
                </div>
                <p className="text-[11px] text-[#723480] mt-1 leading-tight font-medium">
                  {current.description}
                </p>
                {current.matrixDisplay && (
                  <div className="mt-1.5 text-[10px] font-mono text-[#531D5E] bg-white px-2 py-0.5 rounded-lg border border-[#DBD4FF] font-bold overflow-x-auto">
                    {current.matrixDisplay}
                  </div>
                )}
              </div>
            );
          })()
        ) : (
          <div className="text-center text-[#808034] text-[11px] flex flex-col items-center gap-1 font-bold">
            <HelpCircle className="w-4 h-4 text-[#808034]" />
            <span>Tap or hover a gate to inspect unitary matrix.</span>
          </div>
        )}
      </div>
    </div>
  );
};

