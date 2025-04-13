import { Request, Response } from "express";
import { UserService } from "../interfaces";

export class UserController {
  constructor(private userService: UserService) { }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await this.userService.getUserById(id);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    }
  }

  async getUserByEmail(req: Request, res: Response) {
    try {
      const { email } = req.params;
      const user = await this.userService.getUserByEmail(email);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el usuario' });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      const user = await this.userService.createUser({ id: '1', name, email, password });
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener todos los usuarios' });
    }
  }
}
