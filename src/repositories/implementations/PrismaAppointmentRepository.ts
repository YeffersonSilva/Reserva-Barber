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
}
