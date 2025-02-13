import prisma from '../../config/dbConfig';
import { Appointment } from '../../entities/Appointment';
import { IAppointmentRepository } from '../interfaces/IAppointmentRepository';

export class PrismaAppointmentRepository implements IAppointmentRepository {
  async create(appointment: Appointment): Promise<Appointment> {
    const created = await prisma.appointment.create({
      data: {
        userId: appointment.userId,
        companyId: appointment.companyId,
        serviceId: appointment.serviceId,
        employeeId: appointment.employeeId,
        dateTime: appointment.dateTime,
        status: appointment.status,
      },
    });
    return new Appointment(
      created.id,
      created.userId,
      created.companyId,
      created.serviceId,
      created.employeeId,
      created.dateTime,
      created.status,
      created.createdAt,
      created.updatedAt
    );
  }

  async findById(id: number): Promise<Appointment | null> {
    const found = await prisma.appointment.findUnique({ where: { id } });
    if (!found) return null;
    return new Appointment(
      found.id,
      found.userId,
      found.companyId,
      found.serviceId,
      found.employeeId,
      found.dateTime,
      found.status,
      found.createdAt,
      found.updatedAt
    );
  }

  async findAllByCompany(companyId: number): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany({
      where: { companyId },
    });
    return appointments.map(a => new Appointment(
      a.id,
      a.userId,
      a.companyId,
      a.serviceId,
      a.employeeId,
      a.dateTime,
      a.status,
      a.createdAt,
      a.updatedAt
    ));
  }

  async update(id: number, data: Partial<Appointment>): Promise<Appointment> {
    const updated = await prisma.appointment.update({
      where: { id },
      data,
    });
    return new Appointment(
      updated.id,
      updated.userId,
      updated.companyId,
      updated.serviceId,
      updated.employeeId,
      updated.dateTime,
      updated.status,
      updated.createdAt,
      updated.updatedAt
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.appointment.delete({ where: { id } });
  }

  async findByUserId(userId: number): Promise<Appointment[]> {
    const appointments = await prisma.appointment.findMany({ where: { userId } });
    return appointments.map(a => new Appointment(
      a.id,
      a.userId,
      a.companyId,
      a.serviceId,
      a.employeeId,
      a.dateTime,
      a.status,
      a.createdAt,
      a.updatedAt
    ));
  }

  async findAllWithFilters(companyId: number, filters: { date?: string; status?: string }): Promise<Appointment[]> {
    const whereClause: any = { companyId };
    if (filters.date) {
      // Convertir la fecha a inicio y fin del día
      const date = new Date(filters.date);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0));
      const endOfDay = new Date(date.setHours(23, 59, 59, 999));
      whereClause.dateTime = { gte: startOfDay, lte: endOfDay };
    }
    if (filters.status) {
      whereClause.status = filters.status;
    }
    const appointments = await prisma.appointment.findMany({
      where: whereClause,
    });
    return appointments.map(a => new Appointment(
      a.id,
      a.userId,
      a.companyId,
      a.serviceId,
      a.employeeId,
      a.dateTime,
      a.status,
      a.createdAt,
      a.updatedAt
    ));
  }
}
