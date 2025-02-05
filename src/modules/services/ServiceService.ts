import { IServiceRepository } from '../../repositories/interfaces/IServiceRepository';
import { CreateServiceDTO } from './dto/CreateServiceDTO';
import { Service } from '../../entities/Service';

export class ServiceService {
  constructor(private serviceRepository: IServiceRepository) {}

  async createService(data: CreateServiceDTO): Promise<Service> {
    // Aquí puedes agregar validaciones o lógica adicional si es necesario
    const service = new Service(
      0, // El ID se genera automáticamente en la base de datos
      data.name,
      data.description,
      data.price,
      data.duration
    );

    const createdService = await this.serviceRepository.create(service);
    return createdService;
  }
}
