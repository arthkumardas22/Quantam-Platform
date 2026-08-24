'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { QUANTUM_ALGORITHMS } from '@/services/learningApi';
import { useQuantum } from '@/context/QuantumContext';
import {
  ArrowLeft,
  Cpu,
  Play,
  Layers,
  Sparkles,
  GitFork,
  CheckCircle2,
  TrendingUp,
  Copy,
  Check,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { quantumAudio } from '@/utils/quantumAudio';

export default function AlgorithmDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { loadPreset } = useQuantum();

  const algo =
    QUANTUM_ALGORITHMS.find((a) => a.id === resolvedParams.id) ||
    QUANTUM_ALGORITHMS[0];

  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const [activeCodeFramework, setActiveCodeFramework] = useState<'qiskit' | 'cirq' | 'qasm'>('qiskit');
  const [copiedCode, setCopiedCode] = useState(false);

  const handleLaunchStudio = () => {
    quantumAudio.playGateChime(659.25);
    loadPreset(algo.defaultCircuitPresetId);
    router.push('/workspace');
  };

  const handleStepClick = (idx: number) => {
    setActiveStepIndex(idx);
    quantumAudio.playGateChime(523.25 + idx * 80);
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    quantumAudio.playCelebration();
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const codeSnippets: Record<'qiskit' | 'cirq' | 'qasm', string> = {
    qiskit: `# ${algo.name} in Python Qiskit 1.0
from qiskit import QuantumCircuit
from qiskit_aer import AerSimulator

qc = QuantumCircuit(3, 3)
qc.h(range(3)) # Prepare uniform superposition
# Apply ${algo.name} core oracle & diffusion
qc.barrier()
qc.measure(range(3), range(3))

sim = AerSimulator()
job = sim.run(qc, shots=1024)
print(job.result().get_counts())`,
    cirq: `# ${algo.name} in Google Cirq
import cirq

qubits = cirq.LineQubit.range(3)
circuit = cirq.Circuit(
    cirq.H.on_each(*qubits),
    # ${algo.name} transformation
    cirq.measure(*qubits, key='result')
)
simulator = cirq.Simulator()
result = simulator.run(circuit, repetitions=1000)
print(result.histogram(key='result'))`,
    qasm: `// ${algo.name} in OpenQASM 2.0
OPENQASM 2.0;
include "qelib1.inc";

qreg q[3];
creg c[3];

h q[0];
h q[1];
h q[2];
// ${algo.name} unitary operator
barrier q;
measure q -> c;`,
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6 sm:space-y-8 text-[#723480]">
        {/* Back and Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <Link
            href="/algorithms"
            className="flex items-center gap-2 text-xs font-bold text-[#808034] hover:text-[#531D5E] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Algorithms Explorer</span>
          </Link>

          <Button
            variant="primary"
            size="sm"
            onClick={handleLaunchStudio}
            leftIcon={<Cpu className="w-3.5 h-3.5" />}
          >
            Open in Quantum Studio
          </Button>
        </div>

        {/* Hero Card */}
        <div className="p-5 sm:p-8 rounded-3xl bg-white border-2 border-[#DBD4FF] shadow-xs space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="plum">{algo.category}</Badge>
            <Badge variant="lavender">{algo.speedupType} Speedup</Badge>
            <Badge variant="olive">{algo.difficulty}</Badge>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-[#531D5E]">{algo.name}</h1>
          <p className="text-xs sm:text-sm text-[#723480] font-bold">{algo.subtitle}</p>
          <p className="text-xs text-[#723480]/90 leading-relaxed max-w-3xl font-normal">{algo.overview}</p>

          {/* Complexity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t border-[#DBD4FF]">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFFE3] border border-[#DBD4FF]">
              <span className="text-[11px] font-mono text-[#808034] uppercase font-bold">
                Classical Runtime Bound
              </span>
              <div className="text-lg sm:text-xl font-bold font-mono text-[#723480] mt-1">
                {algo.classicalComplexity}
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#FFFFE3] border-2 border-[#531D5E] shadow-xs">
              <span className="text-[11px] font-mono text-[#531D5E] uppercase font-bold">
                Quantum Runtime Bound
              </span>
              <div className="text-lg sm:text-xl font-black font-mono text-[#531D5E] mt-1">
                {algo.quantumComplexity}
              </div>
            </div>
          </div>
        </div>

        {/* Mathematical Formalism */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border-2 border-[#DBD4FF] space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-[#808034] uppercase tracking-wider">
            Mathematical Formalism & Unitary Operator
          </h3>
          <div className="p-3 sm:p-4 rounded-2xl bg-[#FFFFE3] border border-[#DBD4FF] text-center font-mono text-[#531D5E] font-black text-sm sm:text-base md:text-lg shadow-inner overflow-x-auto">
            {algo.mathFormalism}
          </div>
        </div>

        {/* Step-by-Step Interactive Circuit Decomposition */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border-2 border-[#DBD4FF] space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#808034] uppercase tracking-wider">
              Circuit Execution Pipeline
            </h3>
            <span className="text-xs font-bold text-[#531D5E]">
              Step {activeStepIndex + 1} of {algo.stepsExplanation.length}
            </span>
          </div>

          <div className="space-y-2.5 sm:space-y-3">
            {algo.stepsExplanation.map((step, idx) => (
              <button
                key={step.stepNumber}
                onClick={() => handleStepClick(idx)}
                className={`w-full p-3 sm:p-4 rounded-2xl border-2 text-left flex items-start gap-3 sm:gap-4 transition-all cursor-pointer ${
                  activeStepIndex === idx
                    ? 'bg-[#531D5E] text-[#FFFFE3] border-[#531D5E] shadow-md scale-101'
                    : 'bg-[#FFFFE3] border-[#DBD4FF] text-[#723480] hover:border-[#531D5E] hover:bg-[#DBD4FF]'
                }`}
              >
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                    activeStepIndex === idx ? 'bg-[#DBD4FF] text-[#531D5E]' : 'bg-white text-[#723480] border border-[#DBD4FF]'
                  }`}
                >
                  0{step.stepNumber}
                </div>
                <div>
                  <h4 className="text-xs font-black">{step.title}</h4>
                  <p className="text-xs opacity-90 mt-1 leading-relaxed">{step.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Multi-Framework Executable Quantum Code Generator */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border-2 border-[#DBD4FF] space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#723480]" />
              <h3 className="text-xs font-bold text-[#808034] uppercase tracking-wider">
                Multi-Framework Code Generator
              </h3>
            </div>
            <button
              onClick={() => handleCopyCode(codeSnippets[activeCodeFramework])}
              className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-[#DBD4FF] hover:bg-[#531D5E] text-[#723480] hover:text-[#FFFFE3] text-xs font-bold transition-all cursor-pointer"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Framework Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 border-b border-[#DBD4FF] pb-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'qiskit', label: 'Qiskit 1.0' },
              { id: 'cirq', label: 'Cirq' },
              { id: 'qasm', label: 'OpenQASM 2.0' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveCodeFramework(tab.id as 'qiskit' | 'cirq' | 'qasm');
                  quantumAudio.playGateChime(587.33);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  activeCodeFramework === tab.id
                    ? 'bg-[#531D5E] text-[#FFFFE3]'
                    : 'bg-[#FFFFE3] text-[#723480] hover:bg-[#DBD4FF]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <pre className="p-3.5 sm:p-4 rounded-2xl bg-[#09152B] text-[#38BDF8] font-mono text-xs overflow-x-auto shadow-inner">
            {codeSnippets[activeCodeFramework]}
          </pre>
        </div>

        {/* Real-World Applications */}
        <div className="p-4 sm:p-6 rounded-3xl bg-white border-2 border-[#DBD4FF] space-y-3 shadow-xs">
          <h3 className="text-xs font-bold text-[#808034] uppercase tracking-wider">
            Real-World Quantum Applications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {algo.realWorldApplications.map((app, idx) => (
              <div
                key={idx}
                className="p-3 sm:p-3.5 rounded-2xl bg-[#FFFFE3] border border-[#DBD4FF] flex items-center gap-2.5 text-xs text-[#723480] font-bold shadow-xs"
              >
                <CheckCircle2 className="w-4 h-4 text-[#808034] shrink-0" />
                <span>{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Launch Bottom Banner */}
        <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFFE3] border-2 border-[#531D5E] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
          <div className="text-center sm:text-left">
            <h4 className="text-base font-black text-[#531D5E]">Ready to simulate this algorithm?</h4>
            <p className="text-xs text-[#723480]">
              Load this circuit directly into the Quantum Studio IDE with 1 click.
            </p>
          </div>
          <Button variant="primary" size="md" className="w-full sm:w-auto" onClick={handleLaunchStudio} leftIcon={<Play className="w-4 h-4 fill-current" />}>
            Open Studio IDE
          </Button>
        </div>
      </div>
    </AppShell>

  );
}
