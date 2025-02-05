import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../../entities/User';

export class PrismaUserRepository implements IUserRepository {
  private prisma = new PrismaClient();

  async findByEmail(email: string): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({ where: { email } });
    if (!userData) return null;
    return this.mapToEntity(userData);
  }

  async findByCpf(cpf: string | null): Promise<User | null> {
    if (!cpf) return null;
    const userData = await this.prisma.user.findUnique({ where: { cpf } });
    if (!userData) return null;
    return this.mapToEntity(userData);
  }

  async findById(id: number): Promise<User | null> {
    const userData = await this.prisma.user.findUnique({ where: { id } });
    if (!userData) return null;
    return this.mapToEntity(userData);
  }

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        phone: user.phone || "default-phone",
        cpf: user.cpf ?? undefined,
        profileImageUrl: user.profileImageUrl ?? undefined,
        firebaseTokens: [], // Inicializa a lista de tokens vazia
        otp: user.otp ?? undefined,
      },
    });

    return this.mapToEntity(createdUser);
  }

  async update(userId: number, data: Partial<User>): Promise<User> {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone ?? undefined,
        cpf: data.cpf ?? undefined,
        profileImageUrl: data.profileImageUrl ?? undefined,
        otp: data.otp ?? undefined,
      },
    });

    return this.mapToEntity(updatedUser);
  }

  async delete(userId: number): Promise<void> {
    await this.prisma.user.delete({ where: { id: userId } });
  }

  async findAll(): Promise<User[]> {
    const usersData = await this.prisma.user.findMany();
    return usersData.map(this.mapToEntity);
  }

  async findAllByRole(
    role: 'ADMIN' | 'USER' | 'MANAGER',
    skip: number,
    take: number
  ): Promise<{ users: User[]; total: number }> {
    const usersData = await this.prisma.user.findMany({
      where: { role },
      skip,
      take,
    });

    const users = usersData.map(this.mapToEntity);
    const total = await this.prisma.user.count({ where: { role } });

    return { users, total };
  }

  async countAllUsers(): Promise<number> {
    return await this.prisma.user.count();
  }

  async countActiveSubscribers(): Promise<number> {
    return await this.prisma.subscription.count({
      where: {
        isActive: true,
      },
    });
  }

  async findAllWithPagination(
    skip: number,
    take: number
  ): Promise<{ users: User[]; total: number }> {
    const usersData = await this.prisma.user.findMany({ skip, take });
    const users = usersData.map(this.mapToEntity);

    const total = await this.prisma.user.count();
    return { users, total };
  }

  async getFirebaseTokensByType(type: 'USER' | 'MANAGER' | 'ALL'): Promise<string[]> {
    const whereClause =
      type === 'ALL'
        ? { firebaseTokens: { hasSome: [''] } } 
        : { role: type, firebaseTokens: { hasSome: [''] } }; 
  
    const users = await this.prisma.user.findMany({
      where: whereClause,
      select: { firebaseTokens: true },
    });
  
   
    return users.flatMap(user => user.firebaseTokens ?? []);
  }
  


  
}
