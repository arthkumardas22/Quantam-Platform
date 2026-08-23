# FRONTEND ANALYSIS — QuantamStudio_Bigslayers

## 1. Frontend Architecture

- **Framework**: Next.js 16.3.2 (App Router)
- **Language**: TypeScript + React 19
- **Styling**: Tailwind CSS v4
- **State**: React Context API (`QuantumContext`, `UserContext`)
- **No fetch()/axios calls** — all services are pure in-browser simulations

---

## 2. Key Data Types (Source of Truth for Backend Contracts)

### Circuit Format (`src/types/quantum.ts`)
```typescript
interface PlacedGate {
  id: string;
  type: 'H'|'X'|'Y'|'Z'|'S'|'T'|'Rx'|'Ry'|'Rz'|'CNOT'|'CZ'|'SWAP'|'CCX'|'M'|'BARRIER';
  targetQubit: number;
  controlQubit?: number;
  secondControlQubit?: number;
  swapTargetQubit?: number;
  column: number;
  parameter?: number; // radians for Rx/Ry/Rz
}
interface CircuitState {
  numQubits: number;
  numColumns: number;
  gates: PlacedGate[];
}
```

### Simulation Result (`src/types/quantum.ts`)
```typescript
interface SimulationResult {
  executionId: string;
  backend: string;
  shots: number;
  executionTimeMs: number;
  timestamp: string;
  probabilities: Record<string, number>; // {"00": 0.5, "11": 0.5}
  counts: Record<string, number>;         // {"00": 512, "11": 512}
  stateVector: QuantumStateVector;
  blochSpheres: Record<number, BlochCoordinates>; // per qubit index
  success: boolean;
  errorMessage?: string;
}
interface BlochCoordinates { x, y, z, theta, phi }
```

### AI Tutor (`src/services/aiApi.ts`)
- `askAITutor(prompt, circuit, chatHistory)` → string
- `explainCircuit(circuit)` → `CircuitExplanationReport`

### Challenges (`src/services/challengeApi.ts`)
- `submitChallenge(challengeId, circuit)` → `ChallengeSubmissionResult`
- Fidelity score using Bhattacharyya coefficient (threshold ≥ 0.95)

---

## 3. Required Backend Endpoints

| Frontend Need | Endpoint | Method |
|---|---|---|
| Health check | `/api/health` | GET |
| Register user | `/api/auth/register` | POST |
| Login | `/api/auth/login` | POST |
| Current user | `/api/auth/me` | GET |
| List topics | `/api/topics` | GET |
| Topic lessons | `/api/topics/:id/lessons` | GET |
| Complete lesson | `/api/lessons/:id/complete` | POST |
| User progress | `/api/progress` | GET |
| Weekly analytics | `/api/progress/analytics` | GET |
| List algorithms | `/api/algorithms` | GET |
| Algorithm detail | `/api/algorithms/:id` | GET |
| Save circuit | `/api/circuits` | POST |
| List circuits | `/api/circuits` | GET |
| Get circuit | `/api/circuits/:id` | GET |
| Update circuit | `/api/circuits/:id` | PUT |
| Delete circuit | `/api/circuits/:id` | DELETE |
| Generate Qiskit code | `/api/circuits/generate-code` | POST |
| Simulate circuit | `/api/quantum/simulate` | POST |
| Statevector | `/api/quantum/statevector` | POST |
| Bloch sphere data | `/api/quantum/bloch-sphere` | POST |
| AI Chat | `/api/ai/chat` | POST |
| Explain circuit | `/api/ai/explain-circuit` | POST |
| List challenges | `/api/challenges` | GET |
| Challenge detail | `/api/challenges/:id` | GET |
| Submit challenge | `/api/challenges/:id/submit` | POST |

---

## 4. Simulation Response Format (Must Match Frontend)

```json
{
  "success": true,
  "data": {
    "executionId": "exec_abc123",
    "backend": "Qiskit Aer Simulator",
    "shots": 1024,
    "executionTimeMs": 342,
    "timestamp": "2024-01-01T00:00:00Z",
    "probabilities": {"00": 0.5, "11": 0.5},
    "counts": {"00": 512, "11": 512},
    "stateVector": {
      "numQubits": 2,
      "amplitudes": [
        {"basisState": "00", "index": 0, "amplitude": {"re": 0.707, "im": 0}, "probability": 0.5, "phase": 0},
        {"basisState": "11", "index": 3, "amplitude": {"re": 0.707, "im": 0}, "probability": 0.5, "phase": 0}
      ]
    },
    "blochSpheres": {
      "0": {"x": 0, "y": 0, "z": 0, "theta": 1.5708, "phi": 0},
      "1": {"x": 0, "y": 0, "z": 0, "theta": 1.5708, "phi": 0}
    }
  }
}
```

---

## 5. Notes
- Frontend currently uses **pure in-browser simulation** (no real API calls)
- Backend should be designed to accept the same `CircuitState` format
- The Python Qiskit service handles real quantum simulation
- Auth is optional for simulation endpoints but required for saving circuits/progress
