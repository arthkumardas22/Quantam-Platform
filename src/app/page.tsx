'use client';

import React from 'react';
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
  GitFork,
  Layers,
  ChevronRight,
  Code2,
} from 'lucide-react';
import { QUANTUM_ALGORITHMS } from '@/services/learningApi';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const features = [
    {
      icon: Cpu,
      title: 'Interactive Circuit Builder',
      desc: 'Drag & drop Hadamard, Pauli, and multi-qubit CNOT gates on an interactive time-indexed quantum wire grid.',
      color: 'from-cyan-500/20 to-blue-500/20 border-cyan-300 text-cyan-700',
    },
    {
      icon: Bot,
      title: 'AI-Powered Quantum Tutor',
      desc: 'Context-aware AI tutor explains wavefunction interference, phase kickback, and debugs quantum logic step-by-step.',
      color: 'from-purple-500/20 to-indigo-500/20 border-purple-300 text-purple-700',
    },
    {
      icon: Globe,
      title: '3D Bloch Sphere Visualizer',
      desc: 'Interactive 3D Three.js sphere dynamically tracking single-qubit pure state vectors and spherical coordinates (θ, φ).',
      color: 'from-pink-500/20 to-rose-500/20 border-pink-300 text-pink-700',
    },
    {
      icon: Zap,
      title: 'Real-Time Quantum Simulator',
      desc: 'Exact statevector calculations & shot sampling with immediate computational basis probability distributions.',
      color: 'from-amber-500/20 to-yellow-500/20 border-amber-300 text-amber-700',
    },
    {
      icon: Code2,
      title: 'Multi-Framework Code Generation',
      desc: 'Live automatic synchronization to Python Qiskit 1.0, Google Cirq, OpenQASM 2.0, and Xanadu PennyLane.',
      color: 'from-emerald-500/20 to-teal-500/20 border-emerald-300 text-emerald-700',
    },
    {
      icon: Trophy,
      title: 'Interactive Circuit Challenges',
      desc: 'Gamified test suite verifying Bell state synthesis, Deutsch oracles, and swap circuits with automated test scoring.',
      color: 'from-blue-500/20 to-violet-500/20 border-blue-300 text-blue-700',
    },
  ];

  const journeySteps = [
    { step: '01', title: 'Beginner Basics', desc: 'Qubits, Dirac |ψ⟩ notation, Born Rule probability' },
    { step: '02', title: 'Fundamentals', desc: 'Hadamard superposition & 3D Bloch sphere' },
    { step: '03', title: 'Circuit Design', desc: 'Multi-qubit CNOTs, Bell states, EPR pairs' },
    { step: '04', title: 'Algorithms', desc: "Grover's Search, Deutsch-Jozsa & QFT" },
    { step: '05', title: 'Simulation', desc: '1024+ shots on Qiskit Aer & Cirq backends' },
    { step: '06', title: 'Challenges', desc: 'Hands-on automated quantum test runners' },
    { step: '07', title: 'Mastery', desc: 'Certification & deep quantum intuition' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-cyan-500/20 selection:text-cyan-900 flex flex-col">
      {/* Top Navigation */}
      <header className="h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center shadow-md shadow-cyan-600/20 group-hover:scale-105 transition-transform duration-300">
            <Atom className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>QuantamStudio_Bigslayers</span>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">Interactive Quantum Learning Platform</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
          <Link href="/learn" className="hover:text-cyan-700 transition-colors">
            Learning Hub
          </Link>
          <Link href="/algorithms" className="hover:text-cyan-700 transition-colors">
            Algorithms
          </Link>
          <Link href="/workspace" className="hover:text-cyan-700 transition-colors">
            Quantum Studio
          </Link>
          <Link href="/challenges" className="hover:text-cyan-700 transition-colors">
            Challenges
          </Link>
          <Link href="/tutor" className="hover:text-cyan-700 transition-colors">
            AI Tutor
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/workspace">
            <Button size="sm" variant="quantum" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
              Open Studio
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 md:px-12 overflow-hidden flex flex-col items-center text-center">
        {/* Soft Background Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-200/40 via-purple-200/30 to-indigo-200/40 blur-[100px] pointer-events-none rounded-full" />

        <div className="max-w-4xl z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-300 text-xs font-bold text-cyan-800 mb-6 shadow-sm animate-in fade-in">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>Interactive Quantum Computing & Circuit Exploration</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Learn Quantum Computing. <br />
            <span className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Build Quantum Circuits.
            </span>{' '}
            <br />
            Understand Every Qubit.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed font-normal">
            An AI-powered interactive learning platform that makes quantum algorithms visual,
            executable, and easy to understand with drag-and-drop circuits, real-time 3D Bloch
            spheres, and live Qiskit code generation.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/workspace">
              <Button size="lg" variant="quantum" leftIcon={<Cpu className="w-4 h-4" />}>
                Open Quantum Studio IDE
              </Button>
            </Link>
            <Link href="/learn">
              <Button size="lg" variant="outline" rightIcon={<BookOpen className="w-4 h-4" />}>
                Start Learning Curriculum
              </Button>
            </Link>
          </div>

          {/* Interactive Circuit Demo Mockup Card */}
          <div className="mt-14 w-full max-w-4xl p-1.5 rounded-3xl bg-gradient-to-b from-slate-200 via-slate-100 to-slate-200 border border-slate-300 shadow-xl backdrop-blur-md">
            <div className="rounded-2xl bg-white p-6 border border-slate-200 text-left shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-xs font-mono text-slate-700 ml-2 font-bold">
                    Bell State Generator |Φ+⟩ = (|00⟩ + |11⟩)/√2
                  </span>
                </div>
                <Badge variant="cyan">Simulation: 1024 Shots</Badge>
              </div>

              {/* Wire lines preview */}
              <div className="space-y-5 py-2 font-mono text-xs">
                <div className="flex items-center gap-4">
                  <span className="w-8 font-bold text-cyan-700">q0 |0⟩</span>
                  <div className="flex-1 flex items-center relative">
                    <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-300" />
                    <div className="z-10 px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-400 text-cyan-800 font-bold ml-6 shadow-sm">
                      H
                    </div>
                    <div className="z-10 w-4 h-4 rounded-full bg-emerald-600 ml-16 border-2 border-white shadow-md" />
                    <div className="z-10 px-2 py-1 rounded-lg bg-amber-50 border border-amber-400 text-amber-800 font-bold ml-20 text-[10px] shadow-sm">
                      [M]
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="w-8 font-bold text-purple-700">q1 |0⟩</span>
                  <div className="flex-1 flex items-center relative">
                    <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-[2px] bg-slate-300" />
                    <div className="z-10 w-8 h-8 rounded-full bg-white border-2 border-emerald-600 text-emerald-700 font-bold flex items-center justify-center ml-28 shadow-sm text-sm">
                      ⊕
                    </div>
                    <div className="z-10 px-2 py-1 rounded-lg bg-amber-50 border border-amber-400 text-amber-800 font-bold ml-16 text-[10px] shadow-sm">
                      [M]
                    </div>
                  </div>
                </div>
              </div>

              {/* Results Preview Bar */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 font-mono">
                  <span className="text-slate-500 font-semibold">Measured Probabilities:</span>
                  <span className="text-cyan-700 font-bold">|00⟩: 50.0% (512 shots)</span>
                  <span className="text-purple-700 font-bold">|11⟩: 50.0% (512 shots)</span>
                </div>
                <Link
                  href="/workspace"
                  className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1"
                >
                  <span>Open Interactive Studio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Platform Section */}
      <section className="py-16 px-6 md:px-12 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold font-mono text-cyan-700 uppercase tracking-wider mb-2">
              Next-Gen Quantum Learning
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why Learn With QuantamStudio_Bigslayers?
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Transforming abstract linear algebra and Dirac bra-ket formalism into intuitive,
              visual, and executable quantum mechanics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => {
              const Icon = f.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-cyan-400 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1 shadow-sm hover:shadow-md"
                >
                  <div>
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${f.color} flex items-center justify-center mb-4 border shadow-sm`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900 mb-2">{f.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quantum Learning Journey Pipeline */}
      <section className="py-20 px-6 md:px-12 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-bold font-mono text-purple-700 uppercase tracking-wider mb-2">
              Structured Roadmap
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The Quantum Learning Journey
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              From zero quantum background to building quantum error-corrected algorithms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {journeySteps.map((step, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200 relative overflow-hidden group hover:border-cyan-400 transition-all shadow-sm"
              >
                <div className="text-3xl font-extrabold font-mono text-slate-100 group-hover:text-cyan-100 transition-colors absolute top-3 right-4">
                  {step.step}
                </div>
                <div className="relative z-10">
                  <div className="text-xs font-mono font-bold text-cyan-700 mb-1">Phase {step.step}</div>
                  <h4 className="text-sm font-bold text-slate-900 mb-1.5">{step.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Algorithms Showcase */}
      <section className="py-16 px-6 md:px-12 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-xs font-bold font-mono text-cyan-700 uppercase tracking-wider mb-2">
                Quantum Speedups
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
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
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200 hover:border-purple-300 transition-all flex flex-col justify-between shadow-sm hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="purple">{algo.category}</Badge>
                    <span className="text-[11px] font-mono text-slate-500 font-semibold">
                      {algo.inventor} ({algo.year})
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">{algo.name}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed">{algo.purpose}</p>

                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 font-mono text-[11px] space-y-1.5 mb-4 shadow-inner">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Classical Complexity:</span>
                      <span className="text-rose-700 font-bold">{algo.classicalComplexity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Quantum Complexity:</span>
                      <span className="text-emerald-700 font-bold">{algo.quantumComplexity}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
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
      <footer className="mt-auto py-10 px-6 md:px-12 border-t border-slate-200 bg-white text-xs text-slate-600">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
              <Atom className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">QuantamStudio_Bigslayers</div>
              <div className="text-[10px] text-slate-500">
                Interactive Quantum Algorithm Learning Platform
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link href="/learn" className="hover:text-cyan-700 transition-colors">
              Curriculum
            </Link>
            <Link href="/algorithms" className="hover:text-cyan-700 transition-colors">
              Algorithms
            </Link>
            <Link href="/workspace" className="hover:text-cyan-700 transition-colors">
              Quantum Studio
            </Link>
            <Link href="/challenges" className="hover:text-cyan-700 transition-colors">
              Challenges
            </Link>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            Powered by Qiskit Aer & Google Cirq Architectures
          </div>
        </div>
      </footer>
    </div>
  );
}
