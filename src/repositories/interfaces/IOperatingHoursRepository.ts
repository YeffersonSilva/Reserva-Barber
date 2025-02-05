import { OperatingHour } from '../../entities/OperatingHour';

export interface IOperatingHoursRepository {
  create(operatingHour: OperatingHour): Promise<OperatingHour>;
  findById(id: number): Promise<OperatingHour | null>;
  findAll(): Promise<OperatingHour[]>;
  update(id: number, data: Partial<OperatingHour>): Promise<OperatingHour>;
  delete(id: number): Promise<void>;
}
