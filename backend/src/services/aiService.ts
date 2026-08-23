import { CircuitState } from '../types';
import { env } from '../config/env';
import { simulateLocally } from './quantumService';

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

export async function explainCircuitService(circuit: CircuitState): Promise<CircuitExplanationReport> {
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

  const { stateVector, probabilities } = simulateLocally(circuit);

  const hasH = circuit.gates.some((g) => g.type === 'H');
  const hasCNOT = circuit.gates.some((g) => g.type === 'CNOT' || g.type === 'CZ');
  const nonZeroAmplitudes = stateVector.amplitudes.filter((a) => a.probability > 0.01);
  const hasSuperposition = nonZeroAmplitudes.length > 1;

  let isEntangled = false;
  if (circuit.numQubits >= 2 && hasCNOT) {
    const keys = Object.keys(probabilities);
    if (
      keys.length === 2 &&
      ((keys.includes('00') && keys.includes('11')) || (keys.includes('01') && keys.includes('10')))
    ) {
      isEntangled = true;
    } else if (keys.length === 2 && keys.includes('000') && keys.includes('111')) {
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
    summary = `The circuit produces a non-separable entangled quantum state across multiple qubits. Measuring one qubit instantaneously correlates the outcome of the other qubit.`;
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

export async function askAITutorService(
  prompt: string,
  circuit?: CircuitState,
  history: Array<{ role: string; content: string }> = []
): Promise<string> {
  // If Gemini API is configured, call external LLM
  if (env.AI_PROVIDER === 'gemini' && env.AI_API_KEY) {
    try {
      const systemInstruction =
        'You are an expert Quantum Computing AI Tutor on QuantamStudio_Bigslayers. Provide clear, mathematically rigorous, beginner-friendly explanations with Dirac notation and matrix representations.';

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${env.AI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${systemInstruction}\n\nCurrent Circuit Context: ${JSON.stringify(circuit || {})}\n\nUser Question: ${prompt}`,
                  },
                ],
              },
            ],
          }),
        }
      );

      if (response.ok) {
        const data = (await response.json()) as any;
        const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (answer) return answer;
      }
    } catch {
      // Fall through to heuristic tutor
    }
  }

  // Intelligent Heuristic Quantum Tutor Reasoning Fallback
  const lower = prompt.toLowerCase();
  const numGates = circuit?.gates?.length || 0;

  if (lower.includes('explain this circuit') || lower.includes('what does this circuit do')) {
    if (circuit) {
      const report = await explainCircuitService(circuit);
      return `### 🔬 Circuit Breakdown\n\n**${report.title}**\n\n${report.summary}\n\n**State Vector:**\n\`${report.theoreticalState}\`\n\n**Expected Measurement Outcomes:**\n${report.measurementOutcome}\n\n💡 **Key Quantum Insight:**\n${report.beginnerTrap}`;
    }
  }

  if (lower.includes('hadamard') || lower.includes('why is h used') || lower.includes('what is h')) {
    return `### ⚡ The Hadamard Gate ($H$)\n\nThe **Hadamard gate** transforms classical basis states into equal superpositions:\n\n$$H|0\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}} = |+\\rangle$$\n$$H|1\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}} = |-\\rangle$$\n\n**Matrix Representation:**\n$$\\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$$\n\n**Key Characteristics:**\n1. **Self-Inverse / Involutory:** $H \\cdot H = I$.\n2. **Equator on Bloch Sphere:** Rotates $|0\\rangle$ to $|+\\rangle$ on the X-axis.`;
  }

  if (lower.includes('cnot') || lower.includes('cx') || lower.includes('entangle')) {
    return `### 🔗 Controlled-NOT ($CNOT$ / $CX$)\n\nThe **CNOT gate** is a 2-qubit entangling gate that flips target qubit **if and only if** control qubit is $|1\\rangle$.\n\nWhen combined with a Hadamard gate ($H$ on $q_0$ followed by $CNOT(q_0 \\rightarrow q_1)$), it creates the maximally entangled **Bell State**:\n$$|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$$`;
  }

  if (lower.includes('grover') || lower.includes('search')) {
    return `### 🔍 Grover's Search Algorithm\n\nGrover's algorithm provides a **quadratic quantum speedup** for unstructured database searches:\n\n- **Classical Complexity:** $\\mathcal{O}(N)$\n- **Quantum Complexity:** $\\mathcal{O}(\\sqrt{N})$\n\n**Key Stages:**\n1. Superposition initialization via Hadamard gates.\n2. Phase Oracle ($U_\\omega$) marks target state.\n3. Grover Diffusion Operator ($U_s = 2|s\\rangle\\langle s| - I$) inverts amplitudes around the mean.`;
  }

  if (lower.includes('bloch') || lower.includes('sphere')) {
    return `### 🌐 The Bloch Sphere\n\nThe **Bloch Sphere** maps single-qubit pure states onto the surface of a unit sphere:\n\n$$|\\psi\\rangle = \\cos\\left(\\frac{\\theta}{2}\\right)|0\\rangle + e^{i\\phi}\\sin\\left(\\frac{\\theta}{2}\\right)|1\\rangle$$\n\n- **North Pole ($\\theta = 0$):** $|0\\rangle$\n- **South Pole ($\\theta = \\pi$):** $|1\\rangle$\n- **Equator ($\\theta = \\pi/2$):** $|+\\rangle, |-\\rangle, |+i\\rangle, |-i\\rangle$`;
  }

  return `### ⚛️ Quantum Assistant Response\n\nRegarding **"${prompt}"**:\n\nIn quantum information processing, your current circuit with **${numGates} gate(s)** demonstrates foundational quantum computational principles.\n\nQuantum algorithms leverage **superposition**, **phase kickback**, and **constructive/destructive interference** to amplify target measurement outcomes.\n\n**Suggested next steps:**\n- Place an **H gate** or **CNOT gate** on the circuit wire.\n- Open the **3D Bloch Sphere** to visualize pure state rotations.\n- Check the **State Vector** tab for exact complex amplitudes $\\alpha + i\\beta$.`;
}
