import { Request, Response, NextFunction } from 'express';
import { aiChatSchema, explainCircuitSchema } from '../validators/aiValidator';
import * as aiService from '../services/aiService';
import { sendSuccess } from '../utils/responseFormatter';

export async function chat(req: Request, res: Response, next: NextFunction) {
  try {
    const { message, circuit, history } = aiChatSchema.parse(req.body);
    const response = await aiService.askAITutorService(message, circuit, history);
    return sendSuccess(res, {
      message: response,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
}

export async function explainCircuit(req: Request, res: Response, next: NextFunction) {
  try {
    const { circuit } = explainCircuitSchema.parse(req.body);
    const report = await aiService.explainCircuitService(circuit);
    return sendSuccess(res, report);
  } catch (err) {
    next(err);
  }
}
