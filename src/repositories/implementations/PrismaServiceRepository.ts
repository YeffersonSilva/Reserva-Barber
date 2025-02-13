// src/repositories/implementations/PrismaServiceRepository.ts
import prisma from '../../config/dbConfig';
import { IServiceRepository } from '../../repositories/interfaces/IServiceRepository';
import { Service } from '../../entities/Service';

export class PrismaServiceRepository implements IServiceRepository {
  async create(service: Service): Promise<Service> {
    const created = await prisma.service.create({
      data: {
        companyId: service.companyId,
        name: service.name,
        description: service.description,
        duration: service.duration,
        active: service.active,
      },
    });

    return new Service(
      created.id,
      created.companyId,
      created.name,
      created.description,
      created.duration,
      created.active,
   
    );
  }

  async findById(id: number): Promise<Service | null> {
    const found = await prisma.service.findUnique({
      where: { id },
    });
    if (!found) return null;
    return new Service(
      found.id,
      found.companyId,
      found.name,
      found.description,
      found.duration,
      found.active,
   
    );
  }

  async findAll(): Promise<Service[]> {
    const services = await prisma.service.findMany();
    return services.map(s => new Service(
      s.id,
      s.companyId,
      s.name,
      s.description,
      s.duration,
      s.active,
  
    ));
  }

  async findAllByCompany(companyId: number): Promise<Service[]> {
    const services = await prisma.service.findMany({
      where: { companyId },
    });
    return services.map(s => new Service(
      s.id,
      s.companyId,
      s.name,
      s.description,
      s.duration,
      s.active,
    
    ));
  }

  async update(id: number, data: Partial<Service>): Promise<Service> {
    const updated = await prisma.service.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        duration: data.duration,
        active: data.active,
      },
    });

    return new Service(
      updated.id,
      updated.companyId,
      updated.name,
      updated.description,
      updated.duration,
      updated.active,
    
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.service.delete({
      where: { id },
    });
  }
}
