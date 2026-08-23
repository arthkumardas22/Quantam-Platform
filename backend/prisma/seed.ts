import 'dotenv/config';
import { PrismaClient, Difficulty } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── LEARNING TOPICS ──────────────────────────────────────────────────────

  const topics = await Promise.all([
    prisma.learningTopic.upsert({
      where: { slug: 'quantum-fundamentals' },
      update: {},
      create: {
        slug: 'quantum-fundamentals',
        title: 'Quantum Fundamentals',
        description: 'Learn about qubits, superposition, and the mathematical foundations of quantum computing.',
        category: 'Fundamentals',
        difficulty: Difficulty.Beginner,
        estimatedMinutes: 45,
        order: 1,
      },
    }),
    prisma.learningTopic.upsert({
      where: { slug: 'quantum-gates' },
      update: {},
      create: {
        slug: 'quantum-gates',
        title: 'Quantum Gates & Circuits',
        description: 'Master single and multi-qubit gates, and learn to build quantum circuits.',
        category: 'Circuits',
        difficulty: Difficulty.Beginner,
        estimatedMinutes: 60,
        order: 2,
      },
    }),
    prisma.learningTopic.upsert({
      where: { slug: 'quantum-entanglement' },
      update: {},
      create: {
        slug: 'quantum-entanglement',
        title: 'Quantum Entanglement & Bell States',
        description: 'Understand non-local quantum correlations and EPR pairs.',
        category: 'Circuits',
        difficulty: Difficulty.Intermediate,
        estimatedMinutes: 50,
        order: 3,
      },
    }),
    prisma.learningTopic.upsert({
      where: { slug: 'quantum-algorithms' },
      update: {},
      create: {
        slug: 'quantum-algorithms',
        title: 'Quantum Algorithm Design',
        description: "Grover's Search, Deutsch-Jozsa, Bernstein-Vazirani, and quantum speedups.",
        category: 'Algorithms',
        difficulty: Difficulty.Intermediate,
        estimatedMinutes: 90,
        order: 4,
      },
    }),
    prisma.learningTopic.upsert({
      where: { slug: 'quantum-fourier-transform' },
      update: {},
      create: {
        slug: 'quantum-fourier-transform',
        title: 'Quantum Fourier Transform',
        description: 'The building block of Shor\'s algorithm and quantum phase estimation.',
        category: 'Algorithms',
        difficulty: Difficulty.Advanced,
        estimatedMinutes: 80,
        order: 5,
      },
    }),
  ]);

  console.log(`✅ Created ${topics.length} learning topics`);

  // ─── ALGORITHMS ───────────────────────────────────────────────────────────

  const algorithms = await Promise.all([
    prisma.algorithm.upsert({
      where: { slug: 'grovers-algorithm' },
      update: {},
      create: {
        slug: 'grovers-algorithm',
        name: "Grover's Algorithm",
        subtitle: 'Quadratic Speedup for Unstructured Search',
        description: 'Grover\'s algorithm searches an unstructured database of N items in O(√N) quantum queries vs O(N) classical.',
        purpose: 'Unstructured database search with quadratic speedup',
        category: 'Search',
        difficulty: Difficulty.Intermediate,
        inventor: 'Lov Grover',
        year: 1996,
        speedupType: 'Quadratic',
        classicalComplexity: 'O(N)',
        quantumComplexity: 'O(√N)',
        overview: "Grover's quantum search algorithm achieves a provably quadratic speedup over any classical search algorithm for unstructured databases.",
        mathFormalism: 'U_s · U_ω repeated ⌊π/4 · √N⌋ times',
        stepsExplanation: [
          { stepNumber: 1, title: 'Superposition', description: 'Apply H to all qubits to create uniform superposition over all N states.' },
          { stepNumber: 2, title: 'Oracle Query', description: 'Apply phase oracle Uω that flips the phase of the marked state: |x⟩ → -|x⟩.' },
          { stepNumber: 3, title: 'Diffusion', description: 'Apply diffusion operator 2|s⟩⟨s| - I to amplify the marked amplitude.' },
          { stepNumber: 4, title: 'Iterate', description: 'Repeat oracle + diffusion π/4 × √N times.' },
          { stepNumber: 5, title: 'Measure', description: 'Measure to obtain the marked state with near-100% probability.' },
        ],
        realWorldApplications: [
          'Database searching',
          'Optimization problems',
          'Cryptographic attacks (breaking symmetric keys)',
          'Constraint satisfaction problems',
        ],
        defaultPresetId: 'grover',
      },
    }),
    prisma.algorithm.upsert({
      where: { slug: 'deutsch-jozsa' },
      update: {},
      create: {
        slug: 'deutsch-jozsa',
        name: 'Deutsch-Jozsa Algorithm',
        subtitle: 'Exponential Speedup for Oracle Problems',
        description: 'Determines whether a black-box function is constant or balanced in a single query vs O(2^(n-1)+1) classical.',
        purpose: 'Determine if a function is constant or balanced in 1 query',
        category: 'Oracular',
        difficulty: Difficulty.Intermediate,
        inventor: 'David Deutsch & Richard Jozsa',
        year: 1992,
        speedupType: 'Exponential',
        classicalComplexity: 'O(2^(n-1))',
        quantumComplexity: 'O(1)',
        overview: "The Deutsch-Jozsa algorithm demonstrates exponential quantum speedup for a specific oracle problem, distinguishing constant from balanced functions.",
        mathFormalism: 'H^⊗n · U_f · H^⊗n |0⟩^n|1⟩',
        stepsExplanation: [
          { stepNumber: 1, title: 'Initialize', description: 'Set n query qubits to |0⟩ and ancilla qubit to |1⟩.' },
          { stepNumber: 2, title: 'Hadamard Layer', description: 'Apply H to all qubits creating superposition.' },
          { stepNumber: 3, title: 'Oracle', description: 'Query function f via phase kickback oracle Uf.' },
          { stepNumber: 4, title: 'Hadamard Again', description: 'Apply H to query qubits for interference.' },
          { stepNumber: 5, title: 'Measure', description: 'If all query qubits measure to |0⟩ → constant; otherwise → balanced.' },
        ],
        realWorldApplications: [
          'Verifying function properties',
          'Protocol testing',
          'Demonstrating quantum advantage',
          'Foundation for BV algorithm',
        ],
        defaultPresetId: 'deutsch-jozsa',
      },
    }),
    prisma.algorithm.upsert({
      where: { slug: 'quantum-teleportation' },
      update: {},
      create: {
        slug: 'quantum-teleportation',
        name: 'Quantum Teleportation',
        subtitle: 'Transmit Quantum States via Classical Channel + Entanglement',
        description: 'Transmits an arbitrary quantum state from Alice to Bob using pre-shared entanglement and classical communication.',
        purpose: 'Transfer quantum state without physical particle transport',
        category: 'Communication',
        difficulty: Difficulty.Intermediate,
        inventor: 'Bennett, Brassard et al.',
        year: 1993,
        speedupType: 'Communication',
        classicalComplexity: 'Impossible without entanglement',
        quantumComplexity: 'O(1) with pre-shared Bell pair',
        overview: 'Quantum teleportation enables exact quantum state transfer using a pre-shared Bell pair and 2 classical bits.',
        mathFormalism: '|ψ⟩ = α|0⟩ + β|1⟩ teleported via |Φ+⟩',
        stepsExplanation: [
          { stepNumber: 1, title: 'Bell Pair', description: 'Create maximally entangled Bell pair shared between Alice and Bob.' },
          { stepNumber: 2, title: 'Bell Measurement', description: 'Alice performs Bell measurement on her qubit and the state to teleport.' },
          { stepNumber: 3, title: 'Classical Bits', description: 'Alice sends 2 classical bits to Bob.' },
          { stepNumber: 4, title: 'Correction', description: 'Bob applies X and/or Z corrections based on Alice\'s bits.' },
          { stepNumber: 5, title: 'Verification', description: 'Bob\'s qubit is now identical to Alice\'s original state.' },
        ],
        realWorldApplications: [
          'Quantum networking',
          'Quantum internet protocols',
          'Distributed quantum computing',
          'Quantum key distribution',
        ],
        defaultPresetId: 'teleportation',
      },
    }),
    prisma.algorithm.upsert({
      where: { slug: 'quantum-fourier-transform' },
      update: {},
      create: {
        slug: 'quantum-fourier-transform',
        name: 'Quantum Fourier Transform',
        subtitle: 'Exponentially Faster Fourier Analysis',
        description: 'Computes the Discrete Fourier Transform of quantum amplitudes in O(n²) gate operations vs O(N log N) classical FFT.',
        purpose: 'Exponentially fast Fourier transform on quantum states',
        category: 'Arithmetic & Fourier',
        difficulty: Difficulty.Advanced,
        inventor: 'Peter Shor',
        year: 1994,
        speedupType: 'Exponential',
        classicalComplexity: 'O(N log N)',
        quantumComplexity: 'O(n²) = O(log²N)',
        overview: 'QFT applies the DFT to quantum state amplitudes, enabling exponential speedup as a subroutine in Shor\'s factoring algorithm.',
        mathFormalism: 'QFT|j⟩ = (1/√N) Σ e^(2πijk/N)|k⟩',
        stepsExplanation: [
          { stepNumber: 1, title: 'Hadamard', description: 'Apply H to most significant qubit.' },
          { stepNumber: 2, title: 'Controlled Rotations', description: 'Apply controlled phase rotations Rk = diag(1, e^(2πi/2^k)).' },
          { stepNumber: 3, title: 'Recurse', description: 'Repeat on remaining qubits.' },
          { stepNumber: 4, title: 'Bit Reversal', description: 'Apply SWAP gates to reverse qubit ordering.' },
        ],
        realWorldApplications: [
          'Quantum phase estimation',
          "Shor's factoring algorithm",
          'Quantum signal processing',
          'HHL linear systems algorithm',
        ],
        defaultPresetId: 'qft',
      },
    }),
    prisma.algorithm.upsert({
      where: { slug: 'bernstein-vazirani' },
      update: {},
      create: {
        slug: 'bernstein-vazirani',
        name: 'Bernstein-Vazirani Algorithm',
        subtitle: 'Find Hidden Bitstring in One Query',
        description: 'Recovers a hidden n-bit string s in a single oracle query, compared to n classical queries.',
        purpose: 'Recover hidden bitstring with exponential query speedup',
        category: 'Oracular',
        difficulty: Difficulty.Intermediate,
        inventor: 'Ethan Bernstein & Umesh Vazirani',
        year: 1993,
        speedupType: 'Exponential',
        classicalComplexity: 'O(n)',
        quantumComplexity: 'O(1)',
        overview: 'The BV algorithm recovers an n-bit string s from a linear function f(x) = s·x (mod 2) in one quantum query.',
        mathFormalism: 'H^⊗n · U_f · H^⊗n |0⟩^n → |s⟩',
        stepsExplanation: [
          { stepNumber: 1, title: 'Superposition', description: 'Apply H to all n query qubits.' },
          { stepNumber: 2, title: 'Oracle', description: 'Query oracle Uf encoding f(x) = s·x.' },
          { stepNumber: 3, title: 'Interference', description: 'Apply H again for constructive/destructive interference.' },
          { stepNumber: 4, title: 'Measure', description: 'Measure to read out the hidden string s directly.' },
        ],
        realWorldApplications: [
          'Quantum oracle complexity',
          'Quantum machine learning primitives',
          'Hidden linear structure problems',
          'Quantum sampling',
        ],
        defaultPresetId: 'grover',
      },
    }),
    prisma.algorithm.upsert({
      where: { slug: 'shors-algorithm' },
      update: {},
      create: {
        slug: 'shors-algorithm',
        name: "Shor's Algorithm",
        subtitle: 'Integer Factorization with Exponential Speedup',
        description: 'Factorizes large integers in polynomial time, breaking RSA encryption that requires exponential classical resources.',
        purpose: 'Integer factorization breaking RSA public-key cryptography',
        category: 'Arithmetic & Fourier',
        difficulty: Difficulty.Advanced,
        inventor: 'Peter Shor',
        year: 1994,
        speedupType: 'Exponential',
        classicalComplexity: 'O(e^(n^(1/3)))',
        quantumComplexity: 'O(n³)',
        overview: "Shor's algorithm efficiently finds the prime factors of large integers using QFT-based period finding, threatening RSA cryptography.",
        mathFormalism: 'Order finding via QFT: r = period of a^x mod N',
        stepsExplanation: [
          { stepNumber: 1, title: 'Classical Preprocessing', description: 'Choose random a < N and check gcd(a,N).' },
          { stepNumber: 2, title: 'Quantum Superposition', description: 'Create uniform superposition of all x values.' },
          { stepNumber: 3, title: 'Modular Exponentiation', description: 'Compute f(x) = a^x mod N.' },
          { stepNumber: 4, title: 'QFT', description: 'Apply QFT to extract period r.' },
          { stepNumber: 5, title: 'Classical Post-Processing', description: 'Use r to compute gcd(a^(r/2)±1, N) to find factors.' },
        ],
        realWorldApplications: [
          'Breaking RSA encryption',
          'Cryptanalysis',
          'Motivation for post-quantum cryptography',
          'Integer factorization research',
        ],
        defaultPresetId: 'qft',
      },
    }),
  ]);

  console.log(`✅ Created ${algorithms.length} algorithms`);

  // ─── CHALLENGES ───────────────────────────────────────────────────────────

  const challenges = await Promise.all([
    prisma.challenge.upsert({
      where: { slug: 'create-bell-state' },
      update: {},
      create: {
        slug: 'create-bell-state',
        title: 'Construct the Bell State |Φ+⟩',
        description: 'Construct the canonical 2-qubit entangled Bell State (|00⟩ + |11⟩)/√2 from the ground state |00⟩.',
        category: 'Entanglement',
        difficulty: Difficulty.Beginner,
        xp: 100,
        instructions: [
          'Start with 2 qubits initialized to |00⟩.',
          'Apply a Hadamard (H) gate to qubit q0.',
          'Apply a CNOT gate with control on q0 and target on q1.',
          'Add Measurement (M) gates to both qubits.',
          'Run the simulation and submit to verify 50% |00⟩ and 50% |11⟩ outcomes.',
        ],
        expectedDistribution: { '00': 0.5, '11': 0.5 },
        hints: [
          'The Hadamard gate puts q0 into (|0⟩ + |1⟩)/√2.',
          'The CNOT gate flips q1 whenever q0 is 1, turning the |10⟩ component into |11⟩.',
        ],
        targetQubits: 2,
      },
    }),
    prisma.challenge.upsert({
      where: { slug: 'swap-with-cnots' },
      update: {},
      create: {
        slug: 'swap-with-cnots',
        title: 'SWAP Two Qubits Using 3 CNOT Gates',
        description: 'Implement a complete SWAP operation between q0 and q1 using ONLY 3 CNOT gates (without using the native SWAP gate).',
        category: 'Circuits',
        difficulty: Difficulty.Intermediate,
        xp: 150,
        instructions: [
          'Start with 2 qubits. Initialize q0 in |1⟩ using an X gate.',
          'Use exactly 3 CNOT gates with alternating control/target orientations.',
          'The target result should transform |10⟩ into |01⟩.',
        ],
        expectedDistribution: { '01': 1.0 },
        hints: [
          'The standard CNOT swap identity is: CNOT(0→1), CNOT(1→0), CNOT(0→1).',
          'Make sure you initialize q0 to |1⟩ with an X gate.',
        ],
        targetQubits: 2,
      },
    }),
    prisma.challenge.upsert({
      where: { slug: 'create-ghz-state' },
      update: {},
      create: {
        slug: 'create-ghz-state',
        title: 'Synthesize the 3-Qubit GHZ State',
        description: 'Construct the Greenberger–Horne–Zeilinger tripartite maximally entangled state (|000⟩ + |111⟩)/√2.',
        category: 'Entanglement',
        difficulty: Difficulty.Intermediate,
        xp: 200,
        instructions: [
          'Use 3 qubits.',
          'Apply a Hadamard gate to q0.',
          'Cascade CNOT gates from q0 to q1, and from q1 to q2.',
          'Measure all three qubits.',
        ],
        expectedDistribution: { '000': 0.5, '111': 0.5 },
        hints: [
          'The first CNOT entangles q0 and q1 into (|00⟩ + |11⟩)/√2.',
          'The second CNOT with control q1 and target q2 entangles the third qubit.',
        ],
        targetQubits: 3,
      },
    }),
    prisma.challenge.upsert({
      where: { slug: 'deutsch-balanced-oracle' },
      update: {},
      create: {
        slug: 'deutsch-balanced-oracle',
        title: "Implement Deutsch's Algorithm (Balanced Oracle)",
        description: "Construct Deutsch's algorithm with a balanced oracle to determine whether the function is balanced in 1 query.",
        category: 'Algorithms',
        difficulty: Difficulty.Advanced,
        xp: 250,
        instructions: [
          'Initialize q0 in |0⟩ and ancilla q1 in |1⟩ (using an X gate on q1).',
          'Apply Hadamard to both q0 and q1.',
          'Insert a balanced oracle (CNOT with control q0 and target q1).',
          'Apply a Hadamard gate to q0.',
          'Measure q0. For a balanced function, measuring q0 must yield |1⟩ with 100% certainty!',
        ],
        expectedDistribution: { '11': 0.5, '10': 0.5 },
        hints: [
          'The ancilla qubit q1 must be in state |-⟩ = (|0⟩ - |1⟩)/√2 before the oracle.',
          'Phase kickback from the oracle flips the relative phase of q0.',
        ],
        targetQubits: 2,
      },
    }),
  ]);

  console.log(`✅ Created ${challenges.length} challenges`);
  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
