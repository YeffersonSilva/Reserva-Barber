import { IAppointmentRepository } from '../../repositories/interfaces/IAppointmentRepository';
import { CreateAppointmentDTO } from './dto/CreateAppointmentDTO';
import { UpdateAppointmentDTO } from './dto/UpdateAppointmentDTO';
import { Appointment } from '../../entities/Appointment';
import { AppError } from '../../error/AppError';

export class AppointmentService {
  constructor(private appointmentRepository: IAppointmentRepository) {}

  async createAppointment(
    data: CreateAppointmentDTO,
    userId: number,
    companyId: number
  ): Promise<Appointment> {
    const dateTimeParsed = new Date(data.dateTime);
    if (isNaN(dateTimeParsed.getTime())) {
      throw new AppError("Fecha y hora inválidas", 400);
    }

    const appointment = new Appointment(
      0, // El ID se genera en la base de datos
      userId,
      companyId,
      data.serviceId,
      data.employeeId ?? null, // Convertir undefined en null
      dateTimeParsed,
      'SCHEDULED'
    );

    return await this.appointmentRepository.create(appointment);
  }

  async getAppointmentById(id: number): Promise<Appointment> {
    const appointment = await this.appointmentRepository.findById(id);
    if (!appointment) {
      throw new AppError("Cita no encontrada", 404);
    }
    return appointment;
  }

  async listAppointmentsByCompany(companyId: number): Promise<Appointment[]> {
    return await this.appointmentRepository.findAllByCompany(companyId);
  }

  async listAppointmentsWithFilters(companyId: number, filters: { date?: string; status?: string }): Promise<Appointment[]> {
    return await this.appointmentRepository.findAllWithFilters(companyId, filters);
  }

  async listAppointmentsByUser(userId: number): Promise<Appointment[]> {
    return await this.appointmentRepository.findByUserId(userId);
  }

  async updateAppointment(id: number, data: UpdateAppointmentDTO): Promise<Appointment> {
    await this.getAppointmentById(id); // Verifica que la cita exista
    return await this.appointmentRepository.update(id, data);
  }

  async deleteAppointment(id: number, userId: number, isAdmin: boolean): Promise<void> {
    const appointment = await this.getAppointmentById(id);
    // Permitir eliminación solo si el usuario es admin o es el creador de la cita
    if (!isAdmin && appointment.userId !== userId) {
      throw new AppError("No autorizado para eliminar esta cita", 403);
    }
    await this.appointmentRepository.delete(id);
  }
}
