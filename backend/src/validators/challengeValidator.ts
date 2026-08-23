import { z } from 'zod';
import { circuitStateSchema } from './circuitValidator';

export const submitChallengeSchema = z.object({
  circuit: circuitStateSchema,
});

export type SubmitChallengeInput = z.infer<typeof submitChallengeSchema>;
