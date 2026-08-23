import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/responseFormatter';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Handle Zod Validation Errors
  if (err instanceof ZodError) {
    const formatted = err.flatten();
    sendError(
      res,
      'VALIDATION_ERROR',
      'Input validation failed. Please check your request parameters.',
      422,
      formatted.fieldErrors
    );
    return;
  }

  // Handle Syntax / JSON Parsing Errors
  if (err instanceof SyntaxError && 'body' in err) {
    sendError(res, 'MALFORMED_JSON', 'Malformed JSON payload in request body.', 400);
    return;
  }

  // Handle generic / unhandled exceptions
  const message = err?.message || 'An unexpected internal server error occurred.';
  const code = err?.code || 'INTERNAL_SERVER_ERROR';
  const status = typeof err?.status === 'number' ? err.status : 500;

  console.error(`[ERROR] ${req.method} ${req.path}:`, err);

  sendError(res, code, message, status);
}
