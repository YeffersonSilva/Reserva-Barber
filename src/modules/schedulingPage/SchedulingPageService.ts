import { ISchedulingPageRepository } from '../../repositories/interfaces/ISchedulingPageRepository';
import { CreateSchedulingPageDTO } from './dto/CreateSchedulingPageDTO';
import { UpdateSchedulingPageDTO } from './dto/UpdateSchedulingPageDTO';
import { SchedulingPage } from '../../entities/SchedulingPage';
import { AppError } from '../../error/AppError';

// Función simple para generar un slug único
const generateSlug = (companyId: number): string => {
  // Por ejemplo, se puede generar un slug usando el companyId y un timestamp
  return `company-${companyId}-${Date.now()}`;
};

export class SchedulingPageService {
  constructor(private schedulingPageRepository: ISchedulingPageRepository) {}

  async createSchedulingPage(data: CreateSchedulingPageDTO, companyId: number): Promise<SchedulingPage> {
    const existing = await this.schedulingPageRepository.findByCompanyId(companyId);
    if(existing) {
      throw new AppError("La página de agendamiento ya existe para esta empresa", 400);
    }
    
    // Si no se proporciona un slug, se genera uno automáticamente
    const slug = data.slug || generateSlug(companyId);

    const page = new SchedulingPage(
      0, // ID generado por la BD
      companyId,
      slug,
      data.background || null,
      data.title || null,
      data.description || null,
      data.customCss || null,
      data.customJs || null
    );
    return await this.schedulingPageRepository.create(page);
  }

  async getSchedulingPageByCompany(companyId: number): Promise<SchedulingPage> {
    const page = await this.schedulingPageRepository.findByCompanyId(companyId);
    if (!page) {
      throw new AppError("Página de agendamiento no encontrada", 404);
    }
    return page;
  }

  async updateSchedulingPage(companyId: number, data: UpdateSchedulingPageDTO): Promise<SchedulingPage> {
    // Se puede permitir actualizar el slug, pero debe ser único (validación a nivel de base de datos)
    await this.getSchedulingPageByCompany(companyId);
    return await this.schedulingPageRepository.update(companyId, data);
  }

  async deleteSchedulingPage(companyId: number): Promise<void> {
    await this.getSchedulingPageByCompany(companyId);
    return await this.schedulingPageRepository.delete(companyId);
  }
}
