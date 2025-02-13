// src/modules/appointments/AppointmentService.ts
import { IAppointmentRepository } from '../../repositories/interfaces/IAppointmentRepository';
import { CreateAppointmentDTO } from './dto/CreateAppointmentDTO';
import { UpdateAppointmentDTO } from './dto/UpdateAppointmentDTO';
import { Appointment } from '../../entities/Appointment';
import { AppError } from '../../error/AppError';
import notificationService from '../../services/notificationService';

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

    // Se asigna null si data.employeeId es undefined
    const appointment = new Appointment(
      0, // ID se asigna automáticamente en la BD
      userId,
      companyId,
      data.serviceId,
      data.employeeId ?? null,
      dateTimeParsed,
      'SCHEDULED'
    );

    const createdAppointment = await this.appointmentRepository.create(appointment);

    // Enviar notificación por email después de crear la cita
    try {
      await notificationService.sendEmail({
        to: 'cliente@example.com', // Reemplaza con el email real del cliente
        subject: 'Confirmación de Cita',
        html: `<p>Su cita ha sido programada para el ${dateTimeParsed.toLocaleString()}.</p>`,
      });
    } catch (error) {
      console.error("Error al enviar notificación de cita:", error);
      // Según la lógica de negocio, puedes optar por propagar el error o continuar
    }

    return createdAppointment;
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

  async updateAppointment(id: number, data: UpdateAppointmentDTO): Promise<Appointment> {
    await this.getAppointmentById(id); // Verifica que la cita exista
    const updatedAppointment = await this.appointmentRepository.update(id, data);
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<void> {
    await this.getAppointmentById(id); // Verifica que la cita exista
    await this.appointmentRepository.delete(id);
  }
}
