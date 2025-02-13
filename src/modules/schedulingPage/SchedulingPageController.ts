import { Request, Response, NextFunction } from 'express';
import { SchedulingPageService } from './SchedulingPageService';
import { CreateSchedulingPageDTO } from './dto/CreateSchedulingPageDTO';
import { UpdateSchedulingPageDTO } from './dto/UpdateSchedulingPageDTO';

export class SchedulingPageController {
  constructor(private schedulingPageService: SchedulingPageService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateSchedulingPageDTO = req.body;
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new Error("Información de empresa no encontrada en la solicitud");
      }
      const page = await this.schedulingPageService.createSchedulingPage(data, companyId);
      res.status(201).json(page);
    } catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new Error("Información de empresa no encontrada en la solicitud");
      }
      const page = await this.schedulingPageService.getSchedulingPageByCompany(companyId);
      res.status(200).json(page);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new Error("Información de empresa no encontrada en la solicitud");
      }
      const data: UpdateSchedulingPageDTO = req.body;
      const page = await this.schedulingPageService.updateSchedulingPage(companyId, data);
      res.status(200).json(page);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new Error("Información de empresa no encontrada en la solicitud");
      }
      await this.schedulingPageService.deleteSchedulingPage(companyId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // Nuevo método para generar y devolver el link personalizado
  async getLink(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new Error("Información de empresa no encontrada en la solicitud");
      }
      const page = await this.schedulingPageService.getSchedulingPageByCompany(companyId);
      if (!page.slug) {
        throw new Error("No se ha configurado un slug para la página de agendamiento");
      }
      // Usar la variable de entorno FRONTEND_URL como base para el link
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
      const link = `${baseUrl}/schedule/${page.slug}`;
      res.status(200).json({ link });
    } catch (error) {
      next(error);
    }
  }
}
