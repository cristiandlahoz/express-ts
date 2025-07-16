import { User, UserRepository } from "@/users/interfaces";

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

export interface CreateUserUseCase {
  execute(request: CreateUserRequest): Promise<User>;
}

export class CreateUserUseCaseImpl implements CreateUserUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute(request: CreateUserRequest): Promise<User> {
    // Validaciones de negocio
    if (!request.name || request.name.trim() === '') {
      throw new Error('Name is required');
    }

    if (!request.email || request.email.trim() === '') {
      throw new Error('Email is required');
    }

    if (!request.password || request.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    // Validación de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(request.email)) {
      throw new Error('Invalid email format');
    }

    // Verificar si el usuario ya existe
    const existingUser = await this.userRepository.findByEmail(request.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Generar ID único (en un caso real, esto podría ser un UUID)
    const id = Date.now().toString();

    const user: User = {
      id,
      name: request.name.trim(),
      email: request.email.toLowerCase().trim(),
      password: request.password // En un caso real, aquí se hashearía
    };

    return await this.userRepository.create(user);
  }
} 