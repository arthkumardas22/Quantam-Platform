import { PresetCircuit } from '@/types/quantum';

export const PRESET_CIRCUITS: PresetCircuit[] = [
  {
    id: 'bell_state_phi_plus',
    name: 'Bell State |Φ+⟩',
    category: 'Entanglement',
    description: 'Creates a maximally entangled pair (|00⟩ + |11⟩)/√2 using Hadamard and CNOT.',
    qubits: 2,
    columns: 4,
    gates: [
      { type: 'H', targetQubit: 0, column: 0 },
      { type: 'CNOT', targetQubit: 1, controlQubit: 0, column: 1 },
      { type: 'M', targetQubit: 0, column: 2 },
      { type: 'M', targetQubit: 1, column: 2 },
    ],
  },
  {
    id: 'bell_state_psi_plus',
    name: 'Bell State |Ψ+⟩',
    category: 'Entanglement',
    description: 'Creates entangled pair (|01⟩ + |10⟩)/√2 using X on q1, then H on q0 and CNOT.',
    qubits: 2,
    columns: 4,
    gates: [
      { type: 'X', targetQubit: 1, column: 0 },
      { type: 'H', targetQubit: 0, column: 1 },
      { type: 'CNOT', targetQubit: 1, controlQubit: 0, column: 2 },
      { type: 'M', targetQubit: 0, column: 3 },
      { type: 'M', targetQubit: 1, column: 3 },
    ],
  },
  {
    id: 'ghz_state',
    name: '3-Qubit GHZ State',
    category: 'Entanglement',
    description: 'Greenberger–Horne–Zeilinger tripartite maximally entangled state (|000⟩ + |111⟩)/√2.',
    qubits: 3,
    columns: 5,
    gates: [
      { type: 'H', targetQubit: 0, column: 0 },
      { type: 'CNOT', targetQubit: 1, controlQubit: 0, column: 1 },
      { type: 'CNOT', targetQubit: 2, controlQubit: 1, column: 2 },
      { type: 'M', targetQubit: 0, column: 3 },
      { type: 'M', targetQubit: 1, column: 3 },
      { type: 'M', targetQubit: 2, column: 3 },
    ],
  },
  {
    id: 'quantum_teleportation',
    name: 'Quantum Teleportation',
    category: 'Communication',
    description: 'Transfers unknown state from Alice (q0) to Bob (q2) via pre-shared Bell pair (q1, q2).',
    qubits: 3,
    columns: 7,
    gates: [
      // State preparation on q0 (e.g. arbitrary state via Rx)
      { type: 'Rx', targetQubit: 0, column: 0, parameter: Math.PI / 3 },
      // Create EPR pair between q1 and q2
      { type: 'H', targetQubit: 1, column: 1 },
      { type: 'CNOT', targetQubit: 2, controlQubit: 1, column: 2 },
      // Bell measurement by Alice on q0, q1
      { type: 'CNOT', targetQubit: 1, controlQubit: 0, column: 3 },
      { type: 'H', targetQubit: 0, column: 4 },
      // Measurement
      { type: 'M', targetQubit: 0, column: 5 },
      { type: 'M', targetQubit: 1, column: 5 },
    ],
  },
  {
    id: 'grover_2qubit',
    name: "Grover's Search (2 Qubits)",
    category: 'Algorithms',
    description: 'Finds marked item |11⟩ in a 4-item unsorted database with 100% probability in 1 iteration.',
    qubits: 2,
    columns: 7,
    gates: [
      // Initialize equal superposition
      { type: 'H', targetQubit: 0, column: 0 },
      { type: 'H', targetQubit: 1, column: 0 },
      // Oracle marking |11⟩ (CZ gate)
      { type: 'CZ', targetQubit: 1, controlQubit: 0, column: 1 },
      // Grover Diffusion Operator
      { type: 'H', targetQubit: 0, column: 2 },
      { type: 'H', targetQubit: 1, column: 2 },
      { type: 'X', targetQubit: 0, column: 3 },
      { type: 'X', targetQubit: 1, column: 3 },
      { type: 'CZ', targetQubit: 1, controlQubit: 0, column: 4 },
      { type: 'X', targetQubit: 0, column: 5 },
      { type: 'X', targetQubit: 1, column: 5 },
      { type: 'H', targetQubit: 0, column: 6 },
      { type: 'H', targetQubit: 1, column: 6 },
    ],
  },
  {
    id: 'deutsch_jozsa',
    name: 'Deutsch-Jozsa Algorithm',
    category: 'Algorithms',
    description: 'Determines whether a boolean function f(x) is constant or balanced in a single query.',
    qubits: 2,
    columns: 5,
    gates: [
      // Initialize q0=|0>, q1=|1>
      { type: 'X', targetQubit: 1, column: 0 },
      // Apply H to both
      { type: 'H', targetQubit: 0, column: 1 },
      { type: 'H', targetQubit: 1, column: 1 },
      // Balanced Oracle (CNOT)
      { type: 'CNOT', targetQubit: 1, controlQubit: 0, column: 2 },
      // Interference
      { type: 'H', targetQubit: 0, column: 3 },
      { type: 'M', targetQubit: 0, column: 4 },
    ],
  },
  {
    id: 'superdense_coding',
    name: 'Superdense Coding',
    category: 'Communication',
    description: 'Transmits two classical bits (e.g. "11") using only one physical quantum qubit.',
    qubits: 2,
    columns: 6,
    gates: [
      // Create shared Bell pair
      { type: 'H', targetQubit: 0, column: 0 },
      { type: 'CNOT', targetQubit: 1, controlQubit: 0, column: 1 },
      // Alice encodes message '11' by applying Z then X to q0
      { type: 'Z', targetQubit: 0, column: 2 },
      { type: 'X', targetQubit: 0, column: 3 },
      // Bob decodes with CNOT and H
      { type: 'CNOT', targetQubit: 1, controlQubit: 0, column: 4 },
      { type: 'H', targetQubit: 0, column: 5 },
    ],
  },
  {
    id: 'qft_3qubit',
    name: '3-Qubit Quantum Fourier Transform',
    category: 'Algorithms',
    description: 'Transforms quantum state from computational basis to frequency basis with quantum speedup.',
    qubits: 3,
    columns: 7,
    gates: [
      { type: 'H', targetQubit: 0, column: 0 },
      { type: 'S', targetQubit: 0, column: 1 },
      { type: 'H', targetQubit: 1, column: 2 },
      { type: 'S', targetQubit: 1, column: 3 },
      { type: 'H', targetQubit: 2, column: 4 },
      { type: 'SWAP', targetQubit: 0, swapTargetQubit: 2, column: 5 },
      { type: 'M', targetQubit: 0, column: 6 },
      { type: 'M', targetQubit: 1, column: 6 },
      { type: 'M', targetQubit: 2, column: 6 },
    ],
  },
];
