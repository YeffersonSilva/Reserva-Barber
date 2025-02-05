import prisma from '../../config/dbConfig';
import { IServiceRepository } from '../interfaces/IServiceRepository';
import { Service } from '../../entities/Service';

export class PrismaServiceRepository implements IServiceRepository {
  async create(service: Service): Promise<Service> {
    const created = await prisma.service.create({
      data: {
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
      },
    });

    return new Service(
      created.id,
      created.name,
      created.description,
      created.price,
      created.duration,
      
    );
  }

  async findById(id: number): Promise<Service | null> {
    const found = await prisma.service.findUnique({
      where: { id },
    });
    if (!found) return null;
    return new Service(
      found.id,
      found.name,
      found.description,
      found.price,
      found.duration,
      
    );
  }

  async findAll(): Promise<Service[]> {
    const services = await prisma.service.findMany();
    return services.map(
      (s) =>
        new Service(
          s.id,
          s.name,
          s.description,
          s.price,
          s.duration,
          
        )
    );
  }

  async update(id: number, data: Partial<Service>): Promise<Service> {
    const updated = await prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        duration: data.duration,
      },
    });

    return new Service(
      updated.id,
      updated.name,
      updated.description,
      updated.price,
      updated.duration,
      
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.service.delete({
      where: { id },
    });
  }
}
