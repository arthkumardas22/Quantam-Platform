'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Atom,
  Cpu,
  Sparkles,
  Bot,
  Globe,
  Zap,
  BookOpen,
  Trophy,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Code2,
  Compass,
  Lightbulb,
  Play,
  RotateCw,
  Calculator,
  HelpCircle,
  Dices,
  Layers,
  Copy,
  Check,
  Menu,
  X,
  GraduationCap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QUANTUM_ALGORITHMS } from '@/services/learningApi';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Interactive3DCore } from '@/components/quantum/Interactive3DCore';
import { InteractiveTutorialModal } from '@/components/ui/InteractiveTutorialModal';
import { quantumAudio } from '@/utils/quantumAudio';

export default function LandingPage() {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<number>(0);
  const [selectedGate, setSelectedGate] = useState<string>('H');
  const [copiedGateCode, setCopiedGateCode] = useState(false);

  // Interactive Concept 1: Coin Flip Superposition
  const [coinState, setCoinState] = useState<'idle' | 'spinning' | 'heads' | 'tails'>('idle');

  // Interactive Concept 2: Superposition Amplitude Slider
  const [alphaSlider, setAlphaSlider] = useState<number>(50);

  // Interactive Concept 3: Entanglement Measurement
  const [entangledQ0, setEntangledQ0] = useState<'superposition' | '0' | '1'>('superposition');
  const [entangledQ1, setEntangledQ1] = useState<'superposition' | '0' | '1'>('superposition');

  // Interactive Concept 4: Interference Phase
  const [interferencePhase, setInterferencePhase] = useState<'constructive' | 'destructive'>('constructive');

  // Interactive Quantum Speedup Calculator
  const [dbSize, setDbSize] = useState<number>(1000000);

  // Interactive Quick Quiz
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const spinQuantumCoin = () => {
    setCoinState('spinning');
    quantumAudio.playCollapseSweep();
    setTimeout(() => {
      const outcome = Math.random() > 0.5 ? 'heads' : 'tails';
      setCoinState(outcome);
      quantumAudio.playCelebration();
      confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
    }, 700);
  };

  const measureEntanglement = () => {
    quantumAudio.playEntanglementBeam();
    const outcome = Math.random() > 0.5 ? '0' : '1';
    setEntangledQ0(outcome);
    setEntangledQ1(outcome);
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.8 } });
  };

  const resetEntanglement = () => {
    quantumAudio.playGateChime(440);
    setEntangledQ0('superposition');
    setEntangledQ1('superposition');
  };

  const handleQuizSubmit = (optionIndex: number) => {
    setQuizAnswer(optionIndex);
    setQuizSubmitted(true);
    if (optionIndex === 1) {
      quantumAudio.playCelebration();
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.8 } });
    } else {
      quantumAudio.playGateChime(330);
    }
  };

  const gateCheatSheet: Record<
    string,
    { name: string; type: string; matrix: string; effect: string; useCase: string; qiskit: string }
  > = {
    H: {
      name: 'Hadamard Gate',
      type: 'Single-Qubit Unitary',
      matrix: '1/√2 [[1, 1], [1, -1]]',
      effect: 'Maps computational basis states |0⟩ and |1⟩ into symmetric superposition states |+⟩ and |-⟩.',
      useCase: 'First operation in virtually all quantum algorithms to prepare uniform superpositions.',
      qiskit: 'qc.h(0)',
    },
    X: {
      name: 'Pauli-X (Bit Flip / NOT)',
      type: 'Single-Qubit Unitary',
      matrix: '[[0, 1], [1, 0]]',
      effect: 'Flips |0⟩ to |1⟩ and |1⟩ to |0⟩ (180° rotation around X axis on the Bloch sphere).',
      useCase: 'Quantum bit inversion, oracle initialization, and state preparation.',
      qiskit: 'qc.x(0)',
    },
    Z: {
      name: 'Pauli-Z (Phase Flip)',
      type: 'Single-Qubit Unitary',
      matrix: '[[1, 0], [0, -1]]',
      effect: 'Preserves amplitude of |0⟩ while applying a 180° phase flip (π) to |1⟩ (Z-axis rotation).',
      useCase: 'Target phase marking in Grover search and quantum phase estimation.',
      qiskit: 'qc.z(0)',
    },
    CNOT: {
      name: 'Controlled-NOT (CX)',
      type: 'Two-Qubit Entangling Gate',
      matrix: '4x4 Permutation Matrix',
      effect: 'Applies a bit flip (X) to the target qubit if and only if the control qubit is in state |1⟩.',
      useCase: 'Generates quantum entanglement, Bell state pairs, and parity checks.',
      qiskit: 'qc.cx(0, 1)',
    },
    S: {
      name: 'Phase Gate (S Gate)',
      type: 'Single-Qubit Unitary',
      matrix: '[[1, 0], [0, i]]',
      effect: 'Applies a +90° (π/2) phase rotation around the Z axis on the Bloch sphere.',
      useCase: 'Quantum Fourier Transform (QFT) and fault-tolerant Clifford group synthesis.',
      qiskit: 'qc.s(0)',
    },
    T: {
      name: 'T Gate (π/8 Gate)',
      type: 'Single-Qubit Non-Clifford',
      matrix: '[[1, 0], [0, e^(iπ/4)]]',
      effect: 'Applies a +45° (π/4) phase rotation around the Z axis.',
      useCase: 'Enables universal fault-tolerant quantum computation (Clifford + T synthesis).',
      qiskit: 'qc.t(0)',
    },
    M: {
      name: 'Measurement Operator',
      type: 'Wavefunction Collapse',
      matrix: 'Projective Born Rule',
      effect: 'Collapses the quantum superposition into a definitive classical bit (0 or 1).',
      useCase: 'Final readout step in all quantum experiments and shot sampling.',
      qiskit: 'qc.measure(0, 0)',
    },
  };

  const copyQiskitSnippet = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedGateCode(true);
    setTimeout(() => setCopiedGateCode(false), 2000);
  };

  const features = [
    {
      icon: Cpu,
      title: 'Interactive Circuit Builder',
      desc: 'Drag & drop Hadamard, Pauli, and multi-qubit CNOT gates on an interactive time-indexed quantum wire grid.',
    },
    {
      icon: Globe,
      title: '3D Bloch Sphere Visualizer',
      desc: 'Interactive 3D Three.js sphere dynamically tracking single-qubit pure state vectors and spherical coordinates (θ, φ).',
    },
    {
      icon: Bot,
      title: 'AI-Powered Quantum Tutor',
      desc: 'Context-aware AI tutor explains wavefunction interference, phase kickback, and debugs quantum logic step-by-step.',
    },
    {
      icon: Zap,
      title: 'Real-Time Quantum Simulator',
      desc: 'Exact statevector calculations & shot sampling with immediate computational basis probability distributions.',
    },
    {
      icon: Code2,
      title: 'Multi-Framework Code Generation',
      desc: 'Live automatic synchronization to Python Qiskit 1.0, Google Cirq, OpenQASM 2.0, and Xanadu PennyLane.',
    },
    {
      icon: Trophy,
      title: 'Interactive Circuit Challenges',
      desc: 'Gamified test suite verifying Bell state synthesis, Deutsch oracles, and swap circuits with automated scoring.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFE3] text-[#723480] selection:bg-[#DBD4FF] selection:text-[#531D5E] flex flex-col">
      {/* Top Navigation Bar */}
      <header className="h-16 border-b border-[#DBD4FF] bg-white/95 backdrop-blur-md px-4 sm:px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-[#723480] group-hover:bg-[#531D5E] flex items-center justify-center shadow-md shadow-[#723480]/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 border border-[#DBD4FF]">
            <Atom className="w-5 h-5 text-[#FFFFE3]" />
          </div>
          <div>
            <div className="font-black text-sm tracking-tight text-[#723480] group-hover:text-[#531D5E] transition-colors flex items-center gap-1.5">
              <span>QuantamStudio</span>
            </div>
            <div className="text-[10px] text-[#808034] font-bold hidden sm:block">Interactive Quantum Platform</div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-xs font-bold text-[#723480]">
          <Link href="/learn" className="hover:text-[#531D5E] hover:scale-105 transition-all">
            Learning Hub
          </Link>
          <Link href="/algorithms" className="hover:text-[#531D5E] hover:scale-105 transition-all">
            Algorithms
          </Link>
          <Link href="/workspace" className="hover:text-[#531D5E] hover:scale-105 transition-all">
            Quantum Studio
          </Link>
          <Link href="/challenges" className="hover:text-[#531D5E] hover:scale-105 transition-all">
            Challenges
          </Link>
          <Link href="/tutor" className="hover:text-[#531D5E] hover:scale-105 transition-all">
            AI Tutor
          </Link>
        </nav>

        {/* Right CTA / Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setIsTutorialOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#DBD4FF] hover:bg-[#531D5E] text-[#723480] hover:text-[#FFFFE3] border border-[#723480]/40 hover:border-[#531D5E] text-xs font-bold transition-all shadow-xs hover:scale-105 group cursor-pointer hover:shadow-md hover:shadow-[#531D5E]/30"
          >
            <Compass className="w-3.5 h-3.5 text-[#723480] group-hover:text-[#FFFFE3] group-hover:rotate-90 transition-transform duration-300" />
            <span>Tour</span>
          </button>

          <Link href="/workspace" className="hidden xs:block">
            <Button size="sm" variant="primary" rightIcon={<ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />}>
              Open Studio
            </Button>
          </Link>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[#723480] hover:bg-[#DBD4FF] hover:text-[#531D5E] border border-[#DBD4FF] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Slide-Over Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-[#531D5E]/40 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Body */}
          <div className="relative w-72 max-w-[85vw] bg-white border-r border-[#DBD4FF] flex flex-col h-full z-10 shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#DBD4FF]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#723480] flex items-center justify-center text-[#FFFFE3]">
                  <Atom className="w-4 h-4" />
                </div>
                <span className="font-black text-sm text-[#723480]">QuantamStudio</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-xl text-[#723480] hover:bg-[#DBD4FF]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1.5 font-bold text-xs">
              <Link
                href="/workspace"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[#DBD4FF] text-[#531D5E] border border-[#531D5E]/40"
              >
                <Cpu className="w-4 h-4" />
                <span>Quantum Studio IDE</span>
              </Link>
              <Link
                href="/learn"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#723480] hover:bg-[#DBD4FF]/60"
              >
                <BookOpen className="w-4 h-4" />
                <span>Learning Hub</span>
              </Link>
              <Link
                href="/algorithms"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#723480] hover:bg-[#DBD4FF]/60"
              >
                <Layers className="w-4 h-4" />
                <span>Algorithms Explorer</span>
              </Link>
              <Link
                href="/challenges"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#723480] hover:bg-[#DBD4FF]/60"
              >
                <Trophy className="w-4 h-4" />
                <span>Challenges & Tests</span>
              </Link>
              <Link
                href="/tutor"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#723480] hover:bg-[#DBD4FF]/60"
              >
                <Bot className="w-4 h-4" />
                <span>AI Quantum Tutor</span>
              </Link>
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#723480] hover:bg-[#DBD4FF]/60"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student Analytics</span>
              </Link>
            </nav>

            <div className="pt-4 border-t border-[#DBD4FF]">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsTutorialOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#FFFFE3] border border-[#DBD4FF] text-xs font-bold text-[#723480]"
              >
                <Compass className="w-4 h-4" />
                <span>Start Interactive Guide</span>
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 pb-14 sm:pb-20 px-4 sm:px-6 md:px-12 overflow-hidden flex flex-col items-center text-center">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#DBD4FF]/40 blur-[130px] pointer-events-none rounded-full" />

        <div className="max-w-4xl z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-[#DBD4FF] hover:bg-[#531D5E] text-[#723480] hover:text-[#FFFFE3] border border-[#723480]/30 hover:border-[#531D5E] text-[11px] sm:text-xs font-bold mb-5 sm:mb-6 shadow-xs hover:scale-105 transition-all cursor-pointer">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH 26140: AI-Based Interactive Quantum Algorithm Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#723480] leading-tight">
            Learn Quantum Computing. <br />
            <span className="text-gradient-garden">
              Build Real Quantum Circuits.
            </span>{' '}
            <br />
            Understand Every Qubit in 3D.
          </h1>

          <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-[#723480] max-w-2xl leading-relaxed font-normal">
            An intuitive, AI-powered interactive learning platform that makes quantum algorithms visual,
            executable, and crystal clear with drag-and-drop circuits, real-time 3D Bloch spheres,
            and live Qiskit code generation.
          </p>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3.5 w-full sm:w-auto">
            <Link href="/workspace" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto" leftIcon={<Cpu className="w-4 h-4" />}>
                Open Quantum Studio IDE
              </Button>
            </Link>

            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsTutorialOpen(true)}
              leftIcon={<Compass className="w-4 h-4 text-[#723480]" />}
              className="w-full sm:w-auto border-[#DBD4FF] hover:border-[#531D5E] bg-white hover:bg-[#DBD4FF] text-[#723480] hover:text-[#531D5E] font-bold shadow-xs hover:scale-105 transition-all cursor-pointer"
            >
              Start Interactive Tour
            </Button>

            <Link href="/learn" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto" rightIcon={<BookOpen className="w-4 h-4" />}>
                Curriculum Hub
              </Button>
            </Link>
          </div>
        </div>

        {/* 3D Interactive Quantum Qubit Object Core */}
        <div className="mt-10 sm:mt-14 w-full max-w-5xl z-10">
          <Interactive3DCore />
        </div>
      </section>

      {/* Live Interactive Concept Playgrounds */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 md:px-12 bg-white border-y border-[#DBD4FF]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DBD4FF] border border-[#723480]/30 text-[#723480] text-xs font-bold font-mono uppercase tracking-wider mb-3">
              <Lightbulb className="w-3.5 h-3.5 text-[#723480]" />
              <span>Interactive Concept Simulators</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#723480]">
              Play with Quantum Physics in Real-Time
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-[#808034] font-bold">
              Click the interactive simulators below to experience superposition, entanglement, and wave interference hands-on.
            </p>
          </div>

          {/* Concept Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 mb-6">
            {['1. Spinning Coin Qubit', '2. Superposition Dial', '3. Entanglement Link', '4. Wave Interference'].map((name, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedConcept(idx)}
                className={`p-3 sm:p-3.5 rounded-2xl border-2 text-center transition-all cursor-pointer ${
                  selectedConcept === idx
                    ? 'bg-[#531D5E] text-[#FFFFE3] font-black border-[#531D5E] shadow-md scale-102'
                    : 'bg-[#FFFFE3] border-[#DBD4FF] text-[#723480] hover:bg-[#531D5E] hover:text-[#FFFFE3] hover:border-[#531D5E] font-bold hover:scale-102'
                }`}
              >
                <div className="text-[11px] sm:text-xs">{name}</div>
              </button>
            ))}
          </div>

          {/* Interactive Playground Cards */}
          <div className="p-4 sm:p-6 md:p-8 rounded-3xl bg-[#FFFFE3] border-2 border-[#DBD4FF] shadow-xs relative overflow-hidden">
            {selectedConcept === 0 && (
              /* Concept 1: Coin Flip */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div>
                  <Badge variant="plum">Concept 1: What is a Qubit?</Badge>
                  <h4 className="text-xl font-black text-[#531D5E] mt-2 mb-2">The Spinning Quantum Coin</h4>
                  <p className="text-sm text-[#723480] leading-relaxed mb-4">
                    A classical bit is strictly Heads (|0⟩) or Tails (|1⟩). A quantum qubit in superposition is like a spinning coin in mid-air: it embodies both states until measurement forces it to collapse.
                  </p>
                  <button
                    onClick={spinQuantumCoin}
                    className="py-2.5 px-5 rounded-xl bg-[#531D5E] hover:bg-[#42134C] text-[#FFFFE3] text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105 active:scale-95"
                  >
                    <RotateCw className={`w-4 h-4 ${coinState === 'spinning' ? 'animate-spin' : ''}`} />
                    <span>Flip Coin into Superposition</span>
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-white border-2 border-[#DBD4FF] flex flex-col items-center justify-center text-center shadow-inner">
                  <div
                    className={`w-24 h-24 rounded-full border-4 flex items-center justify-center text-2xl font-black shadow-lg transition-all duration-500 ${
                      coinState === 'spinning'
                        ? 'border-[#808034] bg-[#DBD4FF] animate-spin text-[#723480]'
                        : coinState === 'heads'
                        ? 'border-[#531D5E] bg-[#531D5E] text-[#FFFFE3] scale-110'
                        : coinState === 'tails'
                        ? 'border-[#808034] bg-[#808034] text-[#FFFFE3] scale-110'
                        : 'border-[#DBD4FF] bg-[#FFFFE3] text-[#723480]'
                    }`}
                  >
                    {coinState === 'spinning' ? 'ψ' : coinState === 'heads' ? '|0⟩' : coinState === 'tails' ? '|1⟩' : 'Ready'}
                  </div>
                  <div className="mt-3 font-mono text-xs font-bold text-[#531D5E]">
                    {coinState === 'spinning'
                      ? 'Quantum Superposition |ψ⟩ = (|0⟩+|1⟩)/√2'
                      : coinState === 'heads'
                      ? 'Measured: Collapsed to |0⟩ (Heads)'
                      : coinState === 'tails'
                      ? 'Measured: Collapsed to |1⟩ (Tails)'
                      : 'Click button to spin coin'}
                  </div>
                </div>
              </div>
            )}

            {selectedConcept === 1 && (
              /* Concept 2: Superposition Dial */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div>
                  <Badge variant="plum">Concept 2: Superposition</Badge>
                  <h4 className="text-xl font-black text-[#531D5E] mt-2 mb-2">Continuous Amplitude Superposition</h4>
                  <p className="text-sm text-[#723480] leading-relaxed mb-4">
                    Dial the probability amplitude ratio below to see how adjusting the angle alters the probability distribution |α|² and |β|² in real-time.
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-[#531D5E]">
                      <span>Probability of |0⟩: {alphaSlider}%</span>
                      <span>Probability of |1⟩: {100 - alphaSlider}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={alphaSlider}
                      onChange={(e) => setAlphaSlider(parseInt(e.target.value))}
                      className="w-full accent-[#531D5E] cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border-2 border-[#DBD4FF] space-y-3 shadow-inner">
                  <div className="font-mono text-sm font-black text-[#531D5E] text-center">
                    |ψ⟩ = {Math.sqrt(alphaSlider / 100).toFixed(2)}|0⟩ + {Math.sqrt((100 - alphaSlider) / 100).toFixed(2)}|1⟩
                  </div>
                  <div className="space-y-2 font-mono text-xs">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-bold text-[#531D5E]">
                        <span>|0⟩ Ground State</span>
                        <span>{alphaSlider}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#FFFFE3] rounded-full overflow-hidden border border-[#DBD4FF]">
                        <div className="h-full bg-[#531D5E] transition-all duration-150" style={{ width: `${alphaSlider}%` }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] mb-1 font-bold text-[#808034]">
                        <span>|1⟩ Excited State</span>
                        <span>{100 - alphaSlider}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-[#FFFFE3] rounded-full overflow-hidden border border-[#DBD4FF]">
                        <div className="h-full bg-[#808034] transition-all duration-150" style={{ width: `${100 - alphaSlider}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedConcept === 2 && (
              /* Concept 3: Entanglement */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div>
                  <Badge variant="plum">Concept 3: Quantum Entanglement</Badge>
                  <h4 className="text-xl font-black text-[#531D5E] mt-2 mb-2">Spooky Action at a Distance</h4>
                  <p className="text-sm text-[#723480] leading-relaxed mb-4">
                    Two entangled qubits share an indivisible quantum state |Φ+⟩ = (|00⟩ + |11⟩)/√2. Measuring Qubit 0 instantly forces Qubit 1 to collapse to the identical value!
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={measureEntanglement}
                      className="py-2.5 px-4 rounded-xl bg-[#531D5E] hover:bg-[#42134C] text-[#FFFFE3] text-xs font-bold flex items-center gap-2 shadow-md cursor-pointer transition-all hover:scale-105"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Measure Qubit 0</span>
                    </button>
                    <button
                      onClick={resetEntanglement}
                      className="py-2.5 px-4 rounded-xl bg-white border border-[#DBD4FF] hover:border-[#531D5E] text-[#723480] text-xs font-bold cursor-pointer transition-all"
                    >
                      Reset State
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border-2 border-[#DBD4FF] flex items-center justify-around text-center shadow-inner">
                  <div className="flex flex-col items-center">
                    <div className="text-xs font-bold text-[#808034] mb-1">Qubit 0</div>
                    <div className="w-16 h-16 rounded-2xl bg-[#531D5E] text-[#FFFFE3] font-mono font-black text-lg flex items-center justify-center shadow-md">
                      {entangledQ0 === 'superposition' ? 'ψ₀' : `|${entangledQ0}⟩`}
                    </div>
                  </div>

                  <div className="h-[2px] w-12 bg-gradient-to-r from-[#531D5E] to-[#808034] relative">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-[#808034]">Link</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="text-xs font-bold text-[#808034] mb-1">Qubit 1</div>
                    <div className="w-16 h-16 rounded-2xl bg-[#808034] text-[#FFFFE3] font-mono font-black text-lg flex items-center justify-center shadow-md">
                      {entangledQ1 === 'superposition' ? 'ψ₁' : `|${entangledQ1}⟩`}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedConcept === 3 && (
              /* Concept 4: Wave Interference */
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
                <div>
                  <Badge variant="plum">Concept 4: Quantum Interference</Badge>
                  <h4 className="text-xl font-black text-[#531D5E] mt-2 mb-2">Constructive vs Destructive Waves</h4>
                  <p className="text-sm text-[#723480] leading-relaxed mb-4">
                    Quantum algorithms manipulate probability wave amplitudes so correct answers add constructively while wrong answers cancel destructively.
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInterferencePhase('constructive')}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                        interferencePhase === 'constructive'
                          ? 'bg-[#531D5E] text-[#FFFFE3] border-[#531D5E]'
                          : 'bg-white border-[#DBD4FF] text-[#723480]'
                      }`}
                    >
                      In-Phase (+1) Constructive
                    </button>
                    <button
                      onClick={() => setInterferencePhase('destructive')}
                      className={`py-2 px-4 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                        interferencePhase === 'destructive'
                          ? 'bg-[#531D5E] text-[#FFFFE3] border-[#531D5E]'
                          : 'bg-white border-[#DBD4FF] text-[#723480]'
                      }`}
                    >
                      Out-of-Phase (-1) Destructive
                    </button>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-white border-2 border-[#DBD4FF] flex flex-col items-center justify-center text-center shadow-inner">
                  <div className="text-base font-black text-[#531D5E] mb-2 font-mono">
                    {interferencePhase === 'constructive' ? 'Wave 1 (1/√2) + Wave 2 (1/√2) = 1.00 (Amplified)' : 'Wave 1 (1/√2) - Wave 2 (1/√2) = 0.00 (Cancelled)'}
                  </div>
                  <div className="w-full h-8 bg-[#FFFFE3] rounded-xl overflow-hidden border border-[#DBD4FF] flex items-center p-1">
                    <div
                      className={`h-full rounded-lg transition-all duration-300 font-mono text-xs font-bold text-[#FFFFE3] flex items-center justify-center ${
                        interferencePhase === 'constructive' ? 'w-full bg-[#531D5E]' : 'w-2 bg-rose-500'
                      }`}
                    >
                      {interferencePhase === 'constructive' ? '100% Probability Amplitude' : ''}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Quantum Gate Explorer & Code Sandbox */}
      <section className="py-20 px-6 md:px-12 bg-[#FFFFE3] border-b border-[#DBD4FF]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold font-mono text-[#808034] uppercase tracking-wider mb-2">
              Interactive Gate Sandbox
            </h2>
            <h3 className="text-2xl sm:text-3xl font-black text-[#723480]">
              Quantum Gate Explorer & Qiskit Generator
            </h3>
            <p className="mt-2 text-sm text-[#808034] font-bold">
              Click any gate to inspect its transformation matrix, effect, and copy working Python Qiskit code.
            </p>
          </div>

          {/* Gate Selector Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-8">
            {Object.keys(gateCheatSheet).map((gateKey, idx) => (
              <button
                key={gateKey}
                onClick={() => {
                  setSelectedGate(gateKey);
                  quantumAudio.playGateChime(523.25 + idx * 60);
                }}
                className={`w-13 h-13 rounded-2xl font-mono text-sm font-black border-2 transition-all flex items-center justify-center cursor-pointer ${
                  selectedGate === gateKey
                    ? 'bg-[#531D5E] text-[#FFFFE3] border-[#531D5E] scale-110 shadow-lg shadow-[#531D5E]/35'
                    : 'bg-white border-[#DBD4FF] text-[#723480] hover:border-[#531D5E] hover:bg-[#531D5E] hover:text-[#FFFFE3] hover:scale-108 hover:shadow-md'
                }`}
              >
                {gateKey}
              </button>
            ))}
          </div>

          {/* Gate Detail Card */}
          {gateCheatSheet[selectedGate] && (
            <div className="max-w-3xl mx-auto p-6 sm:p-8 rounded-3xl bg-white border-2 border-[#DBD4FF] shadow-sm hover-card-garden">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#DBD4FF] pb-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#723480] text-[#FFFFE3] font-mono font-black text-lg flex items-center justify-center shadow-sm">
                    {selectedGate}
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-[#723480]">
                      {gateCheatSheet[selectedGate].name}
                    </h4>
                    <span className="text-xs text-[#808034] font-mono font-bold">
                      {gateCheatSheet[selectedGate].type}
                    </span>
                  </div>
                </div>
                <div className="px-3 py-1 rounded-xl bg-[#DBD4FF] border border-[#723480]/30 text-xs font-mono text-[#531D5E] font-bold">
                  Matrix: {gateCheatSheet[selectedGate].matrix}
                </div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="font-black text-[#723480]">What It Does: </span>
                  <span className="text-[#723480]/90 font-normal">{gateCheatSheet[selectedGate].effect}</span>
                </div>
                <div>
                  <span className="font-black text-[#723480]">Practical Use Case: </span>
                  <span className="text-[#808034] font-bold">{gateCheatSheet[selectedGate].useCase}</span>
                </div>
              </div>

              {/* Interactive Qiskit Code Snippet */}
              <div className="mt-4 p-3.5 rounded-2xl bg-[#FFFFE3] border border-[#DBD4FF] flex items-center justify-between font-mono text-xs text-[#531D5E]">
                <div>
                  <span className="text-[#808034] font-bold mr-2">Python Qiskit:</span>
                  <span className="font-bold">{gateCheatSheet[selectedGate].qiskit}</span>
                </div>
                <button
                  onClick={() => copyQiskitSnippet(gateCheatSheet[selectedGate].qiskit)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#DBD4FF] hover:border-[#531D5E] text-[#723480] hover:text-[#531D5E] text-[11px] font-bold cursor-pointer transition-all"
                >
                  {copiedGateCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedGateCode ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="mt-6 pt-4 border-t border-[#DBD4FF] flex items-center justify-between">
                <Link
                  href="/workspace"
                  className="text-xs font-bold text-[#723480] hover:text-[#531D5E] flex items-center gap-1.5 group cursor-pointer"
                >
                  <Cpu className="w-4 h-4 group-hover:scale-110 group-hover:text-[#531D5E] transition-all" />
                  <span>Try {selectedGate} Gate in Quantum Studio IDE</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:text-[#531D5E] transition-all" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive Quantum Speedup Calculator */}
      <section className="py-20 px-6 md:px-12 bg-white border-b border-[#DBD4FF]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DBD4FF] border border-[#723480]/30 text-[#723480] text-xs font-bold font-mono uppercase tracking-wider mb-3">
            <Calculator className="w-3.5 h-3.5 text-[#723480]" />
            <span>Interactive Speedup Calculator</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#723480]">
            Calculate the Grover Search Quantum Speedup
          </h3>
          <p className="mt-2 text-sm text-[#808034] font-bold">
            Adjust the database size N to see the quadratic quantum speedup over classical linear search.
          </p>

          <div className="mt-8 p-6 sm:p-8 rounded-3xl bg-[#FFFFE3] border-2 border-[#DBD4FF] shadow-sm text-left">
            <div className="flex justify-between text-xs font-bold text-[#531D5E] mb-2 font-mono">
              <span>Database Size (N Items): {dbSize.toLocaleString()}</span>
              <span>Grover Operations: O(√N)</span>
            </div>
            <input
              type="range"
              min={100}
              max={100000000}
              step={10000}
              value={dbSize}
              onChange={(e) => setDbSize(parseInt(e.target.value))}
              className="w-full accent-[#531D5E] cursor-pointer mb-6"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#DBD4FF]">
                <div className="text-xs font-bold text-[#808034]">Classical Brute-Force Checks:</div>
                <div className="text-xl font-black text-[#723480] font-mono mt-1">
                  {(dbSize / 2).toLocaleString()} operations
                </div>
                <div className="text-[11px] text-[#723480]/70 mt-0.5">Average O(N/2) checks</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border-2 border-[#531D5E] shadow-sm">
                <div className="text-xs font-bold text-[#531D5E]">Grover Quantum Checks:</div>
                <div className="text-xl font-black text-[#531D5E] font-mono mt-1">
                  {Math.round(Math.PI / 4 * Math.sqrt(dbSize)).toLocaleString()} operations
                </div>
                <div className="text-[11px] text-[#531D5E] font-bold mt-0.5">
                  {( (dbSize / 2) / Math.max(1, Math.round(Math.PI / 4 * Math.sqrt(dbSize))) ).toFixed(0)}x Faster!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 1-Question Quantum Challenge */}
      <section className="py-20 px-6 md:px-12 bg-[#FFFFE3] border-b border-[#DBD4FF]">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DBD4FF] border border-[#723480]/30 text-[#723480] text-xs font-bold font-mono uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5 text-[#723480]" />
            <span>Instant Knowledge Check</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-[#723480]">
            Test Your Quantum Intuition
          </h3>
          <p className="mt-2 text-sm text-[#808034] font-bold">
            What happens when you apply a Hadamard (H) gate to the ground state |0⟩?
          </p>

          <div className="mt-6 space-y-2.5 text-left">
            {[
              'A. Flips the qubit directly to |1⟩',
              'B. Creates equal 50/50 superposition (|0⟩ + |1⟩)/√2',
              'C. Completely deletes the qubit',
              'D. Applies a 180° phase flip to |1⟩',
            ].map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleQuizSubmit(idx)}
                className={`w-full p-4 rounded-2xl border-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  quizSubmitted && idx === 1
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                    : quizSubmitted && quizAnswer === idx && idx !== 1
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-white border-[#DBD4FF] text-[#723480] hover:border-[#531D5E] hover:bg-[#531D5E] hover:text-[#FFFFE3]'
                }`}
              >
                <span>{option}</span>
                {quizSubmitted && idx === 1 && <CheckCircle2 className="w-5 h-5 text-white" />}
              </button>
            ))}
          </div>

          {quizSubmitted && (
            <div className="mt-4 p-4 rounded-2xl bg-white border border-[#DBD4FF] text-xs font-bold text-[#531D5E]">
              {quizAnswer === 1
                ? '🎉 Correct! The Hadamard (H) gate transforms basis state |0⟩ into equal superposition |+⟩ with a 50% chance of measuring 0 or 1 (+100 XP awarded)!'
                : '💡 Almost! The Hadamard gate creates an equal superposition |+⟩ = (|0⟩ + |1⟩)/√2.'}
            </div>
          )}
        </div>
      </section>

      {/* Featured Algorithms Showcase */}
      <section className="py-20 px-6 md:px-12 bg-white border-b border-[#DBD4FF]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-xs font-bold font-mono text-[#808034] uppercase tracking-wider mb-2">
                Quantum Speedups
              </h2>
              <h3 className="text-2xl sm:text-3xl font-black text-[#723480]">
                Featured Quantum Algorithms
              </h3>
            </div>
            <Link href="/algorithms">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View All Algorithms
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {QUANTUM_ALGORITHMS.slice(0, 6).map((algo) => (
              <div
                key={algo.id}
                className="p-6 rounded-3xl bg-[#FFFFE3] border-2 border-[#DBD4FF] hover-card-garden flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="plum">{algo.category}</Badge>
                    <span className="text-[11px] font-mono text-[#808034] font-bold">
                      {algo.inventor} ({algo.year})
                    </span>
                  </div>
                  <h4 className="text-base font-black text-[#723480] mb-1">{algo.name}</h4>
                  <p className="text-xs text-[#723480]/80 line-clamp-2 mb-4 leading-relaxed">{algo.purpose}</p>

                  <div className="p-3.5 rounded-2xl bg-white border border-[#DBD4FF] font-mono text-[11px] space-y-1.5 mb-4 shadow-inner">
                    <div className="flex justify-between">
                      <span className="text-[#808034] font-bold">Classical:</span>
                      <span className="text-[#723480] font-bold">{algo.classicalComplexity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#808034] font-bold">Quantum:</span>
                      <span className="text-[#531D5E] font-black">{algo.quantumComplexity}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-[#DBD4FF]">
                  <Link href={`/algorithms/${algo.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      Explore Theory
                    </Button>
                  </Link>
                  <Link href="/workspace">
                    <Button variant="primary" size="sm" title="Open Circuit in Studio">
                      <Cpu className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-12 px-6 md:px-12 border-t border-[#DBD4FF] bg-white text-xs text-[#723480]">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#723480] hover:bg-[#531D5E] transition-colors flex items-center justify-center text-[#FFFFE3] shadow-xs border border-[#DBD4FF] cursor-pointer">
              <Atom className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-[#723480]">QuantamStudio</div>
              <div className="text-[10px] text-[#808034] font-bold">
                Interactive Quantum Algorithm Learning Platform
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 font-bold">
            <Link href="/learn" className="hover:text-[#531D5E] transition-colors">
              Curriculum
            </Link>
            <Link href="/algorithms" className="hover:text-[#531D5E] transition-colors">
              Algorithms
            </Link>
            <Link href="/workspace" className="hover:text-[#531D5E] transition-colors">
              Quantum Studio
            </Link>
            <Link href="/challenges" className="hover:text-[#531D5E] transition-colors">
              Challenges
            </Link>
          </div>

          <div className="text-[11px] text-[#808034] font-mono font-bold">
            Powered by Qiskit Aer & Google Cirq Architectures
          </div>
        </div>
      </footer>

      {/* Interactive Guided Tour Modal */}
      <InteractiveTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
}
