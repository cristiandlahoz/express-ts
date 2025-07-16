import { Request, Response, NextFunction } from 'express';
import Boom from '@hapi/boom';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (Boom.isBoom(error)) {
    return res.status(error.output.statusCode).json({
      ...error.output.payload,
      timestamp: new Date().toISOString(),
      path: req.path
    });
  }

  // Error no controlado
  const boomError = Boom.internal('Error interno del servidor');
  return res.status(boomError.output.statusCode).json({
    ...boomError.output.payload,
    timestamp: new Date().toISOString(),
    path: req.path
  });
};