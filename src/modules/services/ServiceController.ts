// src/modules/services/ServiceController.ts
import { Request, Response, NextFunction } from 'express';
import { ServiceService } from './ServiceService';
import { CreateServiceDTO } from './dto/CreateServiceDTO';
import { UpdateServiceDTO } from './dto/UpdateServiceDTO';

export class ServiceController {
  constructor(private serviceService: ServiceService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateServiceDTO = req.body;
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new Error("Información de empresa no encontrada en la solicitud");
      }
      const service = await this.serviceService.createService(data, companyId);
      res.status(201).json(service);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const service = await this.serviceService.getServiceById(id);
      res.status(200).json(service);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new Error("Información de empresa no encontrada en la solicitud");
      }
      const services = await this.serviceService.listServices(companyId);
      res.status(200).json(services);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data: UpdateServiceDTO = req.body;
      const updatedService = await this.serviceService.updateService(id, data);
      res.status(200).json(updatedService);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.serviceService.deleteService(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
