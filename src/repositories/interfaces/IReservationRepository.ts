import { Reservation } from '../../entities/Reservation';

export interface IReservationRepository {
  create(reservation: Reservation): Promise<Reservation>;
  findById(id: number): Promise<Reservation | null>;
  findAll(): Promise<Reservation[]>;
  update(id: number, data: Partial<Reservation>): Promise<Reservation>;
  delete(id: number): Promise<void>;
  findByUserId(userId: number): Promise<Reservation[]>;
}
