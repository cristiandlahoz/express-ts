import { Request, Response, NextFunction } from 'express';

type WrapperHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

export const wrapperHandler = (fn: WrapperHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
};