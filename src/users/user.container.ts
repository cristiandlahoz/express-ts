import { asClass } from "awilix"
import { AwilixContainer } from "awilix"
import { UserRepositoryImpl } from "./repositories/user-repo.impl"
import { UserServiceImpl } from "./services/user.service"
import { UserController } from "./controllers/user.controller"

export const register = (container: AwilixContainer) => {
  container.register({
    userRepository: asClass(UserRepositoryImpl).singleton(),
    userService: asClass(UserServiceImpl).singleton(),
    userController: asClass(UserController).singleton(),
  })
}
