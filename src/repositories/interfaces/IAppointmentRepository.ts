import { Appointment } from '../../entities/Appointment';

export interface IAppointmentRepository {
  create(appointment: Appointment): Promise<Appointment>;
  findById(id: number): Promise<Appointment | null>;
  findAllByCompany(companyId: number): Promise<Appointment[]>;
  update(id: number, data: Partial<Appointment>): Promise<Appointment>;
  delete(id: number): Promise<void>;
}
