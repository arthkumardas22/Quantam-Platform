'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Atom,
  Cpu,
  Globe,
  Bot,
  Zap,
  CheckCircle2,
  Trophy,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Button } from './Button';

interface TutorialStep {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ElementType;
  content: {
    overview: string;
    points: { label: string; text: string }[];
    interactiveTip: string;
  };
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 1,
    title: 'Welcome to Quantum Computing',
    subtitle: 'Classical Bits vs Quantum Qubits',
    badge: 'Core Concept',
    icon: Atom,
    content: {
      overview:
        'In classical computing, data is stored in deterministic binary bits (0 or 1). In quantum computing, fundamental units are Qubits (|0⟩ and |1⟩) capable of existing in continuous linear superpositions simultaneously.',
      points: [
        {
          label: 'Classical Bit (0 or 1)',
          text: 'Determinate binary state: either completely off (0) or on (1).',
        },
        {
          label: 'Quantum Qubit (|ψ⟩)',
          text: 'Superposition state: |ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1.',
        },
        {
          label: 'Exponential Capacity',
          text: 'N classical bits store 1 state. N qubits explore 2^N states simultaneously.',
        },
      ],
      interactiveTip:
        'Think of a coin lying flat on a table (0 or 1). When spinning in mid-air, it is a continuous blur of both states until measured!',
    },
  },
  {
    id: 2,
    title: 'Superposition & The 3D Bloch Sphere',
    subtitle: 'Visualizing Quantum States in 3 Dimensions',
    badge: '3D Geometry',
    icon: Globe,
    content: {
      overview:
        'Any single-qubit quantum state can be geometrically mapped onto the surface of a 3D unit sphere known as the Bloch Sphere.',
      points: [
        {
          label: 'North Pole (|0⟩)',
          text: 'Ground state vector: aligned with the positive +Z axis.',
        },
        {
          label: 'South Pole (|1⟩)',
          text: 'Excited state vector: aligned with the negative -Z axis.',
        },
        {
          label: 'Equator (|+, -, +i, -i⟩)',
          text: 'Equal amplitude superpositions with distinct relative phase angles.',
        },
        {
          label: 'Hadamard (H) Gate',
          text: 'Rotates |0⟩ into equal superposition |+⟩ = (|0⟩ + |1⟩)/√2 (50% Born rule measurement probability).',
        },
      ],
      interactiveTip:
        'Drag the 3D Bloch sphere with your mouse to inspect statevectors and phase angles from any perspective!',
    },
  },
  {
    id: 3,
    title: 'Visual Quantum Circuit Studio',
    subtitle: 'Drag & Drop Wire Workbench',
    badge: 'Studio IDE',
    icon: Cpu,
    content: {
      overview:
        'The Quantum Studio IDE provides a time-indexed wire grid where horizontal lines represent qubits and gates operate sequentially from left to right.',
      points: [
        {
          label: 'Single-Qubit Unitaries',
          text: 'H (Hadamard), X (NOT), Z (Phase Flip), S & T (Phase Rotations).',
        },
        {
          label: 'Multi-Qubit Entangling Gates',
          text: 'CNOT (Controlled-NOT), CZ (Controlled-Z), SWAP (Wire state exchange).',
        },
        {
          label: 'Measurement Operator [M]',
          text: 'Collapses the quantum wavefunction into deterministic classical readout bits.',
        },
      ],
      interactiveTip:
        'Drag gates from the palette onto circuit wires. The exact statevector and probabilities calculate in real time.',
    },
  },
  {
    id: 4,
    title: 'Quantum Entanglement & Bell States',
    subtitle: 'Einstein’s Non-Local Quantum Link',
    badge: 'Entanglement',
    icon: Zap,
    content: {
      overview:
        'When two qubits become entangled, their physical properties become inseparable. Measuring one instantly dictates the state of the other across arbitrary distance.',
      points: [
        {
          label: 'Maximally Entangled |Φ+⟩',
          text: '|Φ+⟩ = (|00⟩ + |11⟩)/√2. Measuring qubit 0 as 0 guarantees qubit 1 collapses to 0.',
        },
        {
          label: 'Two-Step Synthesis',
          text: '1. Apply Hadamard (H) to q0. 2. Apply CNOT with control q0 and target q1.',
        },
        {
          label: 'Core Applications',
          text: 'Quantum Teleportation, Quantum Key Distribution (BB84/E91), and Superdense Coding.',
        },
      ],
      interactiveTip:
        'Open the Challenges tab to build and verify your own Bell State circuits with automated unitary scoring!',
    },
  },
  {
    id: 5,
    title: 'Seminal Algorithms & AI Tutor',
    subtitle: 'Exponential Quantum Speedups',
    badge: 'Algorithms & AI',
    icon: Bot,
    content: {
      overview:
        'Quantum algorithms solve complex mathematical, cryptographic, and optimization problems with quadratic or exponential speedup over classical algorithms.',
      points: [
        {
          label: 'Grover’s Search',
          text: 'Unsorted database search in O(√N) queries instead of classical O(N).',
        },
        {
          label: 'Shor’s Factoring',
          text: 'Prime factorization in polynomial time O((log N)³), breaking RSA cryptography.',
        },
        {
          label: 'AI Quantum Assistant',
          text: 'Explains phase kickback, wavefunction interference, and debugs circuit logic interactively.',
        },
      ],
      interactiveTip:
        'Ask the AI tutor in the workspace: "How does destructive interference cancel wrong answers in Grover?" for a live walkthrough.',
    },
  },
  {
    id: 6,
    title: "You're Ready to Build Quantum Circuits!",
    subtitle: 'Begin Your Hands-On Journey',
    badge: 'Ready!',
    icon: Trophy,
    content: {
      overview:
        'You have covered the key fundamentals of quantum computation: Qubits, Superposition, 3D Bloch Geometry, Entanglement, and Unitary Gates.',
      points: [
        {
          label: '1. Launch Quantum Studio',
          text: 'Experiment freely with gates, 3D Bloch spheres, and live Python Qiskit generation.',
        },
        {
          label: '2. Explore Curriculum',
          text: 'Work through interactive lessons with integrated quizzes.',
        },
        {
          label: '3. Master Challenges',
          text: 'Earn certifications and track your skill progression.',
        },
      ],
      interactiveTip:
        'Click the button below to launch the Quantum Studio IDE and start experimenting immediately.',
    },
  },
];

interface InteractiveTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InteractiveTutorialModal: React.FC<InteractiveTutorialModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const step = TUTORIAL_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === TUTORIAL_STEPS.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const handleNext = () => {
    if (isLastStep) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      onClose();
    } else {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex]);

  if (!isOpen) return null;

  const StepIcon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#723480]/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Surface Canvas: #FFFFE3 with #DBD4FF border */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-[#DBD4FF] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Banner: #723480 with #FFFFE3 text */}
        <div className="p-6 bg-[#723480] text-[#FFFFE3] relative overflow-hidden shrink-0 border-b border-[#DBD4FF]">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#DBD4FF] text-[#723480] flex items-center justify-center shadow-xs">
                <StepIcon className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DBD4FF] text-[11px] font-bold text-[#723480] mb-1">
                  <Sparkles className="w-3 h-3 text-[#723480]" />
                  <span>{step.badge}</span>
                  <span>•</span>
                  <span>Step {step.id} of {TUTORIAL_STEPS.length}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight">{step.title}</h3>
                <p className="text-xs text-[#FFFFE3]/90 font-medium">{step.subtitle}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-black/20 hover:bg-black/30 text-[#FFFFE3] transition-colors"
              title="Close Tutorial (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-5 w-full h-1.5 bg-[#DBD4FF]/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#DBD4FF] rounded-full transition-all duration-300"
              style={{
                width: `${((currentStepIndex + 1) / TUTORIAL_STEPS.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6 text-[#723480] bg-[#FFFFE3]">
          {/* Overview text */}
          <div className="p-4 rounded-2xl bg-white border border-[#DBD4FF] text-sm leading-relaxed font-normal text-[#723480]">
            {step.content.overview}
          </div>

          {/* Structured Key Points */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono text-[#808034] uppercase tracking-wider">
              Key Mechanics & Insights
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {step.content.points.map((pt, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-white border border-[#DBD4FF] flex flex-col justify-between hover:border-[#723480] transition-colors"
                >
                  <div className="text-xs font-bold text-[#723480] mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#808034] shrink-0" />
                    <span>{pt.label}</span>
                  </div>
                  <p className="text-[11px] text-[#723480]/80 leading-relaxed font-normal">{pt.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Pro Tip Box */}
          <div className="p-4 rounded-2xl bg-[#DBD4FF] border border-[#723480]/30 flex items-start gap-3">
            <div className="p-1.5 rounded-xl bg-[#723480] text-[#FFFFE3] shrink-0 mt-0.5 shadow-xs">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#723480]">Interactive Pro Tip</div>
              <p className="text-xs text-[#723480] mt-0.5 leading-relaxed font-normal">
                {step.content.interactiveTip}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-4 sm:p-6 border-t border-[#DBD4FF] bg-white flex items-center justify-between shrink-0">
          {/* Step indicator dots */}
          <div className="flex items-center gap-1.5">
            {TUTORIAL_STEPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentStepIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentStepIndex === idx
                    ? 'w-6 bg-[#723480]'
                    : 'w-2 bg-[#DBD4FF] hover:bg-[#723480]'
                }`}
                title={`Go to Step ${idx + 1}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={isFirstStep}
              leftIcon={<ChevronLeft className="w-4 h-4" />}
            >
              Back
            </Button>

            {isLastStep ? (
              <Link href="/workspace" onClick={onClose}>
                <Button
                  variant="primary"
                  size="sm"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Open Quantum Studio IDE
                </Button>
              </Link>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={handleNext}
                rightIcon={<ChevronRight className="w-4 h-4" />}
              >
                Next Step
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
