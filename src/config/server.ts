import express from "express";
import http from "http";
import { Router } from "express";
import { ContainerRegistry } from "@/config/di/container-registy";
import { registerRoutes } from "@/config/routes/router-registry";
import { errorHandler } from "@/config/middlewares/error.middleware";
import { loggerMiddleware } from "@/config/logger/logger.config";
import { AppLogger } from "@/config/logger/app.logger";

export class Server {
  private express: express.Express;
  private appName: string;
  private env: string;
  private basePath: string;
  private port: string;
  private httpServer?: http.Server;
  private logger: AppLogger;

  constructor(appName: string, env: string, basePath: string, port: string) {
    this.appName = appName;
    this.env = env;
    this.basePath = basePath;
    this.port = port;
    this.express = express();
    this.logger = new AppLogger('Server');
  }

  private setupMiddleware(): void {
    this.express.disable('x-powered-by');

    // Logger middleware
    this.express.use(loggerMiddleware);

    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));

    // CORS
    this.express.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header(
        'Access-Control-Allow-Headers',
        'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method'
      );
      res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT');
      res.header('Allow', 'GET, POST, OPTIONS, PUT');
      if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
      }
      next();
    });
  }

  private async setupRoutes(): Promise<void> {
    const router = Router();
    await registerRoutes(router);
    this.express.use(this.basePath, router);

    // 404 handler
    this.express.use((req, res, next) => {
      this.logger.warn('Route not found', { path: req.url, method: req.method });
      res.status(404).json({
        message: 'Not Found',
        status: 404,
        timestamp: new Date().toISOString(),
        path: req.url
      });
    });

    this.express.use(errorHandler);
  }

  private async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing server...');
      await ContainerRegistry.initialize();
      this.setupMiddleware();
      await this.setupRoutes();
      this.logger.info('Server initialized successfully');
    } catch (error: unknown) {
      this.logger.error('Error initializing server', error as Error);
      throw error;
    }
  }

  async listen(): Promise<void> {
    try {
      await this.initialize();
      return new Promise(resolve => {
        this.httpServer = this.express.listen(this.port, () => {
          this.logger.info(`${this.appName} App is running`, {
            port: this.port,
            environment: this.env,
            basePath: this.basePath
          });
          resolve();
        });
      });
    } catch (error) {
      this.logger.error('Error starting server', error as Error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      if (this.httpServer) {
        await new Promise<void>(resolve => this.httpServer?.close(() => resolve()));
        this.logger.info('Server closed successfully');
      }
    } catch (error) {
      this.logger.error('Error closing server', error as Error);
      throw error;
    }
  }
}