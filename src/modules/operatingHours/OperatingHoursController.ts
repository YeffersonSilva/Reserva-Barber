import { Request, Response, NextFunction } from 'express';
import { OperatingHoursService } from './OperatingHoursService';
import { CreateOperatingHourDTO } from './dto/CreateOperatingHourDTO';
import { UpdateOperatingHourDTO } from './dto/UpdateOperatingHourDTO';

export class OperatingHoursController {
  constructor(private operatingHoursService: OperatingHoursService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateOperatingHourDTO = req.body;
      const operatingHour = await this.operatingHoursService.createOperatingHour(data);
      res.status(201).json(operatingHour);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const operatingHour = await this.operatingHoursService.getOperatingHourById(id);
      res.status(200).json(operatingHour);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hours = await this.operatingHoursService.listOperatingHours();
      res.status(200).json(hours);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data: UpdateOperatingHourDTO = req.body;
      const updated = await this.operatingHoursService.updateOperatingHour(id, data);
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.operatingHoursService.deleteOperatingHour(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
