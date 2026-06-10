import { NextFunction, Request, Response } from 'express';
import { env } from '../config/env';

export const errorMiddleware = (error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (env.nodeEnv === 'development') {
    console.error(error);
  }

  return res.status(500).json({
    success: false,
    message: 'Ocurrió un error interno. Intente nuevamente.'
  });
};
