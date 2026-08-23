import { z } from 'zod';
import { env } from '../config/env';

export const gateTypeSchema = z.enum([
  'H', 'X', 'Y', 'Z', 'S', 'T',
  'Rx', 'Ry', 'Rz',
  'CNOT', 'CZ', 'SWAP', 'CCX',
  'M', 'BARRIER'
]);

export const placedGateSchema = z.object({
  id: z.string().optional(),
  type: gateTypeSchema,
  targetQubit: z.number().int().min(0).max(env.MAX_QUBITS - 1),
  controlQubit: z.number().int().min(0).max(env.MAX_QUBITS - 1).optional(),
  secondControlQubit: z.number().int().min(0).max(env.MAX_QUBITS - 1).optional(),
  swapTargetQubit: z.number().int().min(0).max(env.MAX_QUBITS - 1).optional(),
  column: z.number().int().min(0).max(50),
  parameter: z.number().optional(),
});

export const circuitStateSchema = z.object({
  numQubits: z.number().int().min(1).max(env.MAX_QUBITS),
  numColumns: z.number().int().min(1).max(50).default(8),
  gates: z.array(placedGateSchema).max(env.MAX_CIRCUIT_GATES),
});

export const saveCircuitSchema = z.object({
  name: z.string().min(1, 'Circuit name is required').max(100),
  circuit: circuitStateSchema,
  isPublic: z.boolean().optional().default(false),
});

export const generateCodeSchema = z.object({
  circuit: circuitStateSchema,
  framework: z.enum(['qiskit', 'cirq', 'qasm', 'pennylane']).default('qiskit'),
});

export type PlacedGateInput = z.infer<typeof placedGateSchema>;
export type CircuitStateInput = z.infer<typeof circuitStateSchema>;
export type SaveCircuitInput = z.infer<typeof saveCircuitSchema>;
export type GenerateCodeInput = z.infer<typeof generateCodeSchema>;
