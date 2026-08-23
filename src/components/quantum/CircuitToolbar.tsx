'use client';

import React, { useState } from 'react';
import { useQuantum } from '@/context/QuantumContext';
import { useUser } from '@/context/UserContext';
import { PRESET_CIRCUITS } from '@/lib/presets';
import { Button } from '@/components/ui/Button';
import {
  Play,
  RotateCcw,
  Undo2,
  Redo2,
  Plus,
  Minus,
  Sparkles,
  BookOpen,
  Download,
  Share2,
  Cpu,
  Trash2,
} from 'lucide-react';

export const CircuitToolbar: React.FC = () => {
  const {
    circuit,
    setNumQubits,
    setNumColumns,
    loadPreset,
    clearCircuit,
    undo,
    redo,
    canUndo,
    canRedo,
    runSimulation,
    isSimulating,
    backend,
  } = useQuantum();

  const { showToast, incrementSimulationCount } = useUser();
  const [selectedPresetId, setSelectedPresetId] = useState('');

  const handlePresetSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedPresetId(val);
    if (val) {
      loadPreset(val);
      const preset = PRESET_CIRCUITS.find((p) => p.id === val);
      if (preset) {
        showToast({
          type: 'info',
          title: `Loaded ${preset.name}`,
          message: preset.description,
        });
      }
    }
  };

  const handleRunClick = async () => {
    incrementSimulationCount();
    await runSimulation();
    showToast({
      type: 'success',
      title: 'Simulation Finished',
      message: `Executed on ${backend} with ${circuit.gates.length} gates across ${circuit.numQubits} qubits.`,
    });
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(circuit, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quantum_circuit_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast({
      type: 'info',
      title: 'Circuit Exported',
      message: 'Downloaded circuit JSON configuration.',
    });
  };

  return (
    <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between gap-3 shrink-0 select-none overflow-x-auto shadow-sm">
      {/* Left controls: Presets & Grid dimensions */}
      <div className="flex items-center gap-2.5">
        {/* Preset Selector */}
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
          <select
            value={selectedPresetId}
            onChange={handlePresetSelect}
            className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-2.5 py-1 text-slate-800 font-semibold focus:outline-none focus:border-cyan-600 transition-colors shadow-inner"
          >
            <option value="">Load Preset Algorithm...</option>
            {PRESET_CIRCUITS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.qubits}Q)
              </option>
            ))}
          </select>
        </div>

        <div className="h-4 w-[1px] bg-slate-200" />

        {/* Qubit count adjustments */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-xl text-xs shadow-inner">
          <span className="text-[11px] text-slate-500 font-mono font-medium">Qubits:</span>
          <button
            onClick={() => setNumQubits(circuit.numQubits - 1)}
            disabled={circuit.numQubits <= 1}
            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="font-mono font-bold text-cyan-700 px-1">{circuit.numQubits}</span>
          <button
            onClick={() => setNumQubits(circuit.numQubits + 1)}
            disabled={circuit.numQubits >= 6}
            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>

        {/* Time Steps adjustments */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-xl text-xs shadow-inner">
          <span className="text-[11px] text-slate-500 font-mono font-medium">Steps:</span>
          <button
            onClick={() => setNumColumns(circuit.numColumns - 1)}
            disabled={circuit.numColumns <= 4}
            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="font-mono font-bold text-indigo-700 px-1">{circuit.numColumns}</span>
          <button
            onClick={() => setNumColumns(circuit.numColumns + 1)}
            disabled={circuit.numColumns >= 16}
            className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Center/Right controls: Undo/Redo, Clear, Run Simulation */}
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition-colors"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={redo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg disabled:opacity-30 transition-colors"
        >
          <Redo2 className="w-4 h-4" />
        </button>
        <button
          onClick={clearCircuit}
          title="Clear all gates"
          className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="h-4 w-[1px] bg-slate-200" />

        <button
          onClick={handleExportJSON}
          title="Export Circuit JSON"
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
        </button>

        {/* Primary Run Simulation Button */}
        <Button
          size="sm"
          variant="primary"
          onClick={handleRunClick}
          isLoading={isSimulating}
          leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
        >
          Run Simulation
        </Button>
      </div>
    </div>
  );
};
