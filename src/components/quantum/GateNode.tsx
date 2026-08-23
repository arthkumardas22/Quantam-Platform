'use client';

import React from 'react';
import { PlacedGate } from '@/types/quantum';
import { useQuantum } from '@/context/QuantumContext';
import { cn, getGateColor } from '@/lib/utils';
import { X as CloseIcon, Gauge, Sliders } from 'lucide-react';

interface GateNodeProps {
  gate: PlacedGate;
  qubitIndex: number;
}

export const GateNode: React.FC<GateNodeProps> = ({ gate, qubitIndex }) => {
  const { removeGate, selectedGateId, setSelectedGateId, updateGate } = useQuantum();
  const isSelected = selectedGateId === gate.id;

  const isControl = gate.controlQubit === qubitIndex;
  const isSecondControl = gate.secondControlQubit === qubitIndex;
  const isTarget = gate.targetQubit === qubitIndex;
  const isSwapTarget = gate.swapTargetQubit === qubitIndex;

  const style = getGateColor(gate.type);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedGateId(isSelected ? null : gate.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    removeGate(gate.id);
  };

  // Render CNOT Control Dot
  if ((gate.type === 'CNOT' || gate.type === 'CZ' || gate.type === 'CCX') && (isControl || isSecondControl)) {
    return (
      <div
        onClick={handleClick}
        className="relative z-10 w-9 h-9 flex items-center justify-center cursor-pointer group"
      >
        <div className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-md group-hover:scale-125 transition-transform" />
      </div>
    );
  }

  // Render CNOT / CCX Target (+)
  if ((gate.type === 'CNOT' || gate.type === 'CCX') && isTarget) {
    return (
      <div
        onClick={handleClick}
        className={cn(
          'relative z-10 w-9 h-9 rounded-full bg-white border-2 border-emerald-600 flex items-center justify-center cursor-pointer group shadow-md',
          isSelected && 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-white'
        )}
      >
        <span className="text-emerald-700 font-bold text-lg leading-none select-none">⊕</span>
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-20"
        >
          <CloseIcon className="w-2.5 h-2.5" />
        </button>
      </div>
    );
  }

  // Render CZ Target Dot
  if (gate.type === 'CZ' && isTarget) {
    return (
      <div
        onClick={handleClick}
        className={cn(
          'relative z-10 w-9 h-9 flex items-center justify-center cursor-pointer group',
          isSelected && 'ring-2 ring-cyan-500 rounded-full'
        )}
      >
        <div className="w-4 h-4 rounded-full bg-emerald-600 border-2 border-white shadow-md group-hover:scale-125 transition-transform" />
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-20"
        >
          <CloseIcon className="w-2.5 h-2.5" />
        </button>
      </div>
    );
  }

  // Render SWAP Node (X)
  if (gate.type === 'SWAP' && (isTarget || isSwapTarget)) {
    return (
      <div
        onClick={handleClick}
        className={cn(
          'relative z-10 w-9 h-9 rounded-xl bg-white border-2 border-teal-500 flex items-center justify-center cursor-pointer group shadow-md',
          isSelected && 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-white'
        )}
      >
        <span className="text-teal-700 font-bold text-sm select-none">✕</span>
        {isTarget && (
          <button
            onClick={handleDelete}
            className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-20"
          >
            <CloseIcon className="w-2.5 h-2.5" />
          </button>
        )}
      </div>
    );
  }

  // Render Measurement Gate
  if (gate.type === 'M') {
    return (
      <div
        onClick={handleClick}
        className={cn(
          'relative z-10 w-9 h-9 rounded-xl bg-amber-50 border-2 border-amber-500 flex flex-col items-center justify-center cursor-pointer group shadow-md',
          isSelected && 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-white'
        )}
      >
        <Gauge className="w-4 h-4 text-amber-700" />
        <span className="text-[9px] font-mono text-amber-800 font-bold">M</span>
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-20"
        >
          <CloseIcon className="w-2.5 h-2.5" />
        </button>
      </div>
    );
  }

  // Render Barrier
  if (gate.type === 'BARRIER') {
    return (
      <div
        onClick={handleClick}
        className="relative z-10 w-9 h-12 flex items-center justify-center cursor-pointer group"
      >
        <div className="w-1.5 h-12 bg-slate-400 border border-slate-300 rounded-full border-dashed shadow-sm" />
        <button
          onClick={handleDelete}
          className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-20"
        >
          <CloseIcon className="w-2.5 h-2.5" />
        </button>
      </div>
    );
  }

  // Standard Single-Qubit Box Gate (H, X, Y, Z, S, T, Rx, Ry, Rz)
  return (
    <div
      onClick={handleClick}
      className={cn(
        'relative z-10 w-9 h-9 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer group transition-transform select-none shadow-sm backdrop-blur-md bg-white',
        style.border,
        isSelected
          ? 'ring-2 ring-cyan-500 ring-offset-2 ring-offset-white scale-105 shadow-md font-bold'
          : 'hover:scale-105'
      )}
    >
      <span className={cn('font-mono font-bold text-sm leading-none', style.text)}>
        {gate.type}
      </span>

      {/* Rotation parameter display */}
      {gate.parameter !== undefined && (
        <span className="text-[8px] font-mono text-cyan-700 leading-none mt-0.5 font-bold">
          {(gate.parameter / Math.PI).toFixed(2)}π
        </span>
      )}

      {/* Delete button */}
      <button
        onClick={handleDelete}
        title="Delete Gate"
        className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-20"
      >
        <CloseIcon className="w-2.5 h-2.5" />
      </button>

      {/* Parameter adjuster mini-panel if selected */}
      {isSelected && gate.parameter !== undefined && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-11 left-1/2 -translate-x-1/2 z-30 p-3 rounded-2xl bg-white border border-slate-200 shadow-2xl w-48 flex flex-col gap-1.5"
        >
          <div className="flex justify-between items-center text-[10px] text-slate-600 font-semibold">
            <span>Rotation Angle θ</span>
            <span className="font-mono text-cyan-700 font-bold">
              {(gate.parameter / Math.PI).toFixed(2)}π
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={Math.PI * 2}
            step={Math.PI / 12}
            value={gate.parameter}
            onChange={(e) => updateGate(gate.id, { parameter: parseFloat(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-600"
          />
        </div>
      )}
    </div>
  );
};
