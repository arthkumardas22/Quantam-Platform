import { Request, Response, NextFunction } from 'express';
import * as algorithmService from '../services/algorithmService';
import { sendSuccess } from '../utils/responseFormatter';

export async function getAlgorithms(req: Request, res: Response, next: NextFunction) {
  try {
    const algorithms = await algorithmService.getAllAlgorithms();
    return sendSuccess(res, algorithms);
  } catch (err) {
    next(err);
  }
}

export async function getAlgorithm(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const algorithm = await algorithmService.getAlgorithmById(id);
    return sendSuccess(res, algorithm);
  } catch (err) {
    next(err);
  }
}

export async function getAlgorithmChallenges(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const challenges = await algorithmService.getAlgorithmChallenges(id);
    return sendSuccess(res, challenges);
  } catch (err) {
    next(err);
  }
}
