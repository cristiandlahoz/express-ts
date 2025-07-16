export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
}

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User): Promise<User>;
  findAll(): Promise<User[]>;
}


