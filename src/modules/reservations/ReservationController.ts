import { Request, Response, NextFunction } from 'express';
import { ReservationService } from './ReservationService';
import { CreateReservationDTO } from './dto/CreateReservationDTO';
import { UpdateReservationDTO } from './dto/UpdateReservationDTO';

export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateReservationDTO = req.body;
      // Se asume que el middleware de autenticación adjunta al request la propiedad "user"
      const userId = req.user?.id;
      if (!userId) {
        throw new Error("Usuario no encontrado en la solicitud");
      }
      const reservation = await this.reservationService.createReservation(data, userId);
      res.status(201).json(reservation);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const reservation = await this.reservationService.getReservationById(id);
      res.status(200).json(reservation);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      // Si se pasa el query param "mine=true", se listan solo las reservas del usuario autenticado
      if (req.query.mine === 'true') {
        const userId = req.user?.id;
        if (!userId) {
          throw new Error("Usuario no encontrado en la solicitud");
        }
        const reservations = await this.reservationService.listReservationsByUser(userId);
        res.status(200).json(reservations);
      } else {
        const reservations = await this.reservationService.listReservations();
        res.status(200).json(reservations);
      }
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data: UpdateReservationDTO = req.body;
      const updated = await this.reservationService.updateReservation(id, data);
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const userId = req.user?.id;
      const isAdmin = req.user?.role === 'ADMIN';
      if (!userId) {
        throw new Error("Usuario no encontrado en la solicitud");
      }
      await this.reservationService.deleteReservation(id, userId, isAdmin);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
