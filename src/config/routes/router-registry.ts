import { pathToFileURL } from "url";
import { createRequire } from "module";
import { Router } from "express";
import { glob } from "glob";
import path from "path";

export class RouteRegistry {
  private static require = createRequire(__filename);

  static async registerRoutes(router: Router): Promise<void> {
    try {
      const srcDir = path.resolve(process.cwd(), 'src');
      const routeFiles = glob.sync('**/*.routes.{ts,js}', {
        cwd: srcDir,
        absolute: true,
        ignore: ['**/node_modules/**', '**/dist/**', '**/test/**'],
      });
      for (const routePath of routeFiles) {
        try {
          const normalizedPath = path.normalize(routePath);
          console.log(normalizedPath);
          let routeModule;
          try {
            routeModule = this.require(normalizedPath);
          } catch (requireError) {
            const moduleUrl = pathToFileURL(normalizedPath).href;
            routeModule = await import(moduleUrl);
          }
          if (typeof routeModule.register === 'function') {
            await routeModule.register(router);
          }
        } catch (error) {
          continue;
        }
      }
      console.log('las rutas se han registrado correctamente');
    } catch (error) {
      console.error('las rutas no se han registrado correctamente', error);
      throw error;
    }
  }
}

export const registerRoutes = RouteRegistry.registerRoutes.bind(RouteRegistry);