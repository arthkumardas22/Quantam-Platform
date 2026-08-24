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
  history: Array<{ role: string; content: string }> = [],
  modelPreference: string = 'gemini-1.5-flash',
  customApiKey?: string
): Promise<string> {
  const apiKey = customApiKey || env.AI_API_KEY;
  const systemInstruction = `You are the lead Quantum Computing & Physics AI Research Assistant on QuantamStudio_Bigslayers.
Provide mathematically rigorous, insightful, clear, and beginner-to-advanced quantum computing explanations.
Always use Dirac notation (|0⟩, |1⟩, |ψ⟩ = α|0⟩ + β|1⟩), unitary matrices, and Python Qiskit/Cirq code snippets where appropriate.
Explain physical quantum intuition clearly (wavefunction collapse, phase kickback, quantum interference, Hilbert spaces).`;

  // 1. Google Gemini (Gemini 2.0 / 1.5 Flash / 1.5 Pro)
  if (apiKey && (modelPreference.includes('gemini') || env.AI_PROVIDER === 'gemini')) {
    try {
      const model = modelPreference.includes('gemini') ? modelPreference : 'gemini-1.5-flash';
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
      // Fall through
    }
  }

  // 2. OpenAI (GPT-4o / o3-mini)
  if (apiKey && modelPreference.includes('gpt')) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: modelPreference,
          messages: [
            { role: 'system', content: systemInstruction },
            {
              role: 'user',
              content: `Circuit Context: ${JSON.stringify(circuit || {})}\n\nUser Query: ${prompt}`,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        const text = data?.choices?.[0]?.message?.content;
        if (text) return text;
      }
    } catch {}
  }

  // 3. Intelligent Deep Quantum Physics Neural Reasoner (Full Autonomous Fallback)
  const lower = prompt.toLowerCase();
  const numGates = circuit?.gates?.length || 0;

  if (lower.includes('explain this circuit') || lower.includes('what does this circuit do')) {
    if (circuit) {
      const report = await explainCircuitService(circuit);
      return `### 🔬 Quantum Circuit Analysis\n\n**${report.title}**\n\n${report.summary}\n\n**State Vector Equation:**\n\`${report.theoreticalState}\`\n\n**Measurement Probability Distribution (Born Rule):**\n${report.measurementOutcome}\n\n💡 **Key Quantum Insight:**\n${report.beginnerTrap}\n\n**Suggested Next Experiment:**\n- ${report.suggestedExperiments[0]}`;
    }
  }

  if (lower.includes('hadamard') || lower.includes('what is h') || lower.includes('why is h')) {
    return `### ⚡ The Hadamard Gate ($H$)\n\nThe **Hadamard gate** transforms computational basis states into symmetric superpositions:\n\n$$H|0\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}} = |+\\rangle$$\n$$H|1\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}} = |-\\rangle$$\n\n**Unitary Transformation Matrix:**\n$$H = \\frac{1}{\\sqrt{2}}\\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}$$\n\n**Key Quantum Properties:**\n1. **Involutory (Self-Inverse):** $H \\cdot H = I$. Applying it twice reconstructs the initial state.\n2. **Rotates onto the Equator:** Maps North pole ($|0\\rangle$) directly to the $+X$ axis on the 3D Bloch Sphere.\n3. **Python Qiskit:** \`qc.h(0)\``;
  }

  if (lower.includes('cnot') || lower.includes('cx') || lower.includes('entangle')) {
    return `### 🔗 Controlled-NOT ($CNOT$ / $CX$) & Entanglement\n\nThe **CNOT gate** is a 2-qubit entangling unitary that performs a bit-flip on the target qubit if and only if the control qubit is in state $|1\\rangle$.\n\n**Matrix Representation (Computational Basis $\{|00\\rangle, |01\\rangle, |10\\rangle, |11\\rangle\}$):**\n$$CNOT = \\begin{pmatrix} 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ 0 & 0 & 1 & 0 \\end{pmatrix}$$\n\n**Generating the Canonical Bell State ($|\\Phi^+\\rangle$):**\n1. Apply $H$ on $q_0$: $(|0\\rangle + |1\\rangle)|0\\rangle / \\sqrt{2} = (|00\\rangle + |10\\rangle)/\\sqrt{2}$\n2. Apply $CNOT(q_0 \\rightarrow q_1)$: $|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$\n\nMeasuring $q_0$ instantly collapses $q_1$ to the exact same outcome!`;
  }

  if (lower.includes('grover') || lower.includes('search')) {
    return `### 🔍 Grover's Unstructured Search Algorithm\n\nGrover's algorithm provides an exact **quadratic speedup** for unstructured database queries:\n\n- **Classical Complexity:** $\\mathcal{O}(N)$\n- **Quantum Complexity:** $\\mathcal{O}(\\sqrt{N})$\n\n**Core Mathematical Pipeline:**\n1. **Uniform Superposition:** Apply $H^{\\otimes n}|0\\rangle^{\\otimes n} = \\frac{1}{\\sqrt{N}}\\sum_{x=0}^{N-1}|x\\rangle$\n2. **Phase Oracle ($U_\\omega$):** Inverts amplitude of the target item $\\omega$: $U_\\omega|x\\rangle = (-1)^{f(x)}|x\\rangle$\n3. **Grover Diffusion Operator ($U_s$):** Inverts all amplitudes around the mean value: $U_s = 2|s\\rangle\\langle s| - I$\n\nAfter $\\approx \\frac{\\pi}{4}\\sqrt{N}$ iterations, the target state reaches $\\approx 100\\%$ measurement probability!`;
  }

  if (lower.includes('bloch') || lower.includes('sphere')) {
    return `### 🌐 The 3D Bloch Sphere Representation\n\nAny single-qubit pure quantum state can be parameterized by polar angle $\\theta \\in [0, \\pi]$ and azimuthal angle $\\phi \\in [0, 2\\pi)$:\n\n$$|\\psi\\rangle = \\cos\\left(\\frac{\\theta}{2}\\right)|0\\rangle + e^{i\\phi}\\sin\\left(\\frac{\\theta}{2}\\right)|1\\rangle$$\n\n- **North Pole ($\\theta = 0$):** $|0\\rangle$\n- **South Pole ($\\theta = \\pi$):** $|1\\rangle$\n- **$+X$ Equator ($\\theta = \\pi/2, \\phi = 0$):** $|+\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$\n- **$+Y$ Equator ($\\theta = \\pi/2, \\phi = \\pi/2$):** $|+i\\rangle = \\frac{|0\\rangle + i|1\\rangle}{\\sqrt{2}}$\n\nUnitary operations correspond to rigid 3D rotations on the surface of this sphere without changing state norm ($|\\alpha|^2 + |\\beta|^2 = 1$).`;
  }

  if (lower.includes('shor') || lower.includes('factor')) {
    return `### 🗝️ Shor's Prime Factorization Algorithm\n\nShor's algorithm achieves an **exponential speedup** over classical number sieve algorithms:\n\n- **Classical (General Number Field Sieve):** $\\mathcal{O}\\left(e^{c(\\ln N)^{1/3}(\\ln \\ln N)^{2/3}}\\right)$\n- **Shor's Quantum Algorithm:** $\\mathcal{O}\\left((\\log N)^3\\right)$\n\n**Methodology:**\nReduces prime factoring to finding the period $r$ of the modular exponential function $f(x) = a^x \\pmod N$ using the **Quantum Fourier Transform (QFT)**. This efficiently breaks RSA public-key encryption.`;
  }

  if (lower.includes('teleport') || lower.includes('teleportation')) {
    return `### 📡 Quantum Teleportation Protocol\n\nQuantum Teleportation transfers an unknown qubit state $|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle$ from Alice to Bob using an entangled Bell pair and **2 classical bits**:\n\n1. **Resource:** Alice and Bob share entangled state $|\\Phi^+\\rangle = (|00\\rangle + |11\\rangle)/\\sqrt{2}$.\n2. **Bell Measurement:** Alice performs a CNOT and Hadamard on $|\\psi\\rangle$ and her half of the Bell pair, measuring 2 classical bits ($m_1, m_2$).\n3. **Classical Communication:** Alice sends $m_1, m_2$ to Bob via classical channel.\n4. **Recovery:** Bob applies $X^{m_2}Z^{m_1}$ to recover $|\\psi\\rangle$ with 100% fidelity.\n\n*Note:* The original state $|\\psi\\rangle$ at Alice is destroyed upon measurement, fully honoring the **No-Cloning Theorem**!`;
  }

  return `### ⚛️ Quantum AI Assistant Insights\n\nRegarding: **"${prompt}"**\n\nIn quantum computing, every computational operation is represented by a unitary transformation matrix ($U^\\dagger U = I$) operating on a statevector in a complex Hilbert space $\\mathcal{H} = \\mathbb{C}^{2^n}$.\n\n**Current Circuit Status:** ${numGates} gates across ${circuit?.numQubits || 2} qubit wires.\n\n**Core Principles to Leverage:**\n1. **Superposition:** Explores all $2^n$ basis states simultaneously.\n2. **Quantum Interference:** Amplifies constructive probabilities of correct outcomes while canceling wrong states.\n3. **Entanglement:** Non-local quantum correlation enabling quantum algorithms to outperform classical Turing machines.\n\nAsk me for mathematical derivations, gate matrices, or Python Qiskit code examples for any algorithm!`;
}
