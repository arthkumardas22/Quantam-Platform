import { Lesson, QuantumAlgorithm } from '@/types/learning';

export const LESSONS: Lesson[] = [
  {
    id: 'lesson_1',
    slug: 'qubits-and-superposition',
    title: 'Qubits & The Power of Superposition',
    subtitle: 'Step into the quantum realm: from binary classical bits to continuous quantum superpositions.',
    category: 'Fundamentals',
    difficulty: 'Beginner',
    durationMinutes: 15,
    xpReward: 100,
    description: 'Learn how a qubit differs from a classical bit, explore state vectors, the Bloch Sphere, and understand how the Hadamard gate enables quantum parallelism.',
    prerequisites: ['Basic linear algebra', 'Complex numbers overview'],
    totalSteps: 4,
    steps: [
      {
        id: 'step_1_1',
        title: 'From Classical Bits to Quantum Qubits',
        conceptSummary: 'A classical bit is strictly 0 or 1. A qubit exists as a linear combination |ψ⟩ = α|0⟩ + β|1⟩.',
        explanationMarkdown: `In classical computing, a bit is like a light switch—it is either strictly OFF (\`0\`) or strictly ON (\`1\`).

In quantum computing, the fundamental unit of information is the **qubit** (quantum bit). A qubit is a two-level quantum mechanical system described by a state vector in a two-dimensional Hilbert space:

$$|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$$

Where $\\alpha$ and $\\beta$ are **complex probability amplitudes**. The probability of measuring the state $|0\\rangle$ is $|\alpha|^2$, and the probability of measuring $|1\\rangle$ is $|\beta|^2$.`,
        mathFormula: '|\\alpha|^2 + |\\beta|^2 = 1',
        keyTakeaway: 'The total probability of all measurement outcomes must always equal 1 (Normalization condition).',
        quiz: {
          question: 'If a qubit is in state |ψ⟩ = (1/√2)|0⟩ + (1/√2)|1⟩, what is the probability of measuring |1⟩?',
          options: ['25%', '50%', '70.7%', '100%'],
          correctIndex: 1,
          explanation: 'The probability is |1/√2|² = 1/2 = 50%. This is the equal superposition state |+⟩.',
        },
      },
      {
        id: 'step_1_2',
        title: 'The Hadamard Gate: Creating Superposition',
        conceptSummary: 'The Hadamard (H) gate transforms deterministic basis states into equal superpositions.',
        explanationMarkdown: `The **Hadamard gate** ($H$) is the most frequently used single-qubit gate. It maps the computational basis states $|0\\rangle$ and $|1\\rangle$ into two orthogonal superposition states:

$$H|0\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}} = |+\\rangle$$
$$H|1\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}} = |-\\rangle$$

Applying $H$ to $N$ qubits initialized in $|0\\rangle$ puts the entire $N$-qubit register into a uniform superposition of all $2^N$ possible states simultaneously with equal amplitude $1/\\sqrt{2^N}$.`,
        mathFormula: 'H = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}',
        keyTakeaway: 'Hadamard is self-inverse: applying H twice in a row returns the qubit back to its original state (H · H = I).',
        circuitSnippet: {
          qubits: 1,
          gates: [{ type: 'H', targetQubit: 0, column: 0 }],
        },
        quiz: {
          question: 'What is the outcome of applying two consecutive Hadamard gates to |0⟩ (i.e. H · H |0⟩)?',
          options: ['|1⟩', '|0⟩', '50% |0⟩ and 50% |1⟩', 'Undefined state'],
          correctIndex: 1,
          explanation: 'Since H is its own inverse (H² = I), H(H|0⟩) = I|0⟩ = |0⟩.',
        },
      },
      {
        id: 'step_1_3',
        title: 'Visualizing with the 3D Bloch Sphere',
        conceptSummary: 'Any single pure qubit state maps to a unique 3D point on the surface of the Bloch sphere.',
        explanationMarkdown: `Because of normalization and global phase invariance, any single-qubit state can be written in spherical coordinates:

$$|\\psi\\rangle = \\cos\\left(\\frac{\\theta}{2}\\right)|0\\rangle + e^{i\\phi}\\sin\\left(\\frac{\\theta}{2}\\right)|1\\rangle$$

- **$\\theta$ (polar angle, $0 \\le \\theta \\le \\pi$):** Determines the relative probability of $|0\\rangle$ vs $|1\\rangle$.
- **$\\phi$ (azimuthal angle, $0 \\le \\phi < 2\\pi$):** Determines the quantum relative phase between $|0\\rangle$ and $|1\\rangle$.`,
        mathFormula: '\\vec{r} = (\\sin\\theta\\cos\\phi, \\sin\\theta\\sin\\phi, \\cos\\theta)',
        keyTakeaway: 'The North Pole represents |0⟩, the South Pole represents |1⟩, and the Equator contains all equal superpositions.',
      },
      {
        id: 'step_1_4',
        title: 'Wavefunction Collapse (The Born Rule)',
        conceptSummary: 'Measurement forces the quantum state to randomly collapse to a single classical outcome.',
        explanationMarkdown: `When a quantum computer interacts with a classical measurement device, the continuous superposition collapses instantaneously and irreversibly to one of the eigenstates of the measurement observable.

Once measured, subsequent measurements in the same basis will return the exact same result with 100% certainty. Quantum algorithms must use **interference** before measurement so that the amplitude of the desired answer is amplified!`,
        mathFormula: 'P(x) = |\\langle x | \\psi \\rangle|^2',
        keyTakeaway: 'Quantum speedups occur by manipulating amplitudes BEFORE measurement, not by simply reading out superposition.',
      },
    ],
  },
  {
    id: 'lesson_2',
    slug: 'quantum-logic-gates',
    title: 'Single-Qubit Pauli & Phase Rotations',
    subtitle: 'Master the fundamental gate rotations: X, Y, Z, S, T, and arbitrary Rx, Ry, Rz rotations.',
    category: 'Circuits',
    difficulty: 'Beginner',
    durationMinutes: 20,
    xpReward: 120,
    description: 'Explore how quantum logic gates act as 3D rotations on the Bloch Sphere and learn how phase manipulation works.',
    prerequisites: ['Qubits & Superposition'],
    totalSteps: 3,
    steps: [
      {
        id: 'step_2_1',
        title: 'The Pauli-X, Y, and Z Gates',
        conceptSummary: 'Pauli matrices represent 180° (π radian) rotations about the X, Y, and Z axes.',
        explanationMarkdown: `- **Pauli-X (NOT Gate):** Flips $|0\\rangle \\leftrightarrow |1\\rangle$. Rotation by $\\pi$ around the X-axis.
- **Pauli-Z (Phase Flip Gate):** Leaves $|0\\rangle$ unchanged, maps $|1\\rangle \\rightarrow -|1\\rangle$. Rotation by $\\pi$ around the Z-axis.
- **Pauli-Y (Bit & Phase Flip):** Rotates by $\\pi$ around the Y-axis: $Y = iXZ$.`,
        mathFormula: 'X = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix},\\quad Z = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}',
        keyTakeaway: 'The Pauli-Z gate changes the relative phase without altering measurement probabilities in the Z-basis!',
        circuitSnippet: {
          qubits: 1,
          gates: [
            { type: 'H', targetQubit: 0, column: 0 },
            { type: 'Z', targetQubit: 0, column: 1 },
          ],
        },
      },
      {
        id: 'step_2_2',
        title: 'The S and T Phase Gates',
        conceptSummary: 'The S gate is a π/2 phase rotation (√Z), and the T gate is a π/4 phase rotation (fourth root of Z).',
        explanationMarkdown: `Phase gates adjust the relative phase $\\phi$ on the Bloch sphere equator:

- **S Gate ($Z^{1/2}$):** Adds a phase of $e^{i\\pi/2} = i$ to the $|1\\rangle$ component.
- **T Gate ($Z^{1/4}$):** Adds a phase of $e^{i\\pi/4} = \\frac{1+i}{\\sqrt{2}}$ to the $|1\\rangle$ component.

The set $\\{H, S, CNOT, T\\}$ forms a **universal quantum gate set**, meaning any arbitrary quantum circuit can be approximated to arbitrary precision!`,
        mathFormula: 'S = \\begin{pmatrix} 1 & 0 \\\\ 0 & i \\end{pmatrix},\\quad T = \\begin{pmatrix} 1 & 0 \\\\ 0 & e^{i\\pi/4} \\end{pmatrix}',
        keyTakeaway: 'T gates are the essential non-Clifford ingredient required for fault-tolerant universal quantum computation.',
      },
      {
        id: 'step_2_3',
        title: 'Arbitrary Rotations: Rx(θ), Ry(θ), Rz(θ)',
        conceptSummary: 'Any unitary single-qubit gate can be decomposed into Euler angle rotations.',
        explanationMarkdown: `By applying continuous microwave or laser pulses for precise durations, experimental hardware executes continuous rotations:

$$R_x(\\theta) = \\exp(-i\\theta X / 2) = \\cos(\\theta/2)I - i\\sin(\\theta/2)X$$
$$R_y(\\theta) = \\exp(-i\\theta Y / 2) = \\cos(\\theta/2)I - i\\sin(\\theta/2)Y$$
$$R_z(\\theta) = \\exp(-i\\theta Z / 2) = \\text{diag}(e^{-i\\theta/2}, e^{i\\theta/2})$$`,
        mathFormula: 'U = e^{i\\alpha} R_z(\\beta) R_y(\\gamma) R_z(\\delta)',
        keyTakeaway: 'Continuous parameter gates are the core foundation of Variational Quantum Eigensolvers (VQE) and Quantum Machine Learning.',
      },
    ],
  },
  {
    id: 'lesson_3',
    slug: 'entanglement-and-bell-states',
    title: 'Entanglement & Bell State Synthesis',
    subtitle: 'Discover Einstein’s "spooky action at a distance" and construct non-local multi-qubit states.',
    category: 'Circuits',
    difficulty: 'Intermediate',
    durationMinutes: 25,
    xpReward: 150,
    description: 'Learn how multi-qubit systems work, create the 4 maximally entangled Bell states, and understand quantum correlations.',
    prerequisites: ['Qubits & Superposition', 'Single-Qubit Logic Gates'],
    totalSteps: 3,
    steps: [
      {
        id: 'step_3_1',
        title: 'Multi-Qubit Hilbert Spaces & Tensor Products',
        conceptSummary: 'The state space of N qubits grows exponentially as 2^N dimensions.',
        explanationMarkdown: `When two independent qubits $|\\psi_A\\rangle$ and $|\\psi_B\\rangle$ are combined, their composite state is formed by the **Kronecker tensor product**:

$$|\\psi\\rangle = |\\psi_A\\rangle \\otimes |\\psi_B\\rangle$$

For 2 qubits, the computational basis contains 4 states: $|00\\rangle, |01\\rangle, |10\\rangle, |11\\rangle$.
For 50 qubits, the state vector has $2^{50} \\approx 1.125 \\times 10^{15}$ complex amplitudes—more than the RAM of all standard supercomputers!`,
        mathFormula: '\\dim(\\mathcal{H}_N) = 2^N',
        keyTakeaway: 'Exponential state space is why quantum computers can model molecular systems that classical supercomputers cannot.',
      },
      {
        id: 'step_3_2',
        title: 'The Controlled-NOT (CNOT) Gate',
        conceptSummary: 'CNOT acts on two qubits: flipping the target qubit when the control qubit is |1⟩.',
        explanationMarkdown: `The CNOT gate generates entanglement between previously independent qubits.

If we initialize $|00\\rangle$, apply $H$ to $q_0$, and then apply $CNOT(q_0 \\rightarrow q_1)$:
1. After $H$ on $q_0$: $\\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}} \\otimes |0\\rangle = \\frac{|00\\rangle + |10\\rangle}{\\sqrt{2}}$
2. After $CNOT$: The $|10\\rangle$ term becomes $|11\\rangle$, producing:

$$|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$$

This state CANNOT be factored into $(a|0\\rangle + b|1\\rangle) \\otimes (c|0\\rangle + d|1\\rangle)$. It is **entangled**!`,
        mathFormula: 'CNOT = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ 0 & 0 & 1 & 0 \\end{pmatrix}',
        keyTakeaway: 'In an entangled state, individual qubits do not possess well-defined independent states.',
        circuitSnippet: {
          qubits: 2,
          gates: [
            { type: 'H', targetQubit: 0, column: 0 },
            { type: 'CNOT', targetQubit: 1, controlQubit: 0, column: 1 },
          ],
        },
      },
      {
        id: 'step_3_3',
        title: 'The 4 Canonical Bell States',
        conceptSummary: 'The Bell basis forms a complete orthonormal basis for 2-qubit quantum states.',
        explanationMarkdown: `The four maximally entangled 2-qubit states are:

- $|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$
- $|\\Phi^-\\rangle = \\frac{|00\\rangle - |11\\rangle}{\\sqrt{2}}$
- $|\\Psi^+\\rangle = \\frac{|01\\rangle + |10\\rangle}{\\sqrt{2}}$
- $|\\Psi^-\\rangle = \\frac{|01\\rangle - |10\\rangle}{\\sqrt{2}}$ (Singlet state)

These states are the primary currency for **Quantum Key Distribution (QKD)**, **Quantum Teleportation**, and **Superdense Coding**.`,
        mathFormula: '|\\Psi^\\pm\\rangle = \\frac{|01\\rangle \\pm |10\\rangle}{\\sqrt{2}}',
        keyTakeaway: 'Bell states exhibit correlations that violate Bell inequalities, proving quantum mechanics is non-local.',
      },
    ],
  },
  {
    id: 'lesson_4',
    slug: 'grovers-search-algorithm',
    title: "Grover's Quantum Search Algorithm",
    subtitle: 'Search through N unstructured items in O(√N) queries using amplitude amplification.',
    category: 'Algorithms',
    difficulty: 'Advanced',
    durationMinutes: 30,
    xpReward: 200,
    description: 'Understand how phase inversion oracles and diffusion operators systematically amplify target state probabilities.',
    prerequisites: ['Qubits & Superposition', 'Quantum Logic Gates', 'Entanglement'],
    totalSteps: 4,
    steps: [
      {
        id: 'step_4_1',
        title: 'The Unstructured Search Problem',
        conceptSummary: 'Searching an unsorted database of N items requires O(N) queries classically, but only O(√N) quantumly.',
        explanationMarkdown: `Suppose you have an unsorted database of $N = 2^n$ items, and exactly one item $\\omega$ satisfies a condition $f(\\omega) = 1$.

- **Classical strategy:** Brute force inspection requires on average $N/2$ queries.
- **Grover quantum strategy:** Lov Grover (1996) proved a quantum computer can find $\\omega$ with high probability in $\\approx \\frac{\\pi}{4}\\sqrt{N}$ queries!

For $N = 1,000,000$, classical requires $\\sim 500,000$ operations; Grover requires only $\\sim 785$ queries!`,
        mathFormula: '\\text{Speedup} = \\mathcal{O}(\\sqrt{N})',
        keyTakeaway: 'Grover speedup applies to ANY NP-search problem, including SAT solving and cryptographic brute-forcing.',
      },
      {
        id: 'step_4_2',
        title: 'Step 1: Equal Superposition',
        conceptSummary: 'Initialize all 2^n states with equal amplitude 1/√N.',
        explanationMarkdown: `Apply a Hadamard gate $H^{\\otimes n}$ to all $n$ qubits initialized to $|0\\rangle$:

$$|s\\rangle = \\frac{1}{\\sqrt{N}} \\sum_{x=0}^{N-1} |x\\rangle$$

Every item has identical probability $1/N$.`,
        mathFormula: '|s\\rangle = H^{\\otimes n}|0\\rangle^{\\otimes n}',
        keyTakeaway: 'Quantum parallelism begins by putting every possibility into the computation simultaneously.',
      },
      {
        id: 'step_4_3',
        title: 'Step 2: The Phase Inversion Oracle (U_ω)',
        conceptSummary: 'The oracle selectively flips the phase of the target marked state |ω⟩ to -|ω⟩.',
        explanationMarkdown: `The oracle $U_\\omega$ acts as a reflection operator:

$$U_\\omega |x\\rangle = (-1)^{f(x)} |x\\rangle$$

If $x = \\omega$, $U_\\omega |\\omega\\rangle = -|\\omega\\rangle$. For all other $x \\ne \\omega$, the state remains unchanged.
Notice that the magnitude squared $|-\\alpha|^2 = |\\alpha|^2$ is unchanged; the speedup comes from what happens NEXT!`,
        mathFormula: 'U_\\omega = I - 2|\\omega\\rangle\\langle\\omega|',
        keyTakeaway: 'The oracle marks the correct item by changing its quantum phase, not by measuring it.',
      },
      {
        id: 'step_4_4',
        title: 'Step 3: The Grover Diffusion Operator (Inversion About the Mean)',
        conceptSummary: 'The diffusion operator reflects all amplitudes around the average mean amplitude.',
        explanationMarkdown: `The diffusion operator $U_s = 2|s\\rangle\\langle s| - I$ calculates the average amplitude across all states.

Since the marked item has a negative amplitude, reflecting it about the mean **dramatically increases its positive amplitude**, while slightly decreasing the amplitudes of all non-marked items!

After $\\frac{\\pi}{4}\\sqrt{N}$ iterations, measuring the register yields the target state $|\\omega\\rangle$ with near $100\\%$ probability.`,
        mathFormula: 'U_s = H^{\\otimes n}(2|0\\rangle\\langle 0| - I)H^{\\otimes n}',
        keyTakeaway: 'Amplitude amplification converts phase information into measurable probability through geometric reflections.',
      },
    ],
  },
];

export const QUANTUM_ALGORITHMS: QuantumAlgorithm[] = [
  {
    id: 'grover',
    name: "Grover's Search Algorithm",
    subtitle: 'Quadratic speedup for unstructured database searching',
    category: 'Search',
    difficulty: 'Intermediate',
    inventor: 'Lov Grover',
    year: 1996,
    speedupType: 'Quadratic',
    classicalComplexity: 'O(N)',
    quantumComplexity: 'O(√N)',
    purpose: 'Search an unsorted database of N items in O(√N) queries instead of O(N) classical brute force.',
    overview: "Grover's algorithm is one of the pillars of quantum computing. It utilizes quantum superposition, phase inversion, and amplitude amplification (inversion about the mean) to rotate the state vector toward the desired target state.",
    mathFormalism: 'G = (2|s\\rangle\\langle s| - I)(I - 2|\\omega\\rangle\\langle\\omega|)',
    stepsExplanation: [
      { stepNumber: 1, title: 'State Initialization', description: 'Apply Hadamard gates to all qubits to create uniform superposition |s⟩.' },
      { stepNumber: 2, title: 'Oracle Query', description: 'Apply the phase oracle U_ω to mark the target state by flipping its sign: |ω⟩ → -|ω⟩.' },
      { stepNumber: 3, title: 'Diffusion Operator', description: 'Apply the Grover diffusion transform to invert all amplitudes about the average mean.' },
      { stepNumber: 4, title: 'Measurement', description: 'Measure the register in the computational basis to obtain the target item.' },
    ],
    realWorldApplications: [
      'Accelerating NP-complete problem solvers (3-SAT, Graph Coloring)',
      'Collision attacks and preimage attacks on symmetric cryptography (AES-128 / SHA-256)',
      'Unstructured data mining and pattern discovery',
    ],
    defaultCircuitPresetId: 'grover_2qubit',
  },
  {
    id: 'teleportation',
    name: 'Quantum Teleportation Protocol',
    subtitle: 'Disembodied transmission of quantum state information',
    category: 'Communication',
    difficulty: 'Beginner',
    inventor: 'Bennett, Brassard, Crépeau, Jozsa, Peres, Wootters',
    year: 1993,
    speedupType: 'Communication',
    classicalComplexity: 'Infinite bits (or impossible)',
    quantumComplexity: '2 Classical Bits + 1 EPR Pair',
    purpose: 'Transmit an unknown arbitrary quantum state from Alice to Bob using pre-shared entanglement and 2 classical bits.',
    overview: 'Quantum Teleportation does not violate relativity or the No-Cloning Theorem. Alice performs a Bell-basis measurement on her source qubit and her half of the entangled pair, destroying her local copy. She transmits two classical bits to Bob, who applies conditional Pauli corrections (X and Z) to reconstitute the exact original state.',
    mathFormalism: '|\\psi\\rangle \\otimes |\\Phi^+\\rangle = \\frac{1}{2} \\sum_{i=1}^4 |\\text{Bell}_i\\rangle \\otimes (U_i |\\psi\\rangle)',
    stepsExplanation: [
      { stepNumber: 1, title: 'EPR Pair Distribution', description: 'Generate a shared Bell pair |Φ+⟩ between Alice (q1) and Bob (q2).' },
      { stepNumber: 2, title: 'Alice’s Bell Measurement', description: 'Alice entangles her unknown state (q0) with q1 via CNOT and H, then measures both in computational basis.' },
      { stepNumber: 3, title: 'Classical Communication', description: 'Alice sends the 2 classical measurement outcomes (m0, m1) to Bob.' },
      { stepNumber: 4, title: 'Bob’s Unitary Recovery', description: 'Bob applies Pauli X^m1 and Z^m0 to his qubit q2, reconstructing |ψ⟩ with 100% fidelity.' },
    ],
    realWorldApplications: [
      'Quantum Internet and distributed quantum computing networks',
      'Quantum repeater stations for long-distance optical fiber transmission',
      'Fault-tolerant quantum logic gate teleportation',
    ],
    defaultCircuitPresetId: 'quantum_teleportation',
  },
  {
    id: 'deutsch-jozsa',
    name: 'Deutsch-Jozsa Algorithm',
    subtitle: 'First proof of deterministic exponential quantum advantage',
    category: 'Oracular',
    difficulty: 'Beginner',
    inventor: 'David Deutsch & Richard Jozsa',
    year: 1992,
    speedupType: 'Exponential',
    classicalComplexity: 'O(2^(N-1) + 1)',
    quantumComplexity: 'O(1) [Single Query!]',
    purpose: 'Determine with 100% deterministic certainty whether an unknown Boolean function f(x) is constant or balanced in 1 query.',
    overview: 'A function f: {0,1}^n → {0,1} is promised to be either constant (returns all 0s or all 1s) or balanced (returns 0 for half of inputs and 1 for the other half). Classically, in the worst case one must test 2^(n-1)+1 inputs. Deutsch-Jozsa solves this with a SINGLE quantum query using constructive and destructive interference.',
    mathFormalism: '|\\psi_f\\rangle = \\frac{1}{2^n} \\sum_{x=0}^{2^n-1} \\sum_{y=0}^{2^n-1} (-1)^{x \\cdot y + f(x)} |y\\rangle',
    stepsExplanation: [
      { stepNumber: 1, title: 'Dual Superposition', description: 'Initialize input register in |0...0⟩ and ancilla qubit in |1⟩. Apply Hadamard to all.' },
      { stepNumber: 2, title: 'Phase Kickback Oracle', description: 'Evaluate U_f: the ancilla in state |-⟩ causes phase kickback (-1)^f(x) onto the input register.' },
      { stepNumber: 3, title: 'Interference via Hadamard', description: 'Apply Hadamard to the input register. Constant function yields constructive interference at |0...0⟩; balanced function gives 0 amplitude at |0...0⟩.' },
      { stepNumber: 4, title: 'Measurement', description: 'If measured |0...0⟩ → Constant. If any bit is 1 → Balanced.' },
    ],
    realWorldApplications: [
      'Historical milestone proving quantum computational supremacy',
      'Fundamental prototype for phase kickback in Bernstein-Vazirani & Simon’s algorithm',
    ],
    defaultCircuitPresetId: 'deutsch_jozsa',
  },
  {
    id: 'qft',
    name: 'Quantum Fourier Transform (QFT)',
    subtitle: 'Quantum analogue of the discrete Fourier transform',
    category: 'Arithmetic & Fourier',
    difficulty: 'Advanced',
    inventor: 'Don Coppersmith',
    year: 1994,
    speedupType: 'Exponential',
    classicalComplexity: 'O(N log N) via FFT',
    quantumComplexity: 'O((log N)²) = O(n²)',
    purpose: 'Map amplitudes from computational basis to frequency phase basis exponentially faster than classical FFT.',
    overview: 'The Quantum Fourier Transform transforms a quantum state |j⟩ into a superposition of phase states. It operates on 2^n amplitudes using only O(n^2) quantum gates, providing an exponential speedup over classical Fast Fourier Transform. It is the key computational engine inside Shor’s factoring algorithm and Quantum Phase Estimation (QPE).',
    mathFormalism: '\\text{QFT}|j\\rangle = \\frac{1}{\\sqrt{N}} \\sum_{k=0}^{N-1} e^{2\\pi i j k / N} |k\\rangle',
    stepsExplanation: [
      { stepNumber: 1, title: 'Hadamard on MSB', description: 'Apply Hadamard gate to the most significant qubit.' },
      { stepNumber: 2, title: 'Controlled Phase Rotations', description: 'Apply controlled R_k rotations from lower qubits to encode binary fraction phases.' },
      { stepNumber: 3, title: 'Recursive Cascade', description: 'Repeat Hadamard and controlled rotations for all subsequent qubits.' },
      { stepNumber: 4, title: 'Qubit Order Reversal', description: 'Apply SWAP gates to reverse qubit order into standard endianness.' },
    ],
    realWorldApplications: [
      'Shor’s integer factorization algorithm',
      'Quantum Phase Estimation (QPE) for quantum chemistry Hamiltonian simulation',
      'Period finding and discrete logarithm computation',
    ],
    defaultCircuitPresetId: 'qft_3qubit',
  },
  {
    id: 'shor',
    name: "Shor's Factoring Algorithm",
    subtitle: 'Polynomial-time prime factorization breaking RSA encryption',
    category: 'Arithmetic & Fourier',
    difficulty: 'Advanced',
    inventor: 'Peter Shor',
    year: 1994,
    speedupType: 'Exponential',
    classicalComplexity: 'exp(O(∛(n log² n))) [General Number Field Sieve]',
    quantumComplexity: 'O(n³)',
    purpose: 'Factor large composite integers N = p × q in polynomial time, breaking RSA public-key cryptography.',
    overview: "Shor's algorithm reduces the integer factorization problem to finding the period r of the modular exponential function f(x) = a^x mod N. Finding periods is hard classically, but the Quantum Fourier Transform finds period r in polynomial time O((log N)^3).",
    mathFormalism: 'a^r \\equiv 1 \\pmod N \\implies (a^{r/2} - 1)(a^{r/2} + 1) = k N',
    stepsExplanation: [
      { stepNumber: 1, title: 'Classical Reduction', description: 'Pick random integer a < N. If gcd(a, N) > 1, factor is already found.' },
      { stepNumber: 2, title: 'Quantum Superposition & Modular Exponentiation', description: 'Create superposition of inputs and compute |x⟩|a^x mod N⟩ in quantum registers.' },
      { stepNumber: 3, title: 'Inverse Quantum Fourier Transform', description: 'Apply QFT† to extract the period r encoded in the phase interference.' },
      { stepNumber: 4, title: 'Classical GCD Extraction', description: 'Compute gcd(a^(r/2) ± 1, N) classically using Euclidean algorithm to obtain prime factors p and q.' },
    ],
    realWorldApplications: [
      'Cryptanalysis of RSA, Diffie-Hellman, and Elliptic Curve Cryptography (ECC)',
      'Catalyst for global transition to Post-Quantum Cryptography (NIST PQC standards: Kyber, Dilithium)',
    ],
    defaultCircuitPresetId: 'qft_3qubit',
  },
  {
    id: 'superdense-coding',
    name: 'Superdense Coding Protocol',
    subtitle: 'Transmit two classical bits using a single entangled qubit',
    category: 'Communication',
    difficulty: 'Beginner',
    inventor: 'Charles Bennett & Stephen Wiesner',
    year: 1992,
    speedupType: 'Communication',
    classicalComplexity: '2 physical bits required',
    quantumComplexity: '1 qubit + pre-shared Bell pair',
    purpose: 'Double classical communication channel capacity by transmitting 2 classical bits through 1 physical qubit transmission.',
    overview: 'Alice and Bob share an entangled Bell pair |Φ+⟩. Alice applies one of four local unitary transformations {I, X, Z, XZ} to her qubit depending on whether she wants to send 00, 01, 10, or 11. She sends her single qubit to Bob, who performs a Bell measurement to recover both classical bits perfectly.',
    mathFormalism: '(I \\otimes I)|\\Phi^+\\rangle = |\\Phi^+\\rangle,\\quad (X \\otimes I)|\\Phi^+\\rangle = |\\Psi^+\\rangle,\\quad (Z \\otimes I)|\\Phi^+\\rangle = |\\Phi^-\\rangle',
    stepsExplanation: [
      { stepNumber: 1, title: 'Bell State Sharing', description: 'Create entangled pair (|00⟩ + |11⟩)/√2. Alice takes q0, Bob takes q1.' },
      { stepNumber: 2, title: 'Alice’s Local Encoding', description: 'To send 00: I, to send 01: X, to send 10: Z, to send 11: ZX.' },
      { stepNumber: 3, title: 'Qubit Transmission', description: 'Alice transmits her single qubit q0 across the quantum channel to Bob.' },
      { stepNumber: 4, title: 'Bob’s Bell Decoding', description: 'Bob applies CNOT and H to disentangle the pair and measures both in standard basis.' },
    ],
    realWorldApplications: [
      'High-throughput quantum satellite communication protocols',
      'Bandwidth compression in quantum network links',
    ],
    defaultCircuitPresetId: 'superdense_coding',
  },
];
