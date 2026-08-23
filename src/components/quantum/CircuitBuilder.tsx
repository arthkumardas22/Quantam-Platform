'use client';

import React, { useState } from 'react';
import { useQuantum } from '@/context/QuantumContext';
import { GateNode } from './GateNode';
import { GateType, PlacedGate } from '@/types/quantum';
import { Plus, Minus, Trash2, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const handleCellClick = (qubit: number, column: number) => {
    if (selectedPaletteGate) {
      placeGateAt(selectedPaletteGate, qubit, column);
    } else {
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
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50 overflow-hidden select-none relative">
      {/* Circuit Grid Canvas Container */}
      <div className="flex-1 overflow-auto p-6 relative">
        <div
          className="relative inline-block min-w-full pb-10"
          style={{
            minWidth: `${HEADER_OFFSET_X + numColumns * COL_WIDTH + 60}px`,
            minHeight: `${HEADER_OFFSET_Y + numQubits * ROW_HEIGHT + 40}px`,
          }}
        >
          {/* Time Steps Header */}
          <div
            className="flex items-center absolute top-0 text-[10px] font-mono text-slate-500 font-bold"
            style={{ left: `${HEADER_OFFSET_X}px` }}
          >
            {Array.from({ length: numColumns }).map((_, c) => (
              <div
                key={c}
                className="w-16 flex items-center justify-center text-slate-500 hover:text-cyan-700 transition-colors"
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
                    stroke={link.type === 'SWAP' ? '#0d9488' : '#059669'}
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
                    <span className="text-xs font-bold text-cyan-800">q{q}</span>
                    <span className="text-[10px] text-slate-500 font-semibold">|0⟩</span>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-cyan-600 shadow-sm shadow-cyan-600/50" />
                </div>

                {/* Horizontal Qubit Wire Background Line */}
                <div className="absolute left-24 right-0 h-[2px] bg-slate-300 group-hover:bg-slate-400 transition-colors z-0" />

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

                    return (
                      <div
                        key={c}
                        onDragOver={(e) => handleDragOver(e, q, c)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, q, c)}
                        onClick={() => handleCellClick(q, c)}
                        className={cn(
                          'w-16 h-14 flex items-center justify-center relative cursor-pointer rounded-xl transition-all',
                          isHovered && 'bg-cyan-100/80 ring-2 ring-cyan-500 scale-105',
                          !placedGate && 'hover:bg-slate-200/50'
                        )}
                      >
                        {placedGate ? (
                          <GateNode gate={placedGate} qubitIndex={q} />
                        ) : (
                          <div className="w-3 h-3 rounded-full border border-dashed border-slate-300 opacity-0 hover:opacity-100 hover:scale-125 transition-all bg-white" />
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
