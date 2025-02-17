// src/repositories/implementations/PrismaUserRepository.ts
import prisma from '../../config/dbConfig';
import { IUserRepository } from '../interfaces/IUserRepository';
import { User } from '../../entities/User';

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const userData = await prisma.user.findUnique({ where: { email } });
    if (!userData) return null;
    return this.mapToEntity(userData);
  }

  async findById(id: number): Promise<User | null> {
    const userData = await prisma.user.findUnique({ where: { id } });
    if (!userData) return null;
    return this.mapToEntity(userData);
  }

  async create(user: User): Promise<User> {
    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        companyId: user.companyId ?? null,
        // Si deseas utilizar el campo phone, inclúyelo aquí si fuera necesario
      },
    });

    return this.mapToEntity(createdUser);
  }

  async update(userId: number, data: Partial<User>): Promise<User> {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
        companyId: data.companyId,
      },
    });

    return this.mapToEntity(updatedUser);
  }

  async delete(userId: number): Promise<void> {
    await prisma.user.delete({ where: { id: userId } });
  }

  async findAll(): Promise<User[]> {
    const usersData = await prisma.user.findMany();
    return usersData.map(this.mapToEntity);
  }

  // Método privado para mapear los datos de Prisma a una instancia de User
  private mapToEntity(userData: any): User {
    return new User(
      userData.id,
      userData.name,
      userData.email,
      userData.password,
      userData.phone,
      userData.role,
      userData.companyId,
      userData.createdAt,
      userData.updatedAt
    );
  }
}
