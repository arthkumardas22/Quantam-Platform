import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('5000').transform(Number),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),
  FRONTEND_URL: z.string().default('http://localhost:3000'),
  AI_PROVIDER: z.enum(['gemini', 'openai', 'mock']).default('mock'),
  AI_API_KEY: z.string().optional(),
  AI_API_URL: z.string().optional(),
  QUANTUM_SERVICE_URL: z.string().default('http://localhost:8000'),
  QUANTUM_SERVICE_ENABLED: z.string().default('false').transform((v) => v === 'true'),
  MAX_QUBITS: z.string().default('12').transform(Number),
  MAX_SHOTS: z.string().default('10000').transform(Number),
  MAX_CIRCUIT_GATES: z.string().default('100').transform(Number),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
