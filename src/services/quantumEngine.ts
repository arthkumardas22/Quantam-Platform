import {
  ComplexNumber,
  QuantumStateVector,
  BlochCoordinates,
  PlacedGate,
  CircuitState,
} from '@/types/quantum';

// Complex number helpers
export const c_zero: ComplexNumber = { re: 0, im: 0 };
export const c_one: ComplexNumber = { re: 1, im: 0 };
export const c_i: ComplexNumber = { re: 0, im: 1 };

export function c_add(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function c_sub(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return { re: a.re - b.re, im: a.im - b.im };
}

export function c_mul(a: ComplexNumber, b: ComplexNumber): ComplexNumber {
  return {
    re: a.re * b.re - a.im * b.im,
    im: a.re * b.im + a.im * b.re,
  };
}

export function c_abs2(a: ComplexNumber): number {
  return a.re * a.re + a.im * a.im;
}

export function c_abs(a: ComplexNumber): number {
  return Math.sqrt(c_abs2(a));
}

export function c_phase(a: ComplexNumber): number {
  return Math.atan2(a.im, a.re);
}

export function c_scale(a: ComplexNumber, scalar: number): ComplexNumber {
  return { re: a.re * scalar, im: a.im * scalar };
}

export type Matrix2x2 = [
  [ComplexNumber, ComplexNumber],
  [ComplexNumber, ComplexNumber]
];

const INV_SQRT2 = 1 / Math.SQRT2;

export function getSingleQubitMatrix(type: string, param: number = 0): Matrix2x2 {
  switch (type) {
    case 'H':
      return [
        [{ re: INV_SQRT2, im: 0 }, { re: INV_SQRT2, im: 0 }],
        [{ re: INV_SQRT2, im: 0 }, { re: -INV_SQRT2, im: 0 }],
      ];
    case 'X':
      return [
        [c_zero, c_one],
        [c_one, c_zero],
      ];
    case 'Y':
      return [
        [c_zero, { re: 0, im: -1 }],
        [{ re: 0, im: 1 }, c_zero],
      ];
    case 'Z':
      return [
        [c_one, c_zero],
        [c_zero, { re: -1, im: 0 }],
      ];
    case 'S':
      return [
        [c_one, c_zero],
        [c_zero, { re: 0, im: 1 }],
      ];
    case 'T':
      return [
        [c_one, c_zero],
        [c_zero, { re: Math.cos(Math.PI / 4), im: Math.sin(Math.PI / 4) }],
      ];
    case 'Rx': {
      const half = param / 2;
      return [
        [{ re: Math.cos(half), im: 0 }, { re: 0, im: -Math.sin(half) }],
        [{ re: 0, im: -Math.sin(half) }, [{ re: Math.cos(half), im: 0 }][0]],
      ];
    }
    case 'Ry': {
      const half = param / 2;
      return [
        [{ re: Math.cos(half), im: 0 }, { re: -Math.sin(half), im: 0 }],
        [{ re: Math.sin(half), im: 0 }, { re: Math.cos(half), im: 0 }],
      ];
    }
    case 'Rz': {
      const half = param / 2;
      return [
        [{ re: Math.cos(-half), im: Math.sin(-half) }, c_zero],
        [c_zero, { re: Math.cos(half), im: Math.sin(half) }],
      ];
    }
    default:
      return [
        [c_one, c_zero],
        [c_zero, c_one],
      ];
  }
}

/**
 * Simulates the circuit state vector mathematically using exact quantum state tensor products.
 */
export function simulateCircuit(circuit: CircuitState): {
  stateVector: QuantumStateVector;
  probabilities: Record<string, number>;
  blochCoordinates: Record<number, BlochCoordinates>;
} {
  const numQubits = Math.max(1, Math.min(6, circuit.numQubits));
  const dim = 1 << numQubits;

  // Initialize state |0...0> = (1, 0, 0, ..., 0)^T
  let state: ComplexNumber[] = new Array(dim).fill(c_zero);
  state[0] = c_one;

  // Sort gates by time column, then by target qubit
  const sortedGates = [...circuit.gates].sort((a, b) => {
    if (a.column !== b.column) return a.column - b.column;
    return a.targetQubit - b.targetQubit;
  });

  for (const gate of sortedGates) {
    if (gate.type === 'BARRIER' || gate.type === 'M') {
      continue; // Measurement and barrier do not change state vector unitary
    }

    if (
      ['H', 'X', 'Y', 'Z', 'S', 'T', 'Rx', 'Ry', 'Rz'].includes(gate.type)
    ) {
      state = applySingleQubitGate(
        state,
        numQubits,
        gate.targetQubit,
        getSingleQubitMatrix(gate.type, gate.parameter ?? 0)
      );
    } else if (gate.type === 'CNOT' && gate.controlQubit !== undefined) {
      state = applyControlledNot(state, numQubits, gate.controlQubit, gate.targetQubit);
    } else if (gate.type === 'CZ' && gate.controlQubit !== undefined) {
      state = applyControlledZ(state, numQubits, gate.controlQubit, gate.targetQubit);
    } else if (gate.type === 'SWAP' && gate.swapTargetQubit !== undefined) {
      state = applySwap(state, numQubits, gate.targetQubit, gate.swapTargetQubit);
    } else if (
      gate.type === 'CCX' &&
      gate.controlQubit !== undefined &&
      gate.secondControlQubit !== undefined
    ) {
      state = applyToffoli(
        state,
        numQubits,
        gate.controlQubit,
        gate.secondControlQubit,
        gate.targetQubit
      );
    }
  }

  // Format state vector & probabilities
  const amplitudes = [];
  const probabilities: Record<string, number> = {};

  for (let i = 0; i < dim; i++) {
    const basisState = i.toString(2).padStart(numQubits, '0');
    const amp = state[i];
    const prob = c_abs2(amp);
    const phase = c_phase(amp);

    amplitudes.push({
      basisState,
      index: i,
      amplitude: amp,
      probability: prob,
      phase,
    });

    if (prob > 1e-6) {
      probabilities[basisState] = Number(prob.toFixed(4));
    }
  }

  // Calculate Bloch Sphere coordinates for each individual qubit
  const blochCoordinates: Record<number, BlochCoordinates> = {};
  for (let q = 0; q < numQubits; q++) {
    blochCoordinates[q] = calculateQubitBlochCoordinates(state, numQubits, q);
  }

  return {
    stateVector: {
      numQubits,
      amplitudes,
    },
    probabilities,
    blochCoordinates,
  };
}

function applySingleQubitGate(
  state: ComplexNumber[],
  numQubits: number,
  targetQubit: number,
  matrix: Matrix2x2
): ComplexNumber[] {
  const dim = 1 << numQubits;
  const newState = new Array(dim);
  // In our indexing: qubit 0 is the most-significant bit (or highest wire q0)
  // Shift index: bit position for targetQubit from right is (numQubits - 1 - targetQubit)
  const bitPos = numQubits - 1 - targetQubit;
  const bitMask = 1 << bitPos;

  for (let i = 0; i < dim; i++) {
    if ((i & bitMask) === 0) {
      const i0 = i;
      const i1 = i | bitMask;
      const v0 = state[i0];
      const v1 = state[i1];

      // [ [u00, u01], [u10, u11] ] * [v0, v1]^T
      const newV0 = c_add(c_mul(matrix[0][0], v0), c_mul(matrix[0][1], v1));
      const newV1 = c_add(c_mul(matrix[1][0], v0), c_mul(matrix[1][1], v1));

      newState[i0] = newV0;
      newState[i1] = newV1;
    }
  }

  return newState;
}

function applyControlledNot(
  state: ComplexNumber[],
  numQubits: number,
  control: number,
  target: number
): ComplexNumber[] {
  const dim = 1 << numQubits;
  const newState = [...state];
  const ctrlBit = 1 << (numQubits - 1 - control);
  const tgtBit = 1 << (numQubits - 1 - target);

  for (let i = 0; i < dim; i++) {
    // If control bit is 1 and target bit is 0, swap amplitude with index where target bit is 1
    if ((i & ctrlBit) !== 0 && (i & tgtBit) === 0) {
      const j = i | tgtBit;
      const tmp = newState[i];
      newState[i] = newState[j];
      newState[j] = tmp;
    }
  }
  return newState;
}

function applyControlledZ(
  state: ComplexNumber[],
  numQubits: number,
  control: number,
  target: number
): ComplexNumber[] {
  const dim = 1 << numQubits;
  const newState = [...state];
  const ctrlBit = 1 << (numQubits - 1 - control);
  const tgtBit = 1 << (numQubits - 1 - target);

  for (let i = 0; i < dim; i++) {
    if ((i & ctrlBit) !== 0 && (i & tgtBit) !== 0) {
      newState[i] = c_scale(newState[i], -1);
    }
  }
  return newState;
}

function applySwap(
  state: ComplexNumber[],
  numQubits: number,
  q1: number,
  q2: number
): ComplexNumber[] {
  const dim = 1 << numQubits;
  const newState = [...state];
  const bit1 = 1 << (numQubits - 1 - q1);
  const bit2 = 1 << (numQubits - 1 - q2);

  for (let i = 0; i < dim; i++) {
    const val1 = (i & bit1) !== 0;
    const val2 = (i & bit2) !== 0;
    if (val1 && !val2) {
      const j = (i & ~bit1) | bit2;
      const tmp = newState[i];
      newState[i] = newState[j];
      newState[j] = tmp;
    }
  }
  return newState;
}

function applyToffoli(
  state: ComplexNumber[],
  numQubits: number,
  ctrl1: number,
  ctrl2: number,
  target: number
): ComplexNumber[] {
  const dim = 1 << numQubits;
  const newState = [...state];
  const bitC1 = 1 << (numQubits - 1 - ctrl1);
  const bitC2 = 1 << (numQubits - 1 - ctrl2);
  const bitT = 1 << (numQubits - 1 - target);

  for (let i = 0; i < dim; i++) {
    if ((i & bitC1) !== 0 && (i & bitC2) !== 0 && (i & bitT) === 0) {
      const j = i | bitT;
      const tmp = newState[i];
      newState[i] = newState[j];
      newState[j] = tmp;
    }
  }
  return newState;
}

/**
 * Computes the reduced density matrix and Bloch sphere coordinates (x, y, z, theta, phi) for qubit q.
 */
function calculateQubitBlochCoordinates(
  state: ComplexNumber[],
  numQubits: number,
  qubitIndex: number
): BlochCoordinates {
  const dim = 1 << numQubits;
  const bitPos = numQubits - 1 - qubitIndex;
  const bitMask = 1 << bitPos;

  // Reduced density matrix elements rho_00, rho_01, rho_10, rho_11
  let rho00 = 0;
  let rho11 = 0;
  let rho01: ComplexNumber = { re: 0, im: 0 };

  for (let i = 0; i < dim; i++) {
    if ((i & bitMask) === 0) {
      const i0 = i;
      const i1 = i | bitMask;
      const a0 = state[i0];
      const a1 = state[i1];

      rho00 += c_abs2(a0);
      rho11 += c_abs2(a1);

      // a0 * conjugate(a1)
      const a0_conj_a1: ComplexNumber = {
        re: a0.re * a1.re + a0.im * a1.im,
        im: a0.im * a1.re - a0.re * a1.im,
      };
      rho01 = c_add(rho01, a0_conj_a1);
    }
  }

  // Pauli expectation values
  // <sigma_x> = 2 * Re(rho_01)
  // <sigma_y> = -2 * Im(rho_01)
  // <sigma_z> = rho_00 - rho_11
  let x = 2 * rho01.re;
  let y = -2 * rho01.im;
  let z = rho00 - rho11;

  // Clamp small floating noise
  if (Math.abs(x) < 1e-5) x = 0;
  if (Math.abs(y) < 1e-5) y = 0;
  if (Math.abs(z) < 1e-5) z = 0;

  // Normalize if pure / entangled
  const len = Math.sqrt(x * x + y * y + z * z);
  let theta = 0;
  let phi = 0;

  if (len > 1e-5) {
    const normZ = Math.max(-1, Math.min(1, z / len));
    theta = Math.acos(normZ);
    phi = Math.atan2(y, x);
    if (phi < 0) phi += 2 * Math.PI;
  }

  return {
    x: Number(x.toFixed(4)),
    y: Number(y.toFixed(4)),
    z: Number(z.toFixed(4)),
    theta: Number(theta.toFixed(4)),
    phi: Number(phi.toFixed(4)),
  };
}

/**
 * Samples measurement shot counts based on probability distribution.
 */
export function sampleShots(
  probabilities: Record<string, number>,
  shots: number = 1024
): Record<string, number> {
  const counts: Record<string, number> = {};
  const states = Object.keys(probabilities);

  if (states.length === 0) {
    return { '0': shots };
  }

  // Cumulative distribution function
  const cdf: { state: string; limit: number }[] = [];
  let cumSum = 0;
  for (const st of states) {
    cumSum += probabilities[st];
    cdf.push({ state: st, limit: cumSum });
  }

  for (let s = 0; s < shots; s++) {
    const r = Math.random() * cumSum;
    let chosen = cdf[cdf.length - 1].state;
    for (const entry of cdf) {
      if (r <= entry.limit) {
        chosen = entry.state;
        break;
      }
    }
    counts[chosen] = (counts[chosen] || 0) + 1;
  }

  return counts;
}
