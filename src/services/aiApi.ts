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
  // Try backend endpoint first
  try {
    const res = await fetch('http://127.0.0.1:5000/api/ai/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ circuit }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data) return data.data;
    }
  } catch {}

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

  const nonZeroAmplitudes = stateVector.amplitudes.filter((a) => a.probability > 0.01);
  const hasSuperposition = nonZeroAmplitudes.length > 1;

  let isEntangled = false;
  if (circuit.numQubits >= 2 && hasCNOT) {
    const keys = Object.keys(probabilities);
    if (keys.length === 2 && ((keys.includes('00') && keys.includes('11')) || (keys.includes('01') && keys.includes('10')))) {
      isEntangled = true;
    } else if (keys.length === 2 && ((keys.includes('000') && keys.includes('111')))) {
      isEntangled = true;
    }
  }

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
  circuit?: CircuitState,
  chatHistory: ChatMessage[] = [],
  modelPreference: string = 'gemini-1.5-flash',
  customApiKey?: string
): Promise<string> {
  // Call backend AI proxy
  try {
    const res = await fetch('http://127.0.0.1:5000/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: prompt,
        circuit,
        history: chatHistory.map((m) => ({ role: m.role, content: m.content })),
        modelPreference,
        apiKey: customApiKey,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data?.data?.message) return data.data.message;
    }
  } catch {}

  // Fallback intelligent quantum reasoner
  const lower = prompt.toLowerCase();
  const numGates = circuit?.gates?.length || 0;

  if (lower.includes('hadamard') || lower.includes('what is h')) {
    return `### ⚡ The Hadamard Gate ($H$)\n\nThe **Hadamard gate** transforms computational basis states into symmetric superpositions:\n\n$$H|0\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}} = |+\\rangle$$\n$$H|1\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}} = |-\\rangle$$\n\n**Unitary Matrix Representation:**\n$$H = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$$\n\n**Key Characteristics:**\n1. **Involutory (Self-Inverse):** $H \\cdot H = I$.\n2. **Bloch Equator:** Rotates state $|0\\rangle$ directly to the $+X$ equator axis.\n3. **Python Qiskit:** \`qc.h(0)\``;
  }

  if (lower.includes('cnot') || lower.includes('cx') || lower.includes('entangle')) {
    return `### 🔗 Controlled-NOT ($CNOT$ / $CX$)\n\nThe **CNOT gate** is a 2-qubit entangling gate that flips target qubit if and only if control qubit is $|1\\rangle$.\n\nWhen combined with a Hadamard gate ($H$ on $q_0$ followed by $CNOT(q_0 \\rightarrow q_1)$), it produces the maximally entangled **Bell State**:\n$$|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$$`;
  }

  if (lower.includes('grover') || lower.includes('search')) {
    return `### 🔍 Grover's Search Algorithm\n\nGrover's algorithm provides a **quadratic quantum speedup** for unstructured database searches:\n\n- **Classical Complexity:** $\\mathcal{O}(N)$\n- **Quantum Complexity:** $\\mathcal{O}(\\sqrt{N})$\n\n**Key Stages:**\n1. Uniform superposition via Hadamard gates.\n2. Phase Oracle ($U_\\omega$) marks target state.\n3. Grover Diffusion Operator ($U_s = 2|s\\rangle\\langle s| - I$) inverts amplitudes around the mean.`;
  }

  return `### ⚛️ Quantum Assistant Response\n\nRegarding: **"${prompt}"**\n\nIn quantum information processing, your current circuit with **${numGates} gate(s)** demonstrates foundational quantum mechanical principles.\n\nQuantum algorithms leverage **superposition**, **phase kickback**, and **wave interference** to solve computational problems faster than classical Turing machines.\n\n**Suggested next steps:**\n- Drag an **H gate** or **CNOT gate** onto the circuit wires.\n- Check the **3D Bloch Sphere** for real-time statevector visual rotations.`;
}
