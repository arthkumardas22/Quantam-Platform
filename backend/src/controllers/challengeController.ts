import { Request, Response, NextFunction } from 'express';
import { submitChallengeSchema } from '../validators/challengeValidator';
import * as challengeService from '../services/challengeService';
import { sendSuccess } from '../utils/responseFormatter';

export async function getChallenges(req: Request, res: Response, next: NextFunction) {
  try {
    const challenges = await challengeService.getAllChallenges();
    return sendSuccess(res, challenges);
  } catch (err) {
    next(err);
  }
}

export async function getChallenge(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const challenge = await challengeService.getChallengeById(id);
    return sendSuccess(res, challenge);
  } catch (err) {
    next(err);
  }
}

export async function submitChallenge(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { circuit } = submitChallengeSchema.parse(req.body);
    const userId = req.user?.userId;
    const result = await challengeService.evaluateChallengeSubmission(id, circuit, userId);
    return sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
