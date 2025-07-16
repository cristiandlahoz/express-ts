import { Router, Request, Response } from "express";
import { ContainerRegistry } from "@/config/di/container-registy";
import { UserController } from "@/users/controllers/user.controller";
import { wrapperHandler } from "@/config/middlewares/async-request.middleware";

export const register = async (router: Router) => {
  const userController = await ContainerRegistry.resolve<UserController>("userController");

  router.get("/users", wrapperHandler(async (req: Request, res: Response) => {
    await userController.getAllUsers(req, res);
  }));
  router.get("/users/:id", wrapperHandler(async (req: Request, res: Response) => {
    await userController.getUserById(req, res);
  }));
  router.post("/users", wrapperHandler(async (req: Request, res: Response) => {
    await userController.createUser(req, res);
  }));

}