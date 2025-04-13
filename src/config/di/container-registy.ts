import { AwilixContainer, InjectionMode } from "awilix";
import { createContainer } from "awilix";
import { glob } from "glob";
import { createRequire } from "module";
import path from "path";
import { pathToFileURL } from "url";

export class ContainerRegistry {
  private static container: AwilixContainer;
  private static require = createRequire(__filename);

  static async initialize(): Promise<void> {
    try {
      this.container = createContainer({ injectionMode: InjectionMode.CLASSIC });
      const srcDir = path.resolve(process.cwd(), 'src');
      const containerFiles = glob.sync('**/*.container.{ts,js}', {
        cwd: srcDir,
        absolute: true,
        ignore: ['**/node_modules/**', '**/dist/**', '**/test/**'],
      });
      for (const containerPath of containerFiles) {
        try {
          const normalizedPath = path.normalize(containerPath);
          let containerModule;
          try {
            containerModule = this.require(normalizedPath);
          } catch (requireError) {
            const moduleUrl = pathToFileURL(normalizedPath).href;
            containerModule = await import(moduleUrl);
          }
          if (typeof containerModule.register === 'function') {
            await containerModule.register(this.container);
          }
        } catch (error) {
          continue;
        }
      }
      const registrations = Object.keys(this.container.registrations || {});
      if (registrations.length === 0) {
        throw new Error('Los contenedores no se han registrado correctamente');
      }
      console.log(`Se han registrado correctamente ${registrations.length} contenedor(es)`);
    } catch (error) {
      console.error(`Error initializing container`);
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