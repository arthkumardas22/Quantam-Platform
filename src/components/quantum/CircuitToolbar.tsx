'use client';

import React, { useState } from 'react';
import { useQuantum } from '@/context/QuantumContext';
import { useUser } from '@/context/UserContext';
import { PRESET_CIRCUITS } from '@/lib/presets';
import { Button } from '@/components/ui/Button';
import { InteractiveTutorialModal } from '@/components/ui/InteractiveTutorialModal';
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
  Compass,
  Lightbulb,
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
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

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
    <>
      <div className="h-auto min-h-12 py-1.5 bg-[#FFFFE3] border-b border-[#DBD4FF] px-2.5 sm:px-4 flex items-center justify-between gap-2 shrink-0 select-none overflow-x-auto shadow-xs">
        {/* Left controls: Presets & Grid dimensions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Preset Selector */}
          <div className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5 text-[#723480] shrink-0 hidden xs:block" />
            <select
              value={selectedPresetId}
              onChange={handlePresetSelect}
              className="text-xs bg-white border border-[#DBD4FF] rounded-xl px-2 py-1 text-[#723480] font-bold focus:outline-none focus:border-[#531D5E] hover:border-[#531D5E] transition-colors shadow-inner cursor-pointer max-w-[130px] sm:max-w-[180px] md:max-w-none truncate"
            >
              <option value="">Load Preset...</option>
              {PRESET_CIRCUITS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.qubits}Q)
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-[1px] bg-[#DBD4FF] hidden sm:block" />

          {/* Qubit count adjustments */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-white border border-[#DBD4FF] px-1.5 sm:px-2 py-0.5 rounded-xl text-xs shadow-inner">
            <span className="text-[10px] sm:text-[11px] text-[#808034] font-mono font-bold">Q:</span>
            <button
              onClick={() => setNumQubits(circuit.numQubits - 1)}
              disabled={circuit.numQubits <= 1}
              className="p-0.5 sm:p-1 text-[#723480] hover:text-[#531D5E] hover:bg-[#DBD4FF] rounded-md disabled:opacity-30 transition-colors cursor-pointer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-mono font-bold text-[#723480] px-0.5 sm:px-1">{circuit.numQubits}</span>
            <button
              onClick={() => setNumQubits(circuit.numQubits + 1)}
              disabled={circuit.numQubits >= 6}
              className="p-0.5 sm:p-1 text-[#723480] hover:text-[#531D5E] hover:bg-[#DBD4FF] rounded-md disabled:opacity-30 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Time Steps adjustments */}
          <div className="flex items-center gap-0.5 sm:gap-1 bg-white border border-[#DBD4FF] px-1.5 sm:px-2 py-0.5 rounded-xl text-xs shadow-inner">
            <span className="text-[10px] sm:text-[11px] text-[#808034] font-mono font-bold">Steps:</span>
            <button
              onClick={() => setNumColumns(circuit.numColumns - 1)}
              disabled={circuit.numColumns <= 4}
              className="p-0.5 sm:p-1 text-[#723480] hover:text-[#531D5E] hover:bg-[#DBD4FF] rounded-md disabled:opacity-30 transition-colors cursor-pointer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="font-mono font-bold text-[#723480] px-0.5 sm:px-1">{circuit.numColumns}</span>
            <button
              onClick={() => setNumColumns(circuit.numColumns + 1)}
              disabled={circuit.numColumns >= 16}
              className="p-0.5 sm:p-1 text-[#723480] hover:text-[#531D5E] hover:bg-[#DBD4FF] rounded-md disabled:opacity-30 transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="h-4 w-[1px] bg-[#DBD4FF] hidden md:block" />

          {/* Quick Guide Trigger */}
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#DBD4FF] hover:bg-[#531D5E] text-[#723480] hover:text-[#FFFFE3] text-xs font-bold border border-[#723480]/40 hover:border-[#531D5E] transition-all shadow-xs cursor-pointer"
            title="Open Interactive Quantum Guide"
          >
            <Lightbulb className="w-3.5 h-3.5 text-[#723480] group-hover:text-[#FFFFE3]" />
            <span>Guide</span>
          </button>
        </div>

        {/* Center/Right controls */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1 sm:p-1.5 text-[#723480] hover:text-[#531D5E] hover:bg-[#DBD4FF] rounded-lg disabled:opacity-30 transition-colors cursor-pointer"
          >
            <Undo2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1 sm:p-1.5 text-[#723480] hover:text-[#531D5E] hover:bg-[#DBD4FF] rounded-lg disabled:opacity-30 transition-colors cursor-pointer"
          >
            <Redo2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>
          <button
            onClick={clearCircuit}
            title="Clear all gates"
            className="p-1 sm:p-1.5 text-[#723480] hover:text-[#FFFFE3] hover:bg-[#531D5E] rounded-lg transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>

          <div className="h-4 w-[1px] bg-[#DBD4FF] hidden xs:block" />

          <button
            onClick={handleExportJSON}
            title="Export Circuit JSON"
            className="p-1 sm:p-1.5 text-[#723480] hover:text-[#531D5E] hover:bg-[#DBD4FF] rounded-lg transition-colors cursor-pointer hidden xs:block"
          >
            <Download className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
          </button>

          {/* Primary Run Simulation Button */}
          <Button
            size="sm"
            variant="primary"
            onClick={handleRunClick}
            isLoading={isSimulating}
            leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
            className="text-xs px-2.5 sm:px-3 py-1 sm:py-1.5"
          >
            <span className="hidden sm:inline">Run Simulation</span>
            <span className="sm:hidden">Run</span>
          </Button>
        </div>
      </div>

      {/* Tutorial Modal */}
      <InteractiveTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </>
  );
};

