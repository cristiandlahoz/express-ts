import { Router, Request, Response, NextFunction } from "express";
import { ContainerRegistry } from "@/config/di/container-registy";
import { UserController } from "@/users/controllers/user.controller";
import { wrapperHandler } from "@/config/middlewares/async-request.middleware";

export const register = async (router: Router) => {
  const userController = await ContainerRegistry.resolve<UserController>("userController");

  router.get("/users", wrapperHandler(async (req: Request, res: Response, next: NextFunction) => {
    await userController.getAllUsers(req, res, next);
  }));
  router.get("/users/:id", wrapperHandler(async (req: Request, res: Response, next: NextFunction) => {
    await userController.getUserById(req, res, next);
  }));
  router.post("/users", wrapperHandler(async (req: Request, res: Response, next: NextFunction) => {
    await userController.createUser(req, res, next);
  }));

}