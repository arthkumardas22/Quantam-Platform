import { z } from 'zod';
import { circuitStateSchema } from './circuitValidator';

export const chatMessageSchema = z.object({
  id: z.string().optional(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().min(1, 'Message content cannot be empty'),
  timestamp: z.string().optional(),
});

export const aiChatSchema = z.object({
  message: z.string().min(1, 'Prompt message is required').max(2000),
  circuit: circuitStateSchema.optional(),
  history: z.array(chatMessageSchema).optional().default([]),
  conversationId: z.string().optional(),
});

export const explainCircuitSchema = z.object({
  circuit: circuitStateSchema,
});

export type AIChatInput = z.infer<typeof aiChatSchema>;
export type ExplainCircuitInput = z.infer<typeof explainCircuitSchema>;
