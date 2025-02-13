import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from './AppointmentService';
import { CreateAppointmentDTO } from './dto/CreateAppointmentDTO';
import { UpdateAppointmentDTO } from './dto/UpdateAppointmentDTO';

export class AppointmentController {
  constructor(private appointmentService: AppointmentService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateAppointmentDTO = req.body;
      // Se asume que el middleware de autenticación añade "user" al request
      const userId = req.user?.id;
      const companyId = req.user?.companyId;
      if (!userId || !companyId) {
        throw new Error("Datos del usuario incompletos en la solicitud");
      }
      const appointment = await this.appointmentService.createAppointment(data, userId, companyId);
      res.status(201).json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const appointment = await this.appointmentService.getAppointmentById(id);
      res.status(200).json(appointment);
    } catch (error) {
      next(error);
    }
  }

  // Método actualizado para admitir filtros vía query parameters:
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new Error("Información de empresa no encontrada en la solicitud");
      }
      const { date, status, mine } = req.query;
      let appointments;
      // Si se pasa "mine=true", listar solo las citas del usuario autenticado
      if (mine === 'true') {
        const userId = req.user?.id;
        if (!userId) {
          throw new Error("Usuario no encontrado en la solicitud");
        }
        appointments = await this.appointmentService.listAppointmentsByUser(userId);
      } else if (date || status) {
        // Si se pasan filtros (fecha y/o estado)
        appointments = await this.appointmentService.listAppointmentsWithFilters(companyId, {
          date: date ? String(date) : undefined,
          status: status ? String(status) : undefined,
        });
      } else {
        appointments = await this.appointmentService.listAppointmentsByCompany(companyId);
      }
      res.status(200).json(appointments);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data: UpdateAppointmentDTO = req.body;
      const updated = await this.appointmentService.updateAppointment(id, data);
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
      await this.appointmentService.deleteAppointment(id, userId, isAdmin);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
