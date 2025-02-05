import { IOperatingHoursRepository } from '../../repositories/interfaces/IOperatingHoursRepository';
import { CreateOperatingHourDTO } from './dto/CreateOperatingHourDTO';
import { UpdateOperatingHourDTO } from './dto/UpdateOperatingHourDTO';
import { OperatingHour } from '../../entities/OperatingHour';
import { AppError } from '../../error/AppError';

export class OperatingHoursService {
  constructor(private operatingHoursRepository: IOperatingHoursRepository) {}

  async createOperatingHour(data: CreateOperatingHourDTO): Promise<OperatingHour> {
    const operatingHour = new OperatingHour(
      0, // ID autogenerado por la BD
      data.dayOfWeek,
      data.openTime,
      data.closeTime
    );
    return await this.operatingHoursRepository.create(operatingHour);
  }

  async getOperatingHourById(id: number): Promise<OperatingHour> {
    const hour = await this.operatingHoursRepository.findById(id);
    if (!hour) {
      throw new AppError("Horario no encontrado", 404);
    }
    return hour;
  }

  async listOperatingHours(): Promise<OperatingHour[]> {
    return await this.operatingHoursRepository.findAll();
  }

  async updateOperatingHour(id: number, data: UpdateOperatingHourDTO): Promise<OperatingHour> {
    // Validamos la existencia del registro
    await this.getOperatingHourById(id);
    return await this.operatingHoursRepository.update(id, data);
  }

  async deleteOperatingHour(id: number): Promise<void> {
    // Validamos la existencia del registro
    await this.getOperatingHourById(id);
    return await this.operatingHoursRepository.delete(id);
  }
}
