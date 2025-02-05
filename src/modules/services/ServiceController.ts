import { Request, Response, NextFunction } from 'express';
import { ServiceService } from './ServiceService';
import { CreateServiceDTO } from './dto/CreateServiceDTO';

export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateServiceDTO = req.body;
      const service = await this.serviceService.createService(data);
      res.status(201).json(service);
    } catch (error) {
      next(error);
    }
  }
}
