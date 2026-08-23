import { z } from 'zod';
import { circuitStateSchema } from './circuitValidator';
import { env } from '../config/env';

export const simulateCircuitSchema = z.object({
  circuit: circuitStateSchema,
  backend: z
    .enum(['qiskit_aer', 'cirq_simulator', 'pennylane_lightning', 'ibm_quantum_cloud'])
    .default('qiskit_aer'),
  shots: z.number().int().min(1).max(env.MAX_SHOTS).default(1024),
});

export const stateVectorSchema = z.object({
  circuit: circuitStateSchema,
});

export const blochSphereSchema = z.object({
  circuit: circuitStateSchema,
  qubitIndex: z.number().int().min(0).max(env.MAX_QUBITS - 1).optional(),
});

export type SimulateCircuitInput = z.infer<typeof simulateCircuitSchema>;
export type StateVectorInput = z.infer<typeof stateVectorSchema>;
export type BlochSphereInput = z.infer<typeof blochSphereSchema>;
