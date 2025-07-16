import { User, UserRepository } from "@/users/interfaces";

export interface GetAllUsersUseCase {
  execute(): Promise<User[]>;
}

export class GetAllUsersUseCaseImpl implements GetAllUsersUseCase {
  constructor(private userRepository: UserRepository) { }

  async execute(): Promise<User[]> {
    return await this.userRepository.findAll();
  }
} 