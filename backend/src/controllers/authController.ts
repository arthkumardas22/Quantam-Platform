import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema } from '../validators/authValidator';
import * as authService from '../services/authService';
import { sendSuccess } from '../utils/responseFormatter';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const input = registerSchema.parse(req.body);
    const result = await authService.registerUser(input);
    return sendSuccess(res, result, 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const input = loginSchema.parse(req.body);
    const result = await authService.loginUser(input);
    return sendSuccess(res, result, 200);
  } catch (err) {
    next(err);
  }
}

export async function logout(req: Request, res: Response) {
  return sendSuccess(res, { message: 'Logged out successfully.' }, 200);
}

export async function me(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const user = await authService.getCurrentUser(userId);
    return sendSuccess(res, user, 200);
  } catch (err) {
    next(err);
  }
}
