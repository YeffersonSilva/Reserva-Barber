import { User } from '../../entities/User';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(user: User): Promise<User>;
  update(userId: number, data: Partial<User>): Promise<User>;
  delete(userId: number): Promise<void>;
  findAll(): Promise<User[]>;
  

}
