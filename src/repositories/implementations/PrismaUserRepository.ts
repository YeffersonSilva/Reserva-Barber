// src/repositories/implementations/PrismaUserRepository.ts
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
        // Se agrega companyId para vincular el usuario a la empresa.
        companyId: user.companyId ?? null,
        // Si deseas utilizar el campo phone, asegúrate de incluirlo (o eliminarlo según el modelo actual)
        // phone: user.phone || "default-phone",
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
        // Actualiza companyId si se provee; de lo contrario se mantiene el valor existente
        companyId: data.companyId,
        // phone: data.phone ?? undefined,
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

  // Método privado para mapear los datos de Prisma a una instancia de User
  private mapToEntity(userData: any): User {
    return new User(
      userData.id,
      userData.name,
      userData.email,
      userData.password,
      userData.phone,
      userData.role,
      userData.companyId,  // Ahora se asigna el valor de companyId
      userData.createdAt,
      userData.updatedAt
    );
  }
}
