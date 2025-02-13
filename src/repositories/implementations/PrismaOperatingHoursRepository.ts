import prisma from '../../config/dbConfig';
import { IOperatingHoursRepository } from '../interfaces/IOperatingHoursRepository';
import { OperatingHour } from '../../entities/OperatingHour';

export class PrismaOperatingHoursRepository implements IOperatingHoursRepository {
  async create(operatingHour: OperatingHour): Promise<OperatingHour> {
    const created = await prisma.operatingHour.create({
      data: {
        dayOfWeek: operatingHour.dayOfWeek,
        openTime: operatingHour.openTime,
        closeTime: operatingHour.closeTime,
      },
    });
    return new OperatingHour(
      created.id,
      created.dayOfWeek,
      created.openTime,
      created.closeTime,
   
    );
  }

  async findById(id: number): Promise<OperatingHour | null> {
    const found = await prisma.operatingHour.findUnique({
      where: { id },
    });
    if (!found) return null;
    return new OperatingHour(
      found.id,
      found.dayOfWeek,
      found.openTime,
      found.closeTime,
    
    );
  }

  async findAll(): Promise<OperatingHour[]> {
    const hours = await prisma.operatingHour.findMany();
    return hours.map(h => new OperatingHour(
      h.id,
      h.dayOfWeek,
      h.openTime,
      h.closeTime,
      
    ));
  }

  async update(id: number, data: Partial<OperatingHour>): Promise<OperatingHour> {
    const updated = await prisma.operatingHour.update({
      where: { id },
      data: {
        dayOfWeek: data.dayOfWeek,
        openTime: data.openTime,
        closeTime: data.closeTime,
      },
    });
    return new OperatingHour(
      updated.id,
      updated.dayOfWeek,
      updated.openTime,
      updated.closeTime,
   
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.operatingHour.delete({
      where: { id },
    });
  }
}
