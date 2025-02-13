// src/modules/dashboard/DashboardController.ts
import { Request, Response, NextFunction } from 'express';
import { DashboardService } from './DashboardService';

export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  // Endpoint para obtener el resumen de citas
  async getSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new Error("Información de empresa no encontrada en la solicitud");
      }
      const summary = await this.dashboardService.getAppointmentSummary(companyId);
      res.status(200).json(summary);
    } catch (error) {
      next(error);
    }
  }

  // Endpoint para obtener las próximas citas
  async getUpcoming(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new Error("Información de empresa no encontrada en la solicitud");
      }
      const upcoming = await this.dashboardService.getUpcomingAppointments(companyId);
      res.status(200).json(upcoming);
    } catch (error) {
      next(error);
    }
  }
}
