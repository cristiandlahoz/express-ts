import { logger } from './logger.config';

export class AppLogger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, meta?: any) {
    logger.info(message, { context: this.context, ...meta });
  }

  error(message: string, error?: Error, meta?: any) {
    logger.error(message, {
      context: this.context,
      error: error?.stack,
      ...meta
    });
  }

  warn(message: string, meta?: any) {
    logger.warn(message, { context: this.context, ...meta });
  }

  debug(message: string, meta?: any) {
    logger.debug(message, { context: this.context, ...meta });
  }

  http(message: string, meta?: any) {
    logger.http(message, { context: this.context, ...meta });
  }
} 