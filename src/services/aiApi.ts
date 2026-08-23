import { CircuitState } from '@/types/quantum';
import { ChatMessage } from '@/types/learning';
import { simulateCircuit } from './quantumEngine';

export interface CircuitExplanationReport {
  title: string;
  summary: string;
  isEntangled: boolean;
  hasSuperposition: boolean;
  stepByStep: {
    column: number;
    gatesDescription: string;
    physicalEffect: string;
    stateFormula?: string;
  }[];
  theoreticalState: string;
  measurementOutcome: string;
  beginnerTrap: string;
  suggestedExperiments: string[];
}

export async function explainCircuit(circuit: CircuitState): Promise<CircuitExplanationReport> {
  // Artificial realistic processing delay
  await new Promise((resolve) => setTimeout(resolve, 600));

  if (circuit.gates.length === 0) {
    return {
      title: 'Empty Ground State Circuit |0...0⟩',
      summary: 'The circuit currently contains no operational gates. All qubits remain in their classical ground state |0⟩.',
      isEntangled: false,
      hasSuperposition: false,
      stepByStep: [
        {
          column: 0,
          gatesDescription: 'Initial ground state preparation',
          physicalEffect: 'All registers are initialized to |0⟩ with 100% deterministic probability.',
          stateFormula: '|ψ₀⟩ = |0...0⟩',
        },
      ],
      theoreticalState: '|00...0⟩',
      measurementOutcome: '100% chance of reading all zeros upon computational basis measurement.',
      beginnerTrap: 'Remember that before applying any quantum gate, hardware qubits always start in the ground state |0⟩.',
      suggestedExperiments: [
        'Place a Hadamard (H) gate on qubit q0 to generate a 50/50 superposition.',
        'Add a CNOT gate from q0 to q1 to generate the entangled Bell state |Φ+⟩.',
      ],
    };
  }

  const { stateVector, probabilities } = simulateCircuit(circuit);

  const hasH = circuit.gates.some((g) => g.type === 'H');
  const hasCNOT = circuit.gates.some((g) => g.type === 'CNOT' || g.type === 'CZ');
  const hasMeasure = circuit.gates.some((g) => g.type === 'M');

  // Check if multiple non-zero basis states exist (superposition)
  const nonZeroAmplitudes = stateVector.amplitudes.filter((a) => a.probability > 0.01);
  const hasSuperposition = nonZeroAmplitudes.length > 1;

  // Determine entanglement heuristic: multi-qubit with non-separable states (e.g. 00 and 11 only)
  let isEntangled = false;
  if (circuit.numQubits >= 2 && hasCNOT) {
    const keys = Object.keys(probabilities);
    if (keys.length === 2 && ((keys.includes('00') && keys.includes('11')) || (keys.includes('01') && keys.includes('10')))) {
      isEntangled = true;
    } else if (keys.length === 2 && ((keys.includes('000') && keys.includes('111')))) {
      isEntangled = true;
    }
  }

  // Construct step-by-step breakdown
  const maxCol = Math.max(...circuit.gates.map((g) => g.column), 0);
  const stepByStep = [];

  for (let c = 0; c <= maxCol; c++) {
    const colGates = circuit.gates.filter((g) => g.column === c);
    if (colGates.length === 0) continue;

    const desc = colGates
      .map((g) => {
        if (g.type === 'CNOT') return `CNOT (Control: q${g.controlQubit}, Target: q${g.targetQubit})`;
        if (g.type === 'CZ') return `CZ (Control: q${g.controlQubit}, Target: q${g.targetQubit})`;
        if (g.type === 'SWAP') return `SWAP (q${g.targetQubit} ↔ q${g.swapTargetQubit})`;
        if (g.type === 'CCX') return `Toffoli CCX (q${g.controlQubit}, q${g.secondControlQubit} → q${g.targetQubit})`;
        return `${g.type} on q${g.targetQubit}`;
      })
      .join(', ');

    let effect = '';
    if (colGates.some((g) => g.type === 'H')) {
      effect = 'Rotates qubit state into the equatorial superposition plane (|+⟩ or |-⟩ basis).';
    } else if (colGates.some((g) => g.type === 'CNOT')) {
      effect = 'Conditionally flips target qubit based on control, creating non-local quantum correlations (entanglement).';
    } else if (colGates.some((g) => g.type === 'X')) {
      effect = 'Pauli-X bit-flip rotation: toggles |0⟩ ↔ |1⟩.';
    } else if (colGates.some((g) => g.type === 'Z' || g.type === 'S' || g.type === 'T')) {
      effect = 'Applies relative phase shift without altering individual computational basis probabilities.';
    } else if (colGates.some((g) => g.type === 'M')) {
      effect = 'Projective measurement: collapses the quantum wavefunction into a classical bit string.';
    } else {
      effect = 'Applies unitary transformation to register amplitudes.';
    }

    stepByStep.push({
      column: c + 1,
      gatesDescription: desc,
      physicalEffect: effect,
      stateFormula: `Step ${c + 1} Unitary applied`,
    });
  }

  // Format Dirac notation
  const nonZeroTerms = nonZeroAmplitudes.map((a) => {
    const prob = (a.probability * 100).toFixed(1);
    return `√(${prob}%)|${a.basisState}⟩`;
  });
  const theoreticalState = nonZeroTerms.join(' + ') || '|0...0⟩';

  const measurementOutcome = Object.entries(probabilities)
    .map(([state, prob]) => `|${state}⟩: ${(prob * 100).toFixed(1)}%`)
    .join('  •  ');

  let title = 'Quantum Circuit Analysis';
  let summary = `This circuit operates on ${circuit.numQubits} qubit${circuit.numQubits > 1 ? 's' : ''} across ${circuit.gates.length} gate operations.`;
  if (isEntangled) {
    title = 'Entangled Quantum State Generator';
    summary = `The circuit successfully produces a non-separable entangled quantum state across multiple qubits. Measuring one qubit instantaneously correlates the outcome of the other qubit.`;
  } else if (hasSuperposition) {
    title = 'Quantum Superposition State';
    summary = `The circuit creates coherent superposition across ${nonZeroAmplitudes.length} computational basis states simultaneously through constructive quantum interference.`;
  }

  const beginnerTrap = isEntangled
    ? 'Do NOT confuse quantum entanglement with faster-than-light communication. The No-Communication Theorem guarantees that Alice cannot send information to Bob without a classical channel.'
    : hasH
    ? 'Hadamard creates equal superposition, but phase gates (Z, S, T) alter the relative phase without changing the measurement probabilities unless another Hadamard causes interference!'
    : 'Remember that quantum gates must be reversible (unitary matrices), whereas classical logic gates like AND/OR are generally irreversible and destroy information.';

  return {
    title,
    summary,
    isEntangled,
    hasSuperposition,
    stepByStep,
    theoreticalState: `|ψ⟩ = ${theoreticalState}`,
    measurementOutcome,
    beginnerTrap,
    suggestedExperiments: [
      'Add a Pauli-Z or Phase-S gate to explore how phase changes affect the Bloch sphere.',
      'Place a second Hadamard gate on superposition wires to verify reversible interference: H · H = I.',
      'Change the number of shots from 1024 to 8192 to observe how experimental sampling converges to exact quantum theory.',
    ],
  };
}

export async function askAITutor(
  prompt: string,
  circuit: CircuitState,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  // Artificial realistic AI reasoning delay
  await new Promise((resolve) => setTimeout(resolve, 550));

  const lower = prompt.toLowerCase();
  const numGates = circuit.gates.length;

  if (lower.includes('explain this circuit') || lower.includes('what does this circuit do')) {
    const report = await explainCircuit(circuit);
    return `### 🔬 Circuit Breakdown\n\n**${report.title}**\n\n${report.summary}\n\n**State Vector:**\n\`${report.theoreticalState}\`\n\n**Expected Measurement Outcomes:**\n${report.measurementOutcome}\n\n💡 **Key Quantum Insight:**\n${report.beginnerTrap}`;
  }

  if (lower.includes('hadamard') || lower.includes('why is h used') || lower.includes('what is h')) {
    return `### ⚡ The Hadamard Gate ($H$)\n\nThe **Hadamard gate** is the fundamental building block of quantum parallelism. It transforms classical definite basis states into equal superpositions:\n\n$$H|0\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}} = |+\\rangle$$\n$$H|1\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}} = |-\\rangle$$\n\n**Matrix Representation:**\n$$\\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$$\n\n**Key Characteristics:**\n1. **Self-Inverse / Involutory:** Applying $H$ twice returns the state back to the original: $H \\cdot H = I$.\n2. **Equator on Bloch Sphere:** It rotates the $|0\\rangle$ state on the Z-axis to the $|+\\rangle$ state on the positive X-axis.`;
  }

  if (lower.includes('cnot') || lower.includes('cx') || lower.includes('entangle')) {
    return `### 🔗 Controlled-NOT ($CNOT$ / $CX$)\n\nThe **CNOT gate** is a 2-qubit entangling gate that performs a bit-flip on the target qubit **if and only if** the control qubit is in state $|1\\rangle$.\n\n**Truth Table:**\n- $|00\\rangle \\rightarrow |00\\rangle$\n- $|01\\rangle \\rightarrow |01\\rangle$\n- $|10\\rangle \\rightarrow |11\\rangle$ *(target flipped)*\n- $|11\\rangle \\rightarrow |10\\rangle$ *(target flipped)*\n\nWhen combined with a Hadamard gate ($H$ on $q_0$ followed by $CNOT(q_0 \\rightarrow q_1)$), it produces the maximally entangled **Bell State**:\n$$|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$$\n\nIn this state, neither qubit possesses an independent state; measuring one immediately determines the other!`;
  }

  if (lower.includes('grover') || lower.includes('search')) {
    return `### 🔍 Grover's Search Algorithm\n\nGrover's algorithm provides a **quadratic quantum speedup** for unstructured database searches.\n\n- **Classical Complexity:** $\\mathcal{O}(N)$ brute-force queries\n- **Quantum Complexity:** $\\mathcal{O}(\\sqrt{N})$ queries\n\n**Main Stages:**\n1. **Superposition:** Initialize all qubits in equal superposition with Hadamard gates.\n2. **Oracle ($U_\\omega$):** Inverts the phase of the target marked state: $|x\\rangle \\rightarrow -|x\\rangle$.\n3. **Diffusion Operator ($U_s$):** Inverts all amplitudes around the average mean amplitude, amplifying the probability of the marked state.\n4. **Measurement:** Collapses to the correct answer with near $100\\%$ probability in $\\approx \\frac{\\pi}{4}\\sqrt{N}$ iterations.`;
  }

  if (lower.includes('bloch') || lower.includes('sphere')) {
    return `### 🌐 The Bloch Sphere\n\nThe **Bloch Sphere** is a geometric representation of pure single-qubit states on the surface of a unit sphere:\n\n$$|\\psi\\rangle = \\cos\\left(\\frac{\\theta}{2}\\right)|0\\rangle + e^{i\\phi}\\sin\\left(\\frac{\\theta}{2}\\right)|1\\rangle$$\n\n- **North Pole ($\\theta = 0$):** Ground state $|0\\rangle$\n- **South Pole ($\\theta = \\pi$):** Excited state $|1\\rangle$\n- **Equator ($\\theta = \\pi/2$):** Superposition states (e.g. $|+\\rangle$ at $\\phi=0$, $|-\\rangle$ at $\\phi=\\pi$, $|+i\\rangle$ at $\\phi=\\pi/2$)\n\nTry rotating the 3D Bloch sphere in the right-hand panel of our Quantum Studio!`;
  }

  if (lower.includes('challenge') || lower.includes('quiz') || lower.includes('practice')) {
    return `### 🎯 Quick Quantum Challenge for You!\n\n**Goal: Construct the Bell State $|\\Psi^-\\rangle$**\n\n$$\\frac{|01\\rangle - |10\\rangle}{\\sqrt{2}}$$\n\n**Hints:**\n1. Apply an **X gate** on $q_0$ and an **X gate** on $q_1$ (or start with $|01\\rangle$).\n2. Apply a **Hadamard gate** on $q_0$.\n3. Apply a **CNOT** with control $q_0$ and target $q_1$.\n4. Apply a **Z gate** on $q_0$ to introduce the relative minus sign.\n\nTry building it in the Quantum Studio workspace and check the probability chart!`;
  }

  if (lower.includes('measurement') || lower.includes('collapse') || lower.includes('what happens after')) {
    return `### 💥 Quantum Measurement & Wavefunction Collapse\n\nIn quantum mechanics, measurement according to the **Born Rule** causes the quantum state $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$ to irreversibly collapse into one of the definite computational basis states:\n\n- Outcome $|0\\rangle$ with probability $P(0) = |\\alpha|^2$\n- Outcome $|1\\rangle$ with probability $P(1) = |\\beta|^2$\n\n**Crucial properties:**\n1. The measurement outcome is genuinely probabilistic.\n2. Once measured, all superposition and entanglement information in that basis is lost.\n3. The qubit remains in the collapsed state for any subsequent measurements.`;
  }

  return `### ⚛️ Quantum Assistant Response\n\nRegarding **"${prompt}"**:\n\nIn quantum information processing, your current circuit with **${numGates} gate(s)** demonstrates key quantum computational principles.\n\nQuantum algorithms leverage **superposition** (evaluating combinations of inputs simultaneously), **phase kickback**, and **constructive/destructive interference** to amplify the amplitudes of correct solution states while canceling out incorrect ones.\n\n**Suggested next steps:**\n- Drag an **H gate** or **CNOT gate** to manipulate the quantum state.\n- Switch between **Qiskit Aer**, **Cirq**, and **PennyLane** in the simulation panel.\n- Inspect the **State Vector** tab to see exact complex amplitude phases $\\alpha e^{i\\phi}$.`;
}
