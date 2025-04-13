import { User, UserRepository, UserService } from "../interfaces";

export class UserServiceImpl implements UserService {
  constructor(private userRepository: UserRepository) { }
  getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }
  getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }
  createUser(user: User): Promise<User> {
    return this.userRepository.create(user);
  }
  getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }
}

