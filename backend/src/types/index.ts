// Shared TypeScript types across the backend

export interface ApiSuccess<T = unknown> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError;

// ─── QUANTUM TYPES (Mirror frontend types) ───────────────────────────────────

export type GateType =
  | 'H' | 'X' | 'Y' | 'Z' | 'S' | 'T'
  | 'Rx' | 'Ry' | 'Rz'
  | 'CNOT' | 'CZ' | 'SWAP' | 'CCX'
  | 'M' | 'BARRIER';

export interface PlacedGate {
  id?: string;
  type: GateType;
  targetQubit: number;
  controlQubit?: number;
  secondControlQubit?: number;
  swapTargetQubit?: number;
  column: number;
  parameter?: number;
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

export interface StateVectorAmplitude {
  basisState: string;
  index: number;
  amplitude: ComplexNumber;
  probability: number;
  phase: number;
}

export interface QuantumStateVector {
  numQubits: number;
  amplitudes: StateVectorAmplitude[];
}

export interface BlochCoordinates {
  x: number;
  y: number;
  z: number;
  theta: number;
  phi: number;
}

export interface SimulationResult {
  executionId: string;
  backend: string;
  shots: number;
  executionTimeMs: number;
  timestamp: string;
  probabilities: Record<string, number>;
  counts: Record<string, number>;
  stateVector: QuantumStateVector;
  blochSpheres: Record<number, BlochCoordinates>;
  success: boolean;
  errorMessage?: string;
}

export interface ChallengeSubmissionResult {
  success: boolean;
  passed: boolean;
  score: number;
  xpEarned: number;
  message: string;
  measuredProbabilities: Record<string, number>;
  expectedProbabilities: Record<string, number>;
  fidelity: number;
  details: string[];
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// Extend Express Request to include authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
