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
}
