import { Challenge } from '@/types/learning';
import { CircuitState } from '@/types/quantum';
import { simulateCircuit } from './quantumEngine';

export const CHALLENGES: Challenge[] = [
  {
    id: 'ch_1',
    slug: 'create-bell-state',
    title: 'Construct the Bell State |Φ+⟩',
    category: 'Entanglement',
    difficulty: 'Beginner',
    xp: 100,
    description: 'Construct the canonical 2-qubit entangled Bell State (|00⟩ + |11⟩)/√2 from the ground state |00⟩.',
    instructions: [
      'Start with 2 qubits initialized to |00⟩.',
      'Apply a Hadamard (H) gate to qubit q0.',
      'Apply a CNOT gate with control on q0 and target on q1.',
      'Add Measurement (M) gates to both qubits.',
      'Run the simulation and submit to verify 50% |00⟩ and 50% |11⟩ outcomes.',
    ],
    targetQubits: 2,
    expectedDistribution: {
      '00': 0.5,
      '11': 0.5,
    },
    hints: [
      'The Hadamard gate puts q0 into (|0⟩ + |1⟩)/√2.',
      'The CNOT gate flips q1 whenever q0 is 1, turning the |10⟩ component into |11⟩.',
    ],
    starterGates: [],
  },
  {
    id: 'ch_2',
    slug: 'swap-without-swap-gate',
    title: 'SWAP Two Qubits Using 3 CNOT Gates',
    category: 'Circuits',
    difficulty: 'Intermediate',
    xp: 150,
    description: 'Implement a complete SWAP operation between q0 and q1 using ONLY 3 CNOT gates (without using the native SWAP gate).',
    instructions: [
      'Start with 2 qubits. (To verify the swap, prepare q0 in |1⟩ using an X gate).',
      'Use exactly 3 CNOT gates with alternating control/target orientations.',
      'The target result should transform |10⟩ into |01⟩.',
    ],
    targetQubits: 2,
    expectedDistribution: {
      '01': 1.0,
    },
    hints: [
      'The standard CNOT swap identity is: CNOT(0→1), CNOT(1→0), CNOT(0→1).',
      'Make sure you initialize q0 to |1⟩ with an X gate at column 0 so you can observe the swapped state on q1!',
    ],
    starterGates: [
      { type: 'X', targetQubit: 0, column: 0 },
    ],
  },
  {
    id: 'ch_3',
    slug: 'create-ghz-state',
    title: 'Synthesize the 3-Qubit GHZ State',
    category: 'Entanglement',
    difficulty: 'Intermediate',
    xp: 200,
    description: 'Construct the Greenberger–Horne–Zeilinger tripartite maximally entangled state (|000⟩ + |111⟩)/√2.',
    instructions: [
      'Use 3 qubits.',
      'Apply a Hadamard gate to q0.',
      'Cascade CNOT gates from q0 to q1, and from q1 to q2.',
      'Measure all three qubits to observe 50% |000⟩ and 50% |111⟩ with 0% other outcomes.',
    ],
    targetQubits: 3,
    expectedDistribution: {
      '000': 0.5,
      '111': 0.5,
    },
    hints: [
      'The first CNOT entangles q0 and q1 into (|00⟩ + |11⟩)/√2.',
      'The second CNOT with control q1 and target q2 entangles the third qubit into the joint state.',
    ],
  },
  {
    id: 'ch_4',
    slug: 'deutsch-balanced-oracle',
    title: "Implement Deutsch's Algorithm (Balanced Oracle)",
    category: 'Algorithms',
    difficulty: 'Advanced',
    xp: 250,
    description: "Construct Deutsch's algorithm with a balanced oracle f(x) = x to determine whether the function is constant or balanced in 1 query.",
    instructions: [
      'Initialize q0 in |0⟩ and ancilla q1 in |1⟩ (using an X gate on q1).',
      'Apply Hadamard to both q0 and q1.',
      'Insert a balanced oracle (CNOT with control q0 and target q1).',
      'Apply a Hadamard gate to q0.',
      'Measure q0. For a balanced function, measuring q0 must yield |1⟩ with 100% certainty!',
    ],
    targetQubits: 2,
    expectedDistribution: {
      '11': 0.5,
      '10': 0.5, // Note: q0 is measured as 1
    },
    hints: [
      'Remember that the ancilla qubit q1 must be in state |-⟩ = (|0⟩ - |1⟩)/√2 before the oracle.',
      'Phase kickback from the oracle flips the relative phase of q0, allowing the final Hadamard to cause destructive interference at |0⟩ and constructive interference at |1⟩.',
    ],
  },
];

export interface ChallengeSubmissionResult {
  success: boolean;
  score: number;
  xpEarned: number;
  message: string;
  measuredProbabilities: Record<string, number>;
  expectedProbabilities: Record<string, number>;
  fidelity: number;
  details: string[];
}

export async function submitChallenge(
  challengeId: string,
  circuit: CircuitState
): Promise<ChallengeSubmissionResult> {
  // Artificial simulation evaluation delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  const challenge = CHALLENGES.find((c) => c.id === challengeId);
  if (!challenge) {
    return {
      success: false,
      score: 0,
      xpEarned: 0,
      message: 'Challenge not found',
      measuredProbabilities: {},
      expectedProbabilities: {},
      fidelity: 0,
      details: ['Invalid challenge identifier'],
    };
  }

  const { probabilities } = simulateCircuit(circuit);
  const details: string[] = [];

  // Calculate classical fidelity / Bhattacharyya coefficient overlap between measured and expected
  let fidelity = 0;
  const expectedKeys = Object.keys(challenge.expectedDistribution);

  for (const key of expectedKeys) {
    const pExp = challenge.expectedDistribution[key] || 0;
    const pMeas = probabilities[key] || 0;
    fidelity += Math.sqrt(pExp * pMeas);
    details.push(`State |${key}⟩: Expected ${(pExp * 100).toFixed(1)}%, Observed ${(pMeas * 100).toFixed(1)}%`);
  }

  const isSuccess = fidelity >= 0.95;

  return {
    success: isSuccess,
    score: isSuccess ? 100 : Math.round(fidelity * 100),
    xpEarned: isSuccess ? challenge.xp : 0,
    message: isSuccess
      ? `🎉 Challenge Solved! Quantum state fidelity matches target criteria (${(fidelity * 100).toFixed(1)}%).`
      : `Circuit state does not match expected distribution (Fidelity ${(fidelity * 100).toFixed(1)}% < 95%). Check your gates and hints.`,
    measuredProbabilities: probabilities,
    expectedProbabilities: challenge.expectedDistribution,
    fidelity: Number(fidelity.toFixed(3)),
    details,
  };
}
