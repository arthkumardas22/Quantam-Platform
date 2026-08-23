'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CircuitState,
  PlacedGate,
  GateType,
  SimulationResult,
  SimulatorBackend,
  PresetCircuit,
} from '@/types/quantum';
import { runQuantumCircuit } from '@/services/quantumApi';
import { PRESET_CIRCUITS } from '@/lib/presets';

interface QuantumContextType {
  circuit: CircuitState;
  selectedPaletteGate: GateType | null;
  setSelectedPaletteGate: (gate: GateType | null) => void;
  selectedGateId: string | null;
  setSelectedGateId: (id: string | null) => void;
  selectedQubitForBloch: number;
  setSelectedQubitForBloch: (qubit: number) => void;
  backend: SimulatorBackend;
  setBackend: (backend: SimulatorBackend) => void;
  shots: number;
  setShots: (shots: number) => void;
  simulationResult: SimulationResult | null;
  isSimulating: boolean;
  activeRightTab: 'results' | 'bloch' | 'tutor';
  setActiveRightTab: (tab: 'results' | 'bloch' | 'tutor') => void;
  activeCodeLanguage: 'qiskit' | 'cirq' | 'qasm' | 'pennylane';
  setActiveCodeLanguage: (lang: 'qiskit' | 'cirq' | 'qasm' | 'pennylane') => void;
  isExplainerOpen: boolean;
  setIsExplainerOpen: (open: boolean) => void;

  // Actions
  addGate: (gate: Omit<PlacedGate, 'id'>) => void;
  removeGate: (id: string) => void;
  updateGate: (id: string, updates: Partial<PlacedGate>) => void;
  clearCircuit: () => void;
  resetToGroundState: () => void;
  setNumQubits: (num: number) => void;
  setNumColumns: (num: number) => void;
  loadPreset: (preset: PresetCircuit | string) => void;
  runSimulation: () => Promise<void>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const QuantumContext = createContext<QuantumContextType | undefined>(undefined);

const INITIAL_CIRCUIT: CircuitState = {
  numQubits: 2,
  numColumns: 6,
  gates: [
    { id: 'g_1', type: 'H', targetQubit: 0, column: 0 },
    { id: 'g_2', type: 'CNOT', targetQubit: 1, controlQubit: 0, column: 1 },
    { id: 'g_3', type: 'M', targetQubit: 0, column: 2 },
    { id: 'g_4', type: 'M', targetQubit: 1, column: 2 },
  ],
};

export const QuantumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [circuit, setCircuit] = useState<CircuitState>(INITIAL_CIRCUIT);
  const [history, setHistory] = useState<CircuitState[]>([]);
  const [future, setFuture] = useState<CircuitState[]>([]);

  const [selectedPaletteGate, setSelectedPaletteGate] = useState<GateType | null>(null);
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);
  const [selectedQubitForBloch, setSelectedQubitForBloch] = useState<number>(0);

  const [backend, setBackend] = useState<SimulatorBackend>('qiskit_aer');
  const [shots, setShots] = useState<number>(1024);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  const [activeRightTab, setActiveRightTab] = useState<'results' | 'bloch' | 'tutor'>('results');
  const [activeCodeLanguage, setActiveCodeLanguage] = useState<'qiskit' | 'cirq' | 'qasm' | 'pennylane'>('qiskit');
  const [isExplainerOpen, setIsExplainerOpen] = useState<boolean>(false);

  // Push state to undo stack
  const updateCircuitWithHistory = useCallback(
    (newCircuitOrFn: CircuitState | ((prev: CircuitState) => CircuitState)) => {
      setCircuit((prev) => {
        const next = typeof newCircuitOrFn === 'function' ? newCircuitOrFn(prev) : newCircuitOrFn;
        setHistory((h) => [...h.slice(-20), prev]); // limit to 20 history states
        setFuture([]);
        return next;
      });
    },
    []
  );

  const addGate = useCallback(
    (gateData: Omit<PlacedGate, 'id'>) => {
      updateCircuitWithHistory((prev) => {
        // Remove existing gate at exact targetQubit and column if any
        const filtered = prev.gates.filter(
          (g) => !(g.targetQubit === gateData.targetQubit && g.column === gateData.column)
        );
        const newGate: PlacedGate = {
          ...gateData,
          id: `gate_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        };
        return {
          ...prev,
          gates: [...filtered, newGate],
        };
      });
    },
    [updateCircuitWithHistory]
  );

  const removeGate = useCallback(
    (id: string) => {
      updateCircuitWithHistory((prev) => ({
        ...prev,
        gates: prev.gates.filter((g) => g.id !== id),
      }));
      setSelectedGateId((curr) => (curr === id ? null : curr));
    },
    [updateCircuitWithHistory]
  );

  const updateGate = useCallback(
    (id: string, updates: Partial<PlacedGate>) => {
      updateCircuitWithHistory((prev) => ({
        ...prev,
        gates: prev.gates.map((g) => (g.id === id ? { ...g, ...updates } : g)),
      }));
    },
    [updateCircuitWithHistory]
  );

  const clearCircuit = useCallback(() => {
    updateCircuitWithHistory((prev) => ({
      ...prev,
      gates: [],
    }));
    setSelectedGateId(null);
  }, [updateCircuitWithHistory]);

  const resetToGroundState = useCallback(() => {
    clearCircuit();
  }, [clearCircuit]);

  const setNumQubits = useCallback(
    (num: number) => {
      const clamped = Math.max(1, Math.min(6, num));
      updateCircuitWithHistory((prev) => ({
        ...prev,
        numQubits: clamped,
        // prune gates that were on removed qubits
        gates: prev.gates.filter(
          (g) =>
            g.targetQubit < clamped &&
            (g.controlQubit === undefined || g.controlQubit < clamped) &&
            (g.swapTargetQubit === undefined || g.swapTargetQubit < clamped)
        ),
      }));
      if (selectedQubitForBloch >= clamped) {
        setSelectedQubitForBloch(0);
      }
    },
    [selectedQubitForBloch, updateCircuitWithHistory]
  );

  const setNumColumns = useCallback(
    (num: number) => {
      const clamped = Math.max(4, Math.min(16, num));
      updateCircuitWithHistory((prev) => ({
        ...prev,
        numColumns: clamped,
        gates: prev.gates.filter((g) => g.column < clamped),
      }));
    },
    [updateCircuitWithHistory]
  );

  const loadPreset = useCallback(
    (preset: PresetCircuit | string) => {
      const targetPreset =
        typeof preset === 'string'
          ? PRESET_CIRCUITS.find((p) => p.id === preset)
          : preset;

      if (!targetPreset) return;

      const loadedGates: PlacedGate[] = targetPreset.gates.map((g, idx) => ({
        ...g,
        id: `preset_gate_${idx}_${Date.now()}`,
      }));

      updateCircuitWithHistory({
        numQubits: targetPreset.qubits,
        numColumns: Math.max(targetPreset.columns, 6),
        gates: loadedGates,
      });
      setSelectedGateId(null);
      setSelectedQubitForBloch(0);
    },
    [updateCircuitWithHistory]
  );

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory((h) => h.slice(0, h.length - 1));
    setFuture((f) => [circuit, ...f]);
    setCircuit(prev);
  }, [circuit, history]);

  const redo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setHistory((h) => [...h, circuit]);
    setCircuit(next);
  }, [circuit, future]);

  const runSimulation = useCallback(async () => {
    setIsSimulating(true);
    try {
      const result = await runQuantumCircuit(circuit, backend, shots);
      setSimulationResult(result);
    } finally {
      setIsSimulating(false);
    }
  }, [circuit, backend, shots]);

  // Automatically execute initial simulation and whenever circuit changes
  useEffect(() => {
    let isMounted = true;
    const runLive = async () => {
      const res = await runQuantumCircuit(circuit, backend, shots);
      if (isMounted) {
        setSimulationResult(res);
      }
    };
    runLive();
    return () => {
      isMounted = false;
    };
  }, [circuit, backend, shots]);

  return (
    <QuantumContext.Provider
      value={{
        circuit,
        selectedPaletteGate,
        setSelectedPaletteGate,
        selectedGateId,
        setSelectedGateId,
        selectedQubitForBloch,
        setSelectedQubitForBloch,
        backend,
        setBackend,
        shots,
        setShots,
        simulationResult,
        isSimulating,
        activeRightTab,
        setActiveRightTab,
        activeCodeLanguage,
        setActiveCodeLanguage,
        isExplainerOpen,
        setIsExplainerOpen,
        addGate,
        removeGate,
        updateGate,
        clearCircuit,
        resetToGroundState,
        setNumQubits,
        setNumColumns,
        loadPreset,
        runSimulation,
        undo,
        redo,
        canUndo: history.length > 0,
        canRedo: future.length > 0,
      }}
    >
      {children}
    </QuantumContext.Provider>
  );
};

export const useQuantum = () => {
  const context = useContext(QuantumContext);
  if (!context) {
    throw new Error('useQuantum must be used within a QuantumProvider');
  }
  return context;
};
