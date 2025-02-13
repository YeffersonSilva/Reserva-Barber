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
}
