// src/repositories/implementations/PrismaReservationRepository.ts
import prisma from '../../config/dbConfig';
import { IReservationRepository } from '../interfaces/IReservationRepository';
import { Reservation } from '../../entities/Reservation';
import { Appointment as PrismaAppointment } from '@prisma/client';

export class PrismaReservationRepository implements IReservationRepository {
  async create(reservation: Reservation): Promise<Reservation> {
    const created: PrismaAppointment = await prisma.appointment.create({
      data: {
        userId: reservation.userId,
        companyId: reservation.companyId, // Se asigna el companyId
        serviceId: reservation.serviceId,
        dateTime: reservation.dateTime,
        status: reservation.status,
      },
    });
    return new Reservation(
      created.id,
      created.userId,
      created.companyId,
      created.serviceId,
      created.dateTime,
      created.status,
      created.createdAt,
      created.updatedAt
    );
  }

  async findById(id: number): Promise<Reservation | null> {
    const found: PrismaAppointment | null = await prisma.appointment.findUnique({ where: { id } });
    if (!found) return null;
    return new Reservation(
      found.id,
      found.userId,
      found.companyId,
      found.serviceId,
      found.dateTime,
      found.status,
      found.createdAt,
      found.updatedAt
    );
  }

  async findAll(): Promise<Reservation[]> {
    const reservations: PrismaAppointment[] = await prisma.appointment.findMany();
    return reservations.map((r: PrismaAppointment) => new Reservation(
      r.id,
      r.userId,
      r.companyId,
      r.serviceId,
      r.dateTime,
      r.status,
      r.createdAt,
      r.updatedAt
    ));
  }

  async update(id: number, data: Partial<Reservation>): Promise<Reservation> {
    const updated: PrismaAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        serviceId: data.serviceId,
        dateTime: data.dateTime,
        status: data.status,
      },
    });
    return new Reservation(
      updated.id,
      updated.userId,
      updated.companyId,
      updated.serviceId,
      updated.dateTime,
      updated.status,
      updated.createdAt,
      updated.updatedAt
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.appointment.delete({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Reservation[]> {
    const reservations: PrismaAppointment[] = await prisma.appointment.findMany({ where: { userId } });
    return reservations.map((r: PrismaAppointment) => new Reservation(
      r.id,
      r.userId,
      r.companyId,
      r.serviceId,
      r.dateTime,
      r.status,
      r.createdAt,
      r.updatedAt
    ));
  }
}
