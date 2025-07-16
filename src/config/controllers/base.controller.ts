import { Request, Response, NextFunction } from "express";
import { AppLogger } from "@/config/logger/app.logger";
import { ApiResponseBuilder } from "@/config/utils/api-response";

export abstract class BaseController {
  protected logger: AppLogger;
  protected responseBuilder: ApiResponseBuilder;

  constructor(context: string, req: Request) {
    this.logger = new AppLogger(context);
    this.responseBuilder = new ApiResponseBuilder(req);
  }

  protected initializeResponseBuilder(req: Request): void {
    this.responseBuilder = new ApiResponseBuilder(req);
  }

  protected handleError(error: unknown, next: NextFunction, context?: string): void {
    this.logger.error(`Error in ${context || 'operation'}`, error as Error);
    next(error);
  }

  protected logRequest(req: Request, operation: string): void {
    this.logger.info(`Starting ${operation}`, {
      method: req.method,
      url: req.originalUrl,
      params: req.params,
      query: req.query
    });
  }

  protected logSuccess(operation: string, data?: any): void {
    this.logger.info(`${operation} completed successfully`, data);
  }
} 