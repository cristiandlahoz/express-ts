import { Router } from "express";
import { ContainerRegistry } from "../config/di/container-registy";
import { UserController } from "./controllers/user.controller";

export const register = async (router: Router) => {
  const userController = await ContainerRegistry.resolve<UserController>("userController");

  router.get("/users", async (req, res) => {
    userController.getAllUsers(req, res);
  });
}