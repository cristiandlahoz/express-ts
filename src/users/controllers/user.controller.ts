import { Request, Response } from "express";
import { UserService } from "@/users/interfaces";

export class UserController {
  constructor(private userService: UserService) { }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;
    const user = await this.userService.getUserById(id);
    res.json(user);
  }

  async getUserByEmail(req: Request, res: Response) {
    const { email } = req.params;
    const user = await this.userService.getUserByEmail(email);
    res.json(user);
  }

  async createUser(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const user = await this.userService.createUser({ id: '1', name, email, password });
    res.json(user);
  }

  async getAllUsers(req: Request, res: Response) {
    const users = await this.userService.getAllUsers();
    res.json(users);
  }
}
