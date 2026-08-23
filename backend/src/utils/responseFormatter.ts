import { Response } from 'express';
import { ApiSuccess, ApiError } from '../types';

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response {
  const body: ApiSuccess<T> = { success: true, data };
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  code: string,
  message: string,
  statusCode = 400,
  details?: unknown
): Response {
  const body: ApiError = { success: false, error: { code, message, details } };
  return res.status(statusCode).json(body);
}
