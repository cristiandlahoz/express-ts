import { Request, Response, NextFunction } from "express";
import { ApiResponseBuilder } from "@/config/utils/api-response";
import Boom from '@hapi/boom';
import {
  GetUserByIdUseCase,
  GetUserByEmailUseCase,
  CreateUserUseCase,
  GetAllUsersUseCase,
  CreateUserRequest
} from "@/users/usecases";
import { AppLogger } from "@/config/logger/app.logger";

export class UserController {
  private logger: AppLogger;

  constructor(
    private getUserByIdUseCase: GetUserByIdUseCase,
    private getUserByEmailUseCase: GetUserByEmailUseCase,
    private createUserUseCase: CreateUserUseCase,
    private getAllUsersUseCase: GetAllUsersUseCase
  ) {
    this.logger = new AppLogger('UserController');
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      this.logger.info('Getting user by ID', { userId: id });

      const user = await this.getUserByIdUseCase.execute(id);

      const responseBuilder = new ApiResponseBuilder(req);
      const links = {
        self: { href: `/users/${id}` },
        update: { href: `/users/${id}`, method: 'PUT' },
        delete: { href: `/users/${id}`, method: 'DELETE' },
        collection: { href: '/users' }
      };

      const response = responseBuilder.success(user, 'Usuario encontrado exitosamente', links);
      this.logger.info('User found successfully', { userId: id });
      res.json(response);
    } catch (error) {
      this.logger.error('Error getting user by ID', error as Error, { userId: req.params.id });
      next(Boom.notFound('Usuario no encontrado'));
    }
  }

  async getUserByEmail(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.params;
      const user = await this.getUserByEmailUseCase.execute(email);

      const responseBuilder = new ApiResponseBuilder(req);
      const links = {
        self: { href: `/users/email/${email}` },
        update: { href: `/users/${user!.id}`, method: 'PUT' },
        delete: { href: `/users/${user!.id}`, method: 'DELETE' },
        collection: { href: '/users' }
      };

      const response = responseBuilder.success(user, 'Usuario encontrado exitosamente', links);
      res.json(response);
    } catch (error) {
      next(Boom.notFound('Usuario no encontrado'));
    }
  }

  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;

      const createUserRequest: CreateUserRequest = {
        name,
        email,
        password
      };

      const user = await this.createUserUseCase.execute(createUserRequest);

      const responseBuilder = new ApiResponseBuilder(req);
      const links = {
        self: { href: `/users/${user.id}` },
        update: { href: `/users/${user.id}`, method: 'PUT' },
        delete: { href: `/users/${user.id}`, method: 'DELETE' },
        collection: { href: '/users' }
      };

      const response = responseBuilder.success(user, 'Usuario creado exitosamente', links);
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof Error) {
        next(Boom.badRequest(error.message));
      } else {
        next(Boom.internal('Error interno del servidor'));
      }
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const users = await this.getAllUsersUseCase.execute();
      const total = users.length;

      const responseBuilder = new ApiResponseBuilder(req);
      const links: Record<string, { href: string; method?: string }> = {
        self: { href: '/users' },
        create: { href: '/users', method: 'POST' },
        first: { href: '/users?page=1' },
        last: { href: `/users?page=${Math.ceil(total / limit)}` }
      };

      if (page > 1) {
        links['prev'] = { href: `/users?page=${page - 1}` };
      }
      if (page < Math.ceil(total / limit)) {
        links['next'] = { href: `/users?page=${page + 1}` };
      }

      const response = responseBuilder.paginated(users, page, limit, total, links);
      res.json(response);
    } catch (error) {
      next(Boom.internal('Error al obtener usuarios'));
    }
  }
}
