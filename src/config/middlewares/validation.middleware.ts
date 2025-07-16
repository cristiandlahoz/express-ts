import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import Boom from '@hapi/boom';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const validationError = Boom.badRequest('Error de validación', {
      errors: errors.array().map(error => ({
        type: error.type,
        message: error.msg,
      }))
    });

    return next(validationError);
  }

  next();
}; 