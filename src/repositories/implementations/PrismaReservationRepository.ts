import prisma from '../../config/dbConfig';
import { IReservationRepository } from '../interfaces/IReservationRepository';
import { Reservation } from '../../entities/Reservation';

export class PrismaReservationRepository implements IReservationRepository {
  async create(reservation: Reservation): Promise<Reservation> {
    const created = await prisma.reservation.create({
      data: {
        userId: reservation.userId,
        serviceId: reservation.serviceId,
        dateTime: reservation.dateTime,
        status: reservation.status,
      },
    });
    return new Reservation(
      created.id,
      created.userId,
      created.serviceId,
      created.dateTime,
      created.status,
      
    );
  }

  async findById(id: number): Promise<Reservation | null> {
    const found = await prisma.reservation.findUnique({ where: { id } });
    if (!found) return null;
    return new Reservation(
      found.id,
      found.userId,
      found.serviceId,
      found.dateTime,
      found.status,
      
    );
  }

  async findAll(): Promise<Reservation[]> {
    const reservations = await prisma.reservation.findMany();
    return reservations.map(r => new Reservation(
      r.id,
      r.userId,
      r.serviceId,
      r.dateTime,
      r.status,
     
    ));
  }

  async update(id: number, data: Partial<Reservation>): Promise<Reservation> {
    const updated = await prisma.reservation.update({
      where: { id },
      data: {
        // Se permite actualizar solo algunos campos
        serviceId: data.serviceId,
        dateTime: data.dateTime,
        status: data.status,
      },
    });
    return new Reservation(
      updated.id,
      updated.userId,
      updated.serviceId,
      updated.dateTime,
      updated.status,
   
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.reservation.delete({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Reservation[]> {
    const reservations = await prisma.reservation.findMany({ where: { userId } });
    return reservations.map(r => new Reservation(
      r.id,
      r.userId,
      r.serviceId,
      r.dateTime,
      r.status,

    ));
  }
}
