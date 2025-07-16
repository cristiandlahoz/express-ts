import { asClass, AwilixContainer } from "awilix";
import { UserController } from "@/users/controllers/user.controller";
import { UserRepositoryImpl } from "@/users/repositories/user-repo.impl";
import {
  GetUserByIdUseCaseImpl,
  GetUserByEmailUseCaseImpl,
  CreateUserUseCaseImpl,
  GetAllUsersUseCaseImpl
} from "@/users/usecases";

export const register = async (container: AwilixContainer) => {
  container.register({
    // Repositories
    userRepository: asClass(UserRepositoryImpl).singleton(),

    // Use Cases
    getUserByIdUseCase: asClass(GetUserByIdUseCaseImpl).singleton(),
    getUserByEmailUseCase: asClass(GetUserByEmailUseCaseImpl).singleton(),
    createUserUseCase: asClass(CreateUserUseCaseImpl).singleton(),
    getAllUsersUseCase: asClass(GetAllUsersUseCaseImpl).singleton(),

    // Controllers
    userController: asClass(UserController).singleton(),
  });
};
