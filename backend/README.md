# QuantamStudio_Bigslayers — Backend Architecture
**AI-Based Interactive Quantum Algorithm Learning Platform (SIH 26140)**

Production-grade TypeScript / Node.js Express backend and Python Qiskit Aer simulation engine.

---

## 🏗️ Architecture Overview

```
backend/
├── src/
│   ├── config/          # Environment variables (Zod) & Prisma client
│   ├── controllers/     # Route request handlers
│   ├── middleware/      # Auth (JWT), rate limiters, error handling, logging
│   ├── routes/          # Express route definitions mounted under /api
│   ├── services/        # Business logic & Quantum execution engines
│   ├── types/           # Shared TypeScript interfaces
│   ├── utils/           # Password hashing, JWT signing, response formatters
│   ├── validators/      # Zod validation schemas
│   └── server.ts        # Express server entrypoint
│
├── prisma/
│   ├── schema.prisma    # PostgreSQL database models
│   └── seed.ts          # Default topics, algorithms, and challenges
│
├── quantum/             # Python FastAPI Qiskit Aer service
│   ├── main.py          # FastAPI HTTP application
│   ├── simulator.py     # Real Qiskit Aer simulation & Bloch calculation
│   ├── circuit_parser.py# Safe JSON to Qiskit QuantumCircuit parser
│   └── requirements.txt # Python dependencies
│
└── tests/               # Jest & Supertest integration tests
```

---

## ⚡ Quick Start

### 1. Install Node.js Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and set your credentials:
```bash
cp .env.example .env
```

### 3. Setup Database (PostgreSQL + Prisma)
```bash
npx prisma generate
npx prisma db push
npm run prisma:seed
```

### 4. Start Backend Server
```bash
npm run dev
# Server runs on http://localhost:5000
# Health check: http://localhost:5000/api/health
```

### 5. Start Python Qiskit Simulator (Optional)
```bash
cd quantum
pip install -r requirements.txt
python main.py
# Qiskit FastAPI service runs on http://localhost:8000
```

---

## 🧪 Running Tests
```bash
npm test
```
Tests cover:
- Health check and 404 handler
- Pauli-X, Hadamard, and Bell State $|\Phi^+\rangle$ simulation fidelity
- Statevector and Bloch coordinate computations
- Code generators (Qiskit, Cirq, OpenQASM, PennyLane)
- AI Tutor reasoning and structured circuit explanation reports

---

## 🔒 Security Features
- **Helmet**: Secure HTTP response headers
- **CORS**: Restricted to authorized origins (`http://localhost:3000`)
- **Rate Limiting**: Protection against brute-force and simulator spam
- **Input Validation**: Strict Zod schemas on all incoming payloads
- **Password Security**: Salted `bcryptjs` hashing (10 rounds)
- **Safe Quantum Execution**: Structured JSON parsing only; zero arbitrary `eval` execution.
