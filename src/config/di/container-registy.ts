import { AwilixContainer, InjectionMode } from "awilix";
import { createContainer } from "awilix";
import { glob } from "glob";
import { createRequire } from "module";
import path from "path";
import { pathToFileURL } from "url";
import { AppLogger } from "@/config/logger/app.logger";

export class ContainerRegistry {
  private static container: AwilixContainer;
  private static require = createRequire(__filename);
  private static logger = new AppLogger('ContainerRegistry');

  static async initialize(): Promise<void> {
    try {
      this.logger.info('Initializing dependency injection container...');
      this.container = createContainer({ injectionMode: InjectionMode.CLASSIC });

      const srcDir = path.resolve(process.cwd(), 'src');
      const containerFiles = glob.sync('**/*.container.{ts,js}', {
        cwd: srcDir,
        absolute: true,
        ignore: ['**/node_modules/**', '**/dist/**', '**/test/**'],
      });

      this.logger.info(`Found ${containerFiles.length} container files`);

      for (const containerPath of containerFiles) {
        try {
          const normalizedPath = path.normalize(containerPath);
          this.logger.debug('Loading container', { path: normalizedPath });

          let containerModule;
          try {
            containerModule = this.require(normalizedPath);
          } catch (requireError) {
            const moduleUrl = pathToFileURL(normalizedPath).href;
            containerModule = await import(moduleUrl);
          }

          if (typeof containerModule.register === 'function') {
            await containerModule.register(this.container);
            this.logger.debug('Container registered successfully', { path: normalizedPath });
          }
        } catch (error) {
          this.logger.error('Error loading container', error as Error, { path: containerPath });
          continue;
        }
      }

      const registrations = Object.keys(this.container.registrations || {});
      if (registrations.length === 0) {
        throw new Error('Los contenedores no se han registrado correctamente');
      }

      this.logger.info('Container initialization completed', {
        registeredServices: registrations.length,
        services: registrations
      });
    } catch (error) {
      this.logger.error('Error initializing container', error as Error);
      throw error;
    }
  }

  static async getContainer(): Promise<AwilixContainer> {
    if (!this.container) {
      await this.initialize();
    }
    return this.container;
  }

  static async resolve<T>(identifier: string): Promise<T> {
    const container = await this.getContainer();
    return container.resolve<T>(identifier);
  }

  static reset(): void {
    this.container = createContainer({ injectionMode: InjectionMode.CLASSIC });
  }
}