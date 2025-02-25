import { Appointment } from '../../entities/Appointment';
import { AppointmentStatus, PaymentStatus } from "@prisma/client";

interface AppointmentUpdateData {
  status?: AppointmentStatus;
  paymentStatus?: PaymentStatus;
  paymentIntentId?: string;
  // ... otros campos
}

export interface IAppointmentRepository {
  create(appointment: Appointment): Promise<Appointment>;
  findById(id: number): Promise<Appointment | null>;
  findAllByCompany(companyId: number): Promise<Appointment[]>;
  update(id: number, data: AppointmentUpdateData): Promise<void>;
  delete(id: number): Promise<void>;
  findByUserId(userId: number): Promise<Appointment[]>;
  // Método nuevo para filtrar por criterios (p. ej. fecha y estado)
  findAllWithFilters(companyId: number, filters: { date?: string; status?: string }): Promise<Appointment[]>;
}
