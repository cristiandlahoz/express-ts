import { BadRequestException } from "@/config/exceptions/bad-request.exception";
import { User, UserRepository } from "@/users/interfaces";

export interface GetUserByEmailUseCase {
  execute(email: string): Promise<User | null>;
}

export class GetUserByEmailUseCaseImpl implements GetUserByEmailUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute(email: string): Promise<User | null> {
    if (!email || email.trim() === '') {
      throw new BadRequestException('Email is required');
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new BadRequestException('Invalid email format');
    }

    return await this.userRepository.findByEmail(email);
  }
} 