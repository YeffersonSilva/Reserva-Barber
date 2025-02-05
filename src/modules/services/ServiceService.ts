import { IServiceRepository } from '../../repositories/interfaces/IServiceRepository';
import { CreateServiceDTO } from './dto/CreateServiceDTO';
import { UpdateServiceDTO } from './dto/UpdateServiceDTO';
import { Service } from '../../entities/Service';
import { AppError } from '../../error/AppError';

export class ServiceService {
  constructor(private serviceRepository: IServiceRepository) {}

  async createService(data: CreateServiceDTO): Promise<Service> {
    const service = new Service(
      0, // El ID se asigna automáticamente
      data.name,
      data.description,
      data.price,
      data.duration
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

  async listServices(): Promise<Service[]> {
    return await this.serviceRepository.findAll();
  }

  async updateService(id: number, data: UpdateServiceDTO): Promise<Service> {
    // Validar que el servicio existe
    await this.getServiceById(id);
    return await this.serviceRepository.update(id, data);
  }

  async deleteService(id: number): Promise<void> {
    // Validar que el servicio existe
    await this.getServiceById(id);
    return await this.serviceRepository.delete(id);
  }
}
