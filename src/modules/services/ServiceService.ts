// src/modules/services/ServiceService.ts
import { IServiceRepository } from '../../repositories/interfaces/IServiceRepository';
import { CreateServiceDTO } from './dto/CreateServiceDTO';
import { UpdateServiceDTO } from './dto/UpdateServiceDTO';
import { Service } from '../../entities/Service';
import { AppError } from '../../error/AppError';

export class ServiceService {
  constructor(private serviceRepository: IServiceRepository) {}

  async createService(data: CreateServiceDTO, companyId: number): Promise<Service> {
    const service = new Service(
      0, // ID se genera en la base de datos
      companyId,
      data.name,
      data.description,
      data.duration,
      true
    );
    return await this.serviceRepository.create(service);
  }

  async getServiceById(id: number): Promise<Service> {
    const service = await this.serviceRepository.findById(id);
    if (!service) {
      throw new AppError("Servicio no encontrado", 404);
    }
    return service;
  }

  async listServices(companyId: number): Promise<Service[]> {
    return await this.serviceRepository.findAllByCompany(companyId);
  }

  async updateService(id: number, data: UpdateServiceDTO): Promise<Service> {
    // Verificar existencia
    await this.getServiceById(id);
    return await this.serviceRepository.update(id, data);
  }

  async deleteService(id: number): Promise<void> {
    await this.getServiceById(id);
    await this.serviceRepository.delete(id);
  }
}
