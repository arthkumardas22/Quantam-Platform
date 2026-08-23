import { CircuitState, SimulationResult, SimulatorBackend } from '@/types/quantum';
import { simulateCircuit, sampleShots } from './quantumEngine';

export async function runQuantumCircuit(
  circuit: CircuitState,
  backend: SimulatorBackend = 'qiskit_aer',
  shots: number = 1024
): Promise<SimulationResult> {
  const startTime = performance.now();

  // Simulate network/compute execution latency for realistic developer experience (300-600ms)
  await new Promise((resolve) => setTimeout(resolve, 450));

  try {
    const { stateVector, probabilities, blochCoordinates } = simulateCircuit(circuit);
    const counts = sampleShots(probabilities, shots);
    const executionTimeMs = Math.round(performance.now() - startTime);

    const backendNames: Record<SimulatorBackend, string> = {
      qiskit_aer: 'Qiskit Aer Simulator (Local GPU/CPU)',
      cirq_simulator: 'Google Cirq DensityMatrix Simulator',
      pennylane_lightning: 'PennyLane Lightning.qubit',
      ibm_quantum_cloud: 'IBM Quantum Falcon r5.11 (Simulated)',
    };

    return {
      executionId: `exec_${Math.random().toString(36).substring(2, 9)}`,
      backend: backendNames[backend] || backend,
      shots,
      executionTimeMs,
      timestamp: new Date().toISOString(),
      probabilities,
      counts,
      stateVector,
      blochSpheres: blochCoordinates,
      success: true,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown simulation error';
    return {
      executionId: `err_${Date.now()}`,
      backend: backend,
      shots,
      executionTimeMs: Math.round(performance.now() - startTime),
      timestamp: new Date().toISOString(),
      probabilities: {},
      counts: {},
      stateVector: { numQubits: circuit.numQubits, amplitudes: [] },
      blochSpheres: {},
      success: false,
      errorMessage: message,
    };
  }
}
