import { Service } from '../../entities/Service';

export interface IServiceRepository {
  create(service: Service): Promise<Service>;
  findById(id: number): Promise<Service | null>;
  findAll(): Promise<Service[]>;
  update(id: number, data: Partial<Service>): Promise<Service>;
  delete(id: number): Promise<void>;
}
