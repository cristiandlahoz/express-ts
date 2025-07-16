import express from "express";
import http from "http";
import { Router } from "express";
import { ContainerRegistry } from "@/config/di/container-registy";
import { registerRoutes } from "@/config/routes/router-registry";
import { errorHandler } from "@/config/middlewares/error.middleware";
export class Server {
  private express: express.Express;
  private appName: string;
  private env: string;
  private basePath: string;
  private port: string;
  private httpServer?: http.Server;

  constructor(appName: string, env: string, basePath: string, port: string) {
    this.appName = appName;
    this.env = env;
    this.basePath = basePath;
    this.port = port;
    this.express = express();
  }

  private setupMiddleware(): void {
    this.express.disable('x-powered-by');//por seguridad de las peticiones
    this.express.use((req, res, next) => {
      console.log(`${req.method} ${req.url}`);//reemplazar por logger
      next();
    });
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: false }));
    this.express.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*'); //permite que cualquier origen acceda a la API
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
    this.express.use((req, res, next) => {
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
      await ContainerRegistry.initialize();
      this.setupMiddleware();
      await this.setupRoutes();
    } catch (error: unknown) {
      console.error(`Error initializing server`);
      throw error;
    }
  }

  async listen(): Promise<void> {
    try {
      await this.initialize();
      return new Promise(resolve => {
        this.httpServer = this.express.listen(this.port, () => {
          console.log(`${this.appName} App is running at ${this.port} in ${this.env} mode`);
          resolve();
        });
      });
    } catch (error) {
      console.error('Error starting server:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      if (this.httpServer) {
        await new Promise<void>(resolve => this.httpServer?.close(() => resolve()));
      }
    } catch (error) {
      console.error('Error closing server:', error);
      throw error;
    }
  }
}