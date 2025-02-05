import { Service } from '../../entities/Service';

export interface IServiceRepository {
  create(service: Service): Promise<Service>;
  // Puedes agregar otros métodos (find, update, delete, etc.) según sea necesario
}
