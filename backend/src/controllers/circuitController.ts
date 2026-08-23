import { Request, Response, NextFunction } from 'express';
import { saveCircuitSchema, generateCodeSchema } from '../validators/circuitValidator';
import * as circuitService from '../services/circuitService';
import { sendSuccess } from '../utils/responseFormatter';

export async function saveCircuit(req: Request, res: Response, next: NextFunction) {
  try {
    const input = saveCircuitSchema.parse(req.body);
    const userId = req.user!.userId;
    const circuit = await circuitService.createCircuit(userId, input);
    return sendSuccess(res, circuit, 201);
  } catch (err) {
    next(err);
  }
}

export async function getCircuits(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const circuits = await circuitService.getUserCircuits(userId);
    return sendSuccess(res, circuits);
  } catch (err) {
    next(err);
  }
}

export async function getCircuit(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user?.userId;
    const circuit = await circuitService.getCircuitById(id, userId);
    return sendSuccess(res, circuit);
  } catch (err) {
    next(err);
  }
}

export async function updateCircuit(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const input = saveCircuitSchema.parse(req.body);
    const userId = req.user!.userId;
    const circuit = await circuitService.updateCircuit(id, userId, input);
    return sendSuccess(res, circuit);
  } catch (err) {
    next(err);
  }
}

export async function deleteCircuit(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;
    const result = await circuitService.deleteCircuit(id, userId);
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function generateCode(req: Request, res: Response, next: NextFunction) {
  try {
    const { circuit, framework } = generateCodeSchema.parse(req.body);
    let code = '';

    switch (framework) {
      case 'qiskit':
        code = circuitService.generateQiskitCode(circuit);
        break;
      case 'cirq':
        code = circuitService.generateCirqCode(circuit);
        break;
      case 'qasm':
        code = circuitService.generateOpenQASM(circuit);
        break;
      case 'pennylane':
        code = circuitService.generatePennyLaneCode(circuit);
        break;
    }

    return sendSuccess(res, {
      success: true,
      language: framework === 'qasm' ? 'qasm' : 'python',
      framework,
      code,
    });
  } catch (err) {
    next(err);
  }
}
