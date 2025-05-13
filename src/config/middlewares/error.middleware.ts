import { Request, Response, NextFunction } from 'express';
import { BaseException } from '../exceptions/base.exception';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof BaseException) {
    return res.status(error.statusCode).json({
      status: 'error',
      code: error.code,
      message: error.message,
      timestamp: new Date().toISOString(),
      path: req.path
    });
  }

  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Error interno del servidor',
    timestamp: new Date().toISOString(),
    path: req.path
  });
};