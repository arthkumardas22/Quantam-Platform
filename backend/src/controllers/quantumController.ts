import { Request, Response, NextFunction } from 'express';
import { simulateCircuitSchema, stateVectorSchema, blochSphereSchema } from '../validators/quantumValidator';
import * as quantumService from '../services/quantumService';
import { sendSuccess } from '../utils/responseFormatter';

export async function simulate(req: Request, res: Response, next: NextFunction) {
  try {
    const { circuit, backend, shots } = simulateCircuitSchema.parse(req.body);
    const result = await quantumService.executeSimulation(circuit, backend, shots);
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getStateVector(req: Request, res: Response, next: NextFunction) {
  try {
    const { circuit } = stateVectorSchema.parse(req.body);
    const stateVector = await quantumService.computeStateVector(circuit);
    return sendSuccess(res, stateVector);
  } catch (err) {
    next(err);
  }
}

export async function getBlochSphere(req: Request, res: Response, next: NextFunction) {
  try {
    const { circuit, qubitIndex } = blochSphereSchema.parse(req.body);
    const bloch = await quantumService.computeBlochSphere(circuit, qubitIndex);
    return sendSuccess(res, bloch);
  } catch (err) {
    next(err);
  }
}
