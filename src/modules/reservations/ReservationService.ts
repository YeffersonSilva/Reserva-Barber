import { IReservationRepository } from '../../repositories/interfaces/IReservationRepository';
import { CreateReservationDTO } from './dto/CreateReservationDTO';
import { UpdateReservationDTO } from './dto/UpdateReservationDTO';
import { Reservation } from '../../entities/Reservation';
import { AppError } from '../../error/AppError';

export class ReservationService {
  constructor(private reservationRepository: IReservationRepository) {}

  async createReservation(data: CreateReservationDTO, userId: number): Promise<Reservation> {
    const dateTimeParsed = new Date(data.dateTime);
    if (isNaN(dateTimeParsed.getTime())) {
      throw new AppError("Fecha y hora inválidas", 400);
    }

    const reservation = new Reservation(
      0,             // ID se genera en la BD
      userId,
      data.serviceId,
      dateTimeParsed,
      'SCHEDULED'    // Estado por defecto
    );
    return await this.reservationRepository.create(reservation);
  }

  async getReservationById(id: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) {
      throw new AppError("Reserva no encontrada", 404);
    }
    return reservation;
  }

  async listReservations(): Promise<Reservation[]> {
    return await this.reservationRepository.findAll();
  }

  async listReservationsByUser(userId: number): Promise<Reservation[]> {
    return await this.reservationRepository.findByUserId(userId);
  }

  async updateReservation(id: number, data: UpdateReservationDTO): Promise<Reservation> {
    // Se valida la existencia de la reserva
    await this.getReservationById(id);
    return await this.reservationRepository.update(id, data);
  }

  async deleteReservation(id: number, userId: number, isAdmin: boolean): Promise<void> {
    const reservation = await this.getReservationById(id);
    // Permitir eliminación solo si el usuario es admin o es el creador de la reserva
    if (!isAdmin && reservation.userId !== userId) {
      throw new AppError("No autorizado para eliminar esta reserva", 403);
    }
    await this.reservationRepository.delete(id);
  }
}
