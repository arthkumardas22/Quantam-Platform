'use client';

import React, { useState } from 'react';
import { useQuantum } from '@/context/QuantumContext';
import { GateNode } from './GateNode';
import { GateType, PlacedGate } from '@/types/quantum';
import { Plus, Minus, Trash2, RotateCcw, X, Sparkles, Layers, Zap } from 'lucide-react';
import { cn, getGateColor } from '@/lib/utils';
import { quantumAudio } from '@/utils/quantumAudio';

const QUICK_GATES: { type: GateType; label: string; desc: string }[] = [
  { type: 'H', label: 'H', desc: 'Hadamard Superposition' },
  { type: 'X', label: 'X', desc: 'Pauli-X NOT' },
  { type: 'CNOT', label: 'CX', desc: 'Controlled-NOT' },
  { type: 'M', label: 'M', desc: 'Measurement' },
  { type: 'Z', label: 'Z', desc: 'Phase Flip' },
  { type: 'S', label: 'S', desc: 'Phase S (π/2)' },
  { type: 'T', label: 'T', desc: 'Phase T (π/4)' },
  { type: 'Y', label: 'Y', desc: 'Pauli-Y' },
  { type: 'SWAP', label: 'SW', desc: 'Swap Qubits' },
  { type: 'CZ', label: 'CZ', desc: 'Controlled-Z' },
  { type: 'Rx', label: 'Rx', desc: 'X Rotation' },
  { type: 'Rz', label: 'Rz', desc: 'Z Rotation' },
];

export const CircuitBuilder: React.FC = () => {
  const {
    circuit,
    addGate,
    selectedPaletteGate,
    setSelectedPaletteGate,
    setSelectedGateId,
    setNumQubits,
    setNumColumns,
  } = useQuantum();

  const [dragOverCell, setDragOverCell] = useState<{ qubit: number; column: number } | null>(null);
  const [quickPickerCell, setQuickPickerCell] = useState<{ qubit: number; column: number } | null>(null);

  const numQubits = circuit.numQubits;
  const numColumns = circuit.numColumns;

  const handleDragOver = (e: React.DragEvent, qubit: number, column: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setDragOverCell({ qubit, column });
  };

  const handleDragLeave = () => {
    setDragOverCell(null);
  };

  const handleDrop = (e: React.DragEvent, qubit: number, column: number) => {
    e.preventDefault();
    setDragOverCell(null);
    const gateType = (e.dataTransfer.getData('application/quantum-gate') || selectedPaletteGate) as GateType;

    if (!gateType) return;
    placeGateAt(gateType, qubit, column);
  };

  const handleCellClick = (qubit: number, column: number, hasGate: boolean) => {
    if (hasGate) {
      setQuickPickerCell(null);
      return;
    }

    if (selectedPaletteGate) {
      placeGateAt(selectedPaletteGate, qubit, column);
    } else {
      setQuickPickerCell(
        quickPickerCell?.qubit === qubit && quickPickerCell?.column === column
          ? null
          : { qubit, column }
      );
      setSelectedGateId(null);
    }
  };

  const placeGateAt = (gateType: GateType, qubit: number, column: number) => {
    let gateData: Omit<PlacedGate, 'id'> = {
      type: gateType,
      targetQubit: qubit,
      column,
    };

    // Auto-assign default control or target for multi-qubit gates
    if (gateType === 'CNOT' || gateType === 'CZ') {
      if (qubit === 0 && numQubits > 1) {
        gateData = { type: gateType, targetQubit: 1, controlQubit: 0, column };
      } else {
        gateData = { type: gateType, targetQubit: qubit, controlQubit: Math.max(0, qubit - 1), column };
      }
    } else if (gateType === 'SWAP') {
      const otherQubit = (qubit + 1) % numQubits;
      gateData = { type: 'SWAP', targetQubit: Math.min(qubit, otherQubit), swapTargetQubit: Math.max(qubit, otherQubit), column };
    } else if (gateType === 'CCX') {
      if (numQubits >= 3) {
        gateData = { type: 'CCX', targetQubit: 2, controlQubit: 0, secondControlQubit: 1, column };
      } else {
        gateData = { type: 'CNOT', targetQubit: 1, controlQubit: 0, column };
      }
    } else if (['Rx', 'Ry', 'Rz'].includes(gateType)) {
      gateData.parameter = Math.PI / 2;
    }

    addGate(gateData);
    quantumAudio.playGateChime(523.25 + column * 35);
    setQuickPickerCell(null);
  };

  // Find multi-qubit connecting vertical lines for SVG overlay
  const multiQubitLinks = circuit.gates
    .filter(
      (g) =>
        (g.type === 'CNOT' && g.controlQubit !== undefined) ||
        (g.type === 'CZ' && g.controlQubit !== undefined) ||
        (g.type === 'SWAP' && g.swapTargetQubit !== undefined) ||
        (g.type === 'CCX' && g.controlQubit !== undefined && g.secondControlQubit !== undefined)
    )
    .map((g) => {
      let minQ = g.targetQubit;
      let maxQ = g.targetQubit;

      if (g.controlQubit !== undefined) {
        minQ = Math.min(minQ, g.controlQubit);
        maxQ = Math.max(maxQ, g.controlQubit);
      }
      if (g.secondControlQubit !== undefined) {
        minQ = Math.min(minQ, g.secondControlQubit);
        maxQ = Math.max(maxQ, g.secondControlQubit);
      }
      if (g.swapTargetQubit !== undefined) {
        minQ = Math.min(minQ, g.swapTargetQubit);
        maxQ = Math.max(maxQ, g.swapTargetQubit);
      }

      return {
        id: g.id,
        column: g.column,
        minQubit: minQ,
        maxQubit: maxQ,
        type: g.type,
      };
    });

  const ROW_HEIGHT = 64; // px
  const COL_WIDTH = 64; // px
  const HEADER_OFFSET_X = 96; // px for qubit label
  const HEADER_OFFSET_Y = 32; // px for time step label

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#FFFFE3]/40 overflow-hidden select-none relative">
      {/* Mobile Quick-Gate Bar (Top of Circuit Builder on mobile) */}
      <div className="lg:hidden p-2 bg-white border-b border-[#DBD4FF] flex items-center gap-1.5 overflow-x-auto scrollbar-none shrink-0 shadow-2xs">
        <span className="text-[10px] font-mono text-[#808034] font-bold shrink-0 mr-0.5">Quick Gate:</span>
        {QUICK_GATES.map((g) => {
          const isSelected = selectedPaletteGate === g.type;
          const style = getGateColor(g.type);

          return (
            <button
              key={g.type}
              onClick={() => {
                const next = isSelected ? null : g.type;
                setSelectedPaletteGate(next);
                if (next) quantumAudio.playGateChime(587.33);
              }}
              className={cn(
                'px-2.5 py-1 rounded-xl text-xs font-mono font-black border transition-all shrink-0 cursor-pointer shadow-2xs flex items-center gap-1',
                style.border,
                isSelected
                  ? 'bg-[#531D5E] text-[#FFFFE3] border-[#531D5E] scale-105 shadow-xs'
                  : 'bg-[#FFFFE3] text-[#723480] hover:bg-[#DBD4FF]'
              )}
            >
              <span>{g.label}</span>
            </button>
          );
        })}

        {selectedPaletteGate && (
          <button
            onClick={() => setSelectedPaletteGate(null)}
            className="text-[10px] text-rose-700 underline font-mono font-bold shrink-0 ml-1 cursor-pointer"
          >
            Clear Active
          </button>
        )}
      </div>

      {/* Selected Gate Instruction Prompt */}
      {selectedPaletteGate && (
        <div className="p-2 bg-[#DBD4FF] border-b border-[#531D5E]/30 flex items-center justify-between text-xs font-bold text-[#531D5E] shrink-0">
          <div className="flex items-center gap-1.5 truncate">
            <Sparkles className="w-3.5 h-3.5 text-[#531D5E] shrink-0" />
            <span>Active Gate [{selectedPaletteGate}]: Tap any empty (+) wire slot to place</span>
          </div>
          <button
            onClick={() => setSelectedPaletteGate(null)}
            className="text-[10px] px-2 py-0.5 rounded-lg bg-[#531D5E] text-[#FFFFE3] shrink-0 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Circuit Grid Canvas Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 relative touch-pan-x touch-pan-y overscroll-contain">
        <div
          className="relative inline-block min-w-full pb-16"
          style={{
            minWidth: `${HEADER_OFFSET_X + numColumns * COL_WIDTH + 60}px`,
            minHeight: `${HEADER_OFFSET_Y + numQubits * ROW_HEIGHT + 60}px`,
          }}
        >
          {/* Time Steps Header */}
          <div
            className="flex items-center absolute top-0 text-[10px] font-mono text-[#808034] font-bold"
            style={{ left: `${HEADER_OFFSET_X}px` }}
          >
            {Array.from({ length: numColumns }).map((_, c) => (
              <div
                key={c}
                className="w-16 flex items-center justify-center text-[#808034] hover:text-[#531D5E] transition-colors"
              >
                t{c}
              </div>
            ))}
          </div>

          {/* SVG Overlay for Multi-Qubit Connecting Lines */}
          <svg
            className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
            style={{ minWidth: '100%', minHeight: '100%' }}
          >
            {multiQubitLinks.map((link) => {
              const x = HEADER_OFFSET_X + link.column * COL_WIDTH + COL_WIDTH / 2;
              const y1 = HEADER_OFFSET_Y + link.minQubit * ROW_HEIGHT + ROW_HEIGHT / 2;
              const y2 = HEADER_OFFSET_Y + link.maxQubit * ROW_HEIGHT + ROW_HEIGHT / 2;
              return (
                <g key={link.id}>
                  <line
                    x1={x}
                    y1={y1}
                    x2={x}
                    y2={y2}
                    stroke={link.type === 'SWAP' ? '#808034' : '#531D5E'}
                    strokeWidth="2.5"
                    strokeDasharray={link.type === 'SWAP' ? '3 3' : 'none'}
                  />
                </g>
              );
            })}
          </svg>

          {/* Qubit Rows */}
          <div className="flex flex-col gap-0" style={{ paddingTop: `${HEADER_OFFSET_Y}px` }}>
            {Array.from({ length: numQubits }).map((_, q) => (
              <div
                key={q}
                className="flex items-center relative group"
                style={{ height: `${ROW_HEIGHT}px` }}
              >
                {/* Qubit Label and Initial State |0⟩ */}
                <div
                  className="w-24 shrink-0 flex items-center justify-between pr-3 font-mono"
                  style={{ width: `${HEADER_OFFSET_X}px` }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-[#723480]">q{q}</span>
                    <span className="text-[10px] text-[#808034] font-bold">|0⟩</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-[#723480] shadow-xs" />
                </div>

                {/* Horizontal Qubit Wire Background Line */}
                <div className="absolute left-24 right-0 h-[2px] bg-[#DBD4FF] group-hover:bg-[#531D5E]/60 transition-colors z-0" />

                {/* Dropzone Column Cells */}
                <div className="flex items-center z-10">
                  {Array.from({ length: numColumns }).map((_, c) => {
                    const placedGate = circuit.gates.find(
                      (g) =>
                        g.column === c &&
                        (g.targetQubit === q ||
                          g.controlQubit === q ||
                          g.secondControlQubit === q ||
                          g.swapTargetQubit === q)
                    );

                    const isHovered = dragOverCell?.qubit === q && dragOverCell?.column === c;
                    const isQuickPickerActive =
                      quickPickerCell?.qubit === q && quickPickerCell?.column === c;

                    return (
                      <div
                        key={c}
                        onDragOver={(e) => handleDragOver(e, q, c)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, q, c)}
                        onClick={() => handleCellClick(q, c, !!placedGate)}
                        className={cn(
                          'w-16 h-14 flex items-center justify-center relative cursor-pointer rounded-xl transition-all select-none',
                          isHovered && 'bg-[#DBD4FF] ring-2 ring-[#531D5E] scale-105',
                          !placedGate && 'hover:bg-[#DBD4FF]/40 active:bg-[#DBD4FF]/60',
                          isQuickPickerActive && 'ring-2 ring-[#531D5E] bg-[#DBD4FF]'
                        )}
                      >
                        {placedGate ? (
                          <GateNode gate={placedGate} qubitIndex={q} />
                        ) : (
                          <div className="w-6 h-6 rounded-lg border border-dashed border-[#DBD4FF] flex items-center justify-center text-[#808034] text-xs font-bold hover:border-[#531D5E] hover:text-[#531D5E] hover:scale-115 transition-all bg-white/80 shadow-2xs">
                            +
                          </div>
                        )}

                        {/* Quick Gate Picker Popover Menu on Cell Tap */}
                        {isQuickPickerActive && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="absolute top-12 left-1/2 -translate-x-1/2 z-40 p-3 rounded-2xl bg-white border-2 border-[#DBD4FF] shadow-2xl w-64 flex flex-col gap-2 animate-in fade-in zoom-in-95 duration-150"
                          >
                            <div className="flex items-center justify-between pb-1.5 border-b border-[#DBD4FF]">
                              <span className="text-[11px] font-black text-[#531D5E]">
                                Insert Gate at (q{q}, t{c})
                              </span>
                              <button
                                onClick={() => setQuickPickerCell(null)}
                                className="p-0.5 rounded-md text-[#723480] hover:bg-[#DBD4FF] cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="grid grid-cols-4 gap-1.5">
                              {QUICK_GATES.map((g) => {
                                const style = getGateColor(g.type);
                                return (
                                  <button
                                    key={g.type}
                                    onClick={() => placeGateAt(g.type, q, c)}
                                    className={cn(
                                      'p-1.5 rounded-xl border text-center font-mono font-black text-xs hover:scale-105 transition-all cursor-pointer bg-white',
                                      style.border,
                                      style.text,
                                      'hover:bg-[#DBD4FF]'
                                    )}
                                    title={g.desc}
                                  >
                                    {g.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


