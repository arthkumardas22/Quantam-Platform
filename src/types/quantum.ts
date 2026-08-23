export type GateType =
  | 'H'
  | 'X'
  | 'Y'
  | 'Z'
  | 'S'
  | 'T'
  | 'Rx'
  | 'Ry'
  | 'Rz'
  | 'CNOT'
  | 'CZ'
  | 'SWAP'
  | 'CCX'
  | 'M'
  | 'BARRIER';

export type GateCategory = 'single' | 'phase' | 'controlled' | 'measurement' | 'special';

export interface GateDefinition {
  type: GateType;
  name: string;
  symbol: string;
  category: GateCategory;
  description: string;
  matrixDisplay?: string;
  color: string;
  borderGlow: string;
  isMultiQubit?: boolean;
  qubitCount?: number;
  hasParameter?: boolean;
  defaultParam?: number; // e.g. theta in radians or pi fractions
}

export interface PlacedGate {
  id: string;
  type: GateType;
  targetQubit: number; // primary qubit (or target qubit for CNOT)
  controlQubit?: number; // for CNOT, CZ
  secondControlQubit?: number; // for CCX / Toffoli
  swapTargetQubit?: number; // for SWAP
  column: number; // time step / column index
  parameter?: number; // for Rx, Ry, Rz (in terms of radians / pi)
  comment?: string;
}

export interface CircuitState {
  numQubits: number;
  numColumns: number;
  gates: PlacedGate[];
}

export interface ComplexNumber {
  re: number;
  im: number;
}

export interface QuantumStateVector {
  numQubits: number;
  amplitudes: {
    basisState: string; // e.g. "00", "01", "10", "11"
    index: number;
    amplitude: ComplexNumber;
    probability: number;
    phase: number; // angle in radians (-pi to pi)
  }[];
}

export interface BlochCoordinates {
  x: number;
  y: number;
  z: number;
  theta: number; // polar angle [0, pi]
  phi: number; // azimuthal angle [0, 2pi]
}

export interface SimulationResult {
  executionId: string;
  backend: string;
  shots: number;
  executionTimeMs: number;
  timestamp: string;
  probabilities: Record<string, number>; // "00": 0.50, "11": 0.50
  counts: Record<string, number>; // "00": 512, "11": 512
  stateVector: QuantumStateVector;
  blochSpheres: Record<number, BlochCoordinates>; // per qubit index
  success: boolean;
  errorMessage?: string;
}

export type SimulatorBackend = 'qiskit_aer' | 'cirq_simulator' | 'pennylane_lightning' | 'ibm_quantum_cloud';

export interface PresetCircuit {
  id: string;
  name: string;
  category: string;
  description: string;
  qubits: number;
  columns: number;
  gates: Omit<PlacedGate, 'id'>[];
}
