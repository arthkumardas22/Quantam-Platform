<div align="center">

# ⚛️ QuantamStudio
### Next-Generation Interactive Quantum Computing Platform & Studio IDE

[![Next.js](https://img.shields.io/badge/Next.js-16.3.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL_3D-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)](LICENSE)

<p align="center">
  <b>QuantamStudio</b> is a comprehensive, full-featured quantum computing platform designed for students, researchers, and engineers. Build, simulate, visualize, and analyze quantum circuits in real-time with 3D WebGL Bloch spheres, multi-framework code export, interactive curriculum, automated challenge grading, and an integrated AI quantum tutor.
</p>

[Explore Workspace](#-quantum-studio-ide) • [Features](#-key-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture--tech-stack) • [Documentation](#-curriculum--algorithms)

</div>

---

## 🌟 Key Features

### ⚡ Quantum Studio IDE
- **Interactive Multi-Wire Workbench**: Drag-and-drop or tap-to-place quantum gates across customizable qubits (1–6) and time steps (4–16).
- **Comprehensive Quantum Gate Set**:
  - **Single Qubit**: Hadamard ($H$), Pauli-$X$ (NOT), Pauli-$Y$, Pauli-$Z$, Phase ($S$), $\pi/8$ ($T$).
  - **Rotations**: Continuous parameter rotation gates ($R_x(\theta)$, $R_y(\theta)$, $R_z(\theta)$) with live angle sliders.
  - **Multi-Qubit Entanglement**: Controlled-NOT ($\text{CNOT}$), Controlled-$Z$ ($\text{CZ}$), Toffoli ($\text{CCX}$), and $\text{SWAP}$.
  - **Measurement & Barriers**: Projected basis readout ($M$) and quantum circuit sync barriers.
- **Circuit Presets**: 1-click loading of Bell States ($|\Phi^+\rangle$, $|\Psi^+\rangle$), GHZ State, Quantum Teleportation, Superdense Coding, Deutsch-Jozsa, Quantum Fourier Transform, and Quantum Phase Estimation.
- **Undo / Redo & JSON State Persistence**: Full history stack and exportable circuit configuration.

### 🌐 3D WebGL Bloch Sphere & Obsidian Core
- **Hardware-Accelerated 3D Simulation**: Powered by Three.js with real-time state vector $|\psi\rangle = \cos(\theta/2)|0\rangle + e^{i\phi}\sin(\theta/2)|1\rangle$ tracking.
- **1-Finger Touch & Mouse Orbit Controls**: Natural 360° orbital rotation, basis pole HUD overlays ($|0\rangle$, $|1\rangle$, $|\pm\rangle$, $|\pm i\rangle$), and projection planes.
- **Wavefunction Collapse**: Interactive probabilistic measurement simulation adhering to the Born Rule ($P(x) = |\langle x|\psi\rangle|^2$).

### 💻 Multi-Framework Code Generation
- **Instant Code Synthesis**: Live compilation of visual circuits into clean, production-ready code:
  - 🐍 **Qiskit 1.0+** (Python)
  - 🔬 **Google Cirq** (Python)
  - 📜 **OpenQASM 2.0 / 3.0**
- 1-click clipboard copying and raw code export.

### 🎓 Interactive Learning Hub & Step Player
- **Structured Curriculum**: Progressive lessons covering Quantum Foundations, Superposition, Entanglement, Quantum Algorithms, and Noise Models.
- **Interactive Lesson Player**: Multi-step breakdowns with live mathematical formalism, visual circuit snippets, and checkpoint quizzes with instant feedback.

### 🔬 Quantum Algorithm Laboratory
- Deep-dive into fundamental quantum algorithms with theoretical proofs, step-by-step execution pipelines, and complexity matrices:
  - **Deutsch-Jozsa Algorithm** — Deterministic constant vs balanced oracle determination in $O(1)$.
  - **Bernstein-Vazirani Algorithm** — Hidden bitstring recovery in a single quantum query.
  - **Grover's Quantum Search** — Quadratic database search speedup ($O(\sqrt{N})$ vs $O(N)$).
  - **Quantum Phase Estimation (QPE)** — Eigenphase extraction for unitary operators.
  - **Quantum Fourier Transform (QFT)** — Exponential speedup for frequency transformation.
  - **Shor's Factoring Algorithm** — Polynomial-time integer factorization breaking RSA cryptography.

### 🏆 Gamified Challenges & Competency Matrix
- **Automated Circuit Verifier**: Test your circuit designs against expected state probability distributions with tolerance validation.
- **Gamification Engine**: Earn XP, build consecutive day streaks, unlock achievement badges, and track your Quantum Competency Matrix across 6 domain pillars.

### 🤖 AI Quantum Tutor & Circuit Explainer
- **Automated State Decomposition**: Instant AI theoretical breakdown of any circuit, explaining entanglement, phase evolution, and identifying common beginner traps.
- **Multi-Model Support**: Native reasoner alongside support for Google Gemini 2.0 / 1.5, Claude 3.7 Sonnet, and GPT-4o via user-configurable API keys.

### 📱 Optimized for Mobile & Tablet
- **Touch-Friendly Controls**: 1-tap quick-gate insertion popovers, mobile quick-gate strips, responsive drawer navigation, and synchronized multi-panel tab switchers.
- **Country Garden Design Palette**: Refined 4-color palette designed for visual clarity, elegance, and high-contrast readability:
  - Buttercream (`#FFFFE3`) • Lavender Mist (`#DBD4FF`) • Olive Gold (`#808034`) • Royal Plum (`#723480`) • Deep Plum (`#531D5E`)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v18.18.0 or higher)
- **npm**, **pnpm**, or **yarn**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/arthkumardas22/quantam-platform.git

# 2. Navigate to project root
cd quantam-platform

# 3. Install dependencies
npm install

# 4. Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to launch QuantamStudio.

---

## 🛠️ Architecture & Tech Stack

```
quantam-platform/
├── src/
│   ├── app/                      # Next.js 16 App Router Pages
│   │   ├── page.tsx              # Landing Page with 3D Core & Concept Playgrounds
│   │   ├── workspace/            # Quantum Studio IDE
│   │   ├── learn/                # Learning Hub & [topic] Lesson Player
│   │   ├── algorithms/           # Algorithm Explorer & [id] Detail Lab
│   │   ├── challenges/           # Interactive Quantum Challenges
│   │   ├── tutor/                # Dedicated AI Quantum Tutor
│   │   ├── dashboard/            # User Activity & Metric Dashboard
│   │   ├── progress/             # Competency Matrix & Achievement Badges
│   │   └── settings/             # Simulator Backends & Credentials
│   ├── components/
│   │   ├── ai/                   # AI Tutor Panel & Circuit Explainer Modal
│   │   ├── layout/               # AppShell, Responsive Sidebar, Topbar
│   │   ├── quantum/              # BlochSphere3D, CircuitBuilder, GatePalette,
│   │   │                         # Interactive3DCore, ProbabilityChart, StateVectorView
│   │   └── ui/                   # Button, Badge, Modals, Mouse Effects
│   ├── context/
│   │   ├── QuantumContext.tsx    # Quantum Circuit State & Simulation Engine
│   │   └── UserContext.tsx       # XP, Gamification, Streak & Progress Cache
│   ├── lib/
│   │   ├── presets.ts            # Quantum Circuit Templates & Presets
│   │   └── utils.ts              # Styling & Gate Formatting Utilities
│   ├── services/
│   │   ├── aiApi.ts              # AI Tutor & Circuit Explanation Services
│   │   ├── challengeApi.ts       # Challenge Verification & Unitary Grader
│   │   └── quantumSimulator.ts   # Client-Side Statevector & Born-Rule Engine
│   ├── types/
│   │   └── quantum.ts            # TypeScript Definitions for Circuits, Gates & States
│   └── utils/
│       └── quantumAudio.ts       # Web Audio API Synthesizer for Quantum Feedback
├── public/                       # Static Assets & Icons
└── package.json                  # Dependencies & Scripts
```

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16.3 (Turbopack, App Router)](https://nextjs.org/) |
| **Language** | [TypeScript 5.0+](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4.0](https://tailwindcss.com/) with Vanilla CSS Tokens |
| **3D Graphics** | [Three.js (WebGL)](https://threejs.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Audio** | Native Web Audio API Synthesizer |
| **Effects** | Canvas Confetti |

---

## ⌨️ Shortcuts & Controls

| Action | Desktop Shortcut | Mobile / Tablet Gesture |
| :--- | :--- | :--- |
| **Rotate 3D Sphere** | Click + Drag mouse | 1-Finger Touch Drag |
| **Place Active Gate** | Click wire slot | Tap wire slot |
| **Quick Gate Popover** | Click empty slot | Tap empty $(+)$ slot |
| **Edit / Delete Gate** | Click placed gate | Tap placed gate |
| **Undo Action** | `Ctrl` + `Z` | Tap Undo icon in toolbar |
| **Redo Action** | `Ctrl` + `Y` | Tap Redo icon in toolbar |
| **Run Simulation** | `Ctrl` + `Enter` | Tap `Run Simulation` button |
| **Close Modal / Drawer** | `Escape` | Tap Backdrop or $(X)$ button |

---

## ⚙️ Simulator Backends

QuantamStudio supports multiple simulation modes configured via `/settings`:
- **Statevector Engine (Default)**: Full $2^N$ complex amplitude precision state tracking with GPU/CPU acceleration.
- **Google Cirq DensityMatrix**: Simulates density matrices ($\rho$) for mixed states and quantum decoherence.
- **PennyLane Lightning**: Differentiable quantum circuit evaluation.
- **IBM Quantum Cloud (Simulated)**: Simulates physical readout error, depolarizing noise, and $T_1/T_2$ relaxation.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ for the global quantum computing community.</sub>
</div>

