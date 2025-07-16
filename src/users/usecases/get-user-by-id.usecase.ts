import { User, UserRepository } from "@/users/interfaces";

export interface GetUserByIdUseCase {
  execute(id: string): Promise<User | null>;
}

export class GetUserByIdUseCaseImpl implements GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute(id: string): Promise<User | null> {
    if (!id || id.trim() === '') {
      throw new Error('User ID is required');
    }

    return await this.userRepository.findById(id);
  }
} 