import { prisma } from '../config/db';
import { CircuitState, ChallengeSubmissionResult } from '../types';
import { simulateLocally } from './quantumService';

export const DEFAULT_CHALLENGES = [
  {
    id: 'ch_1',
    slug: 'create-bell-state',
    title: 'Construct the Bell State |Φ+⟩',
    category: 'Entanglement',
    difficulty: 'Beginner' as const,
    xp: 100,
    description:
      'Construct the canonical 2-qubit entangled Bell State (|00⟩ + |11⟩)/√2 from the ground state |00⟩.',
    instructions: [
      'Start with 2 qubits initialized to |00⟩.',
      'Apply a Hadamard (H) gate to qubit q0.',
      'Apply a CNOT gate with control on q0 and target on q1.',
      'Add Measurement (M) gates to both qubits.',
      'Run the simulation and submit to verify 50% |00⟩ and 50% |11⟩ outcomes.',
    ],
    expectedDistribution: {
      '00': 0.5,
      '11': 0.5,
    },
    hints: [
      'The Hadamard gate puts q0 into (|0⟩ + |1⟩)/√2.',
      'The CNOT gate flips q1 whenever q0 is 1, turning the |10⟩ component into |11⟩.',
    ],
    targetQubits: 2,
  },
  {
    id: 'ch_2',
    slug: 'swap-with-cnots',
    title: 'SWAP Two Qubits Using 3 CNOT Gates',
    category: 'Circuits',
    difficulty: 'Intermediate' as const,
    xp: 150,
    description:
      'Implement a complete SWAP operation between q0 and q1 using ONLY 3 CNOT gates.',
    instructions: [
      'Start with 2 qubits.',
      'Use exactly 3 CNOT gates with alternating control/target orientations.',
      'The target result should transform |10⟩ into |01⟩.',
    ],
    expectedDistribution: {
      '01': 1.0,
    },
    hints: [
      'The standard CNOT swap identity is: CNOT(0→1), CNOT(1→0), CNOT(0→1).',
    ],
    targetQubits: 2,
  },
];

export async function getAllChallenges() {
  try {
    const challenges = await prisma.challenge.findMany({
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        difficulty: true,
        xp: true,
        description: true,
        instructions: true,
        expectedDistribution: true,
        hints: true,
        targetQubits: true,
      },
    });

    if (challenges && challenges.length > 0) return challenges;
  } catch {
    // Fall through to default challenges
  }

  return DEFAULT_CHALLENGES;
}

export async function getChallengeById(idOrSlug: string) {
  try {
    const challenge = await prisma.challenge.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
    });

    if (challenge) return challenge;
  } catch {
    // Fall through to default challenges
  }

  const fallback = DEFAULT_CHALLENGES.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
  if (fallback) return fallback as any;

  const error: any = new Error('Challenge not found.');
  error.status = 404;
  error.code = 'CHALLENGE_NOT_FOUND';
  throw error;
}

export async function evaluateChallengeSubmission(
  challengeIdOrSlug: string,
  circuit: CircuitState,
  userId?: string
): Promise<ChallengeSubmissionResult> {
  const challenge = await getChallengeById(challengeIdOrSlug);
  const expectedDist = challenge.expectedDistribution as Record<string, number>;

  // Simulate circuit
  const { probabilities } = simulateLocally(circuit);
  const details: string[] = [];

  // Calculate classical fidelity / Bhattacharyya coefficient overlap
  let fidelity = 0;
  const expectedKeys = Object.keys(expectedDist);

  for (const key of expectedKeys) {
    const pExp = expectedDist[key] || 0;
    const pMeas = probabilities[key] || 0;
    fidelity += Math.sqrt(pExp * pMeas);
    details.push(
      `State |${key}⟩: Expected ${(pExp * 100).toFixed(1)}%, Observed ${(pMeas * 100).toFixed(1)}%`
    );
  }

  const isSuccess = fidelity >= 0.95;
  const score = isSuccess ? 100 : Math.round(fidelity * 100);
  const xpEarned = isSuccess ? challenge.xp : 0;
  const message = isSuccess
    ? `🎉 Challenge Solved! Quantum state fidelity matches target criteria (${(fidelity * 100).toFixed(1)}%).`
    : `Circuit state does not match expected distribution (Fidelity ${(fidelity * 100).toFixed(1)}% < 95%). Check your gates and hints.`;

  const result: ChallengeSubmissionResult = {
    success: isSuccess,
    passed: isSuccess,
    score,
    xpEarned,
    message,
    measuredProbabilities: probabilities,
    expectedProbabilities: expectedDist,
    fidelity: Number(fidelity.toFixed(3)),
    details,
  };

  // Record in database if user is authenticated and DB available
  if (userId) {
    try {
      await prisma.challengeSubmission.create({
        data: {
          userId,
          challengeId: challenge.id,
          circuitData: circuit as any,
          result: result as any,
          score,
          passed: isSuccess,
          fidelity: Number(fidelity.toFixed(3)),
          xpEarned,
          feedback: message,
        },
      });
    } catch {
      // Ignore DB write error in offline mode
    }
  }

  return result;
}
