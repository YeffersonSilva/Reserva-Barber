import { ICompanyRepository } from '../../repositories/interfaces/ICompanyRepository';
import { CreateCompanyDTO } from './dto/CreateCompanyDTO';
import { UpdateCompanyDTO } from './dto/UpdateCompanyDTO';
import { Company } from '../../entities/Company';
import { AppError } from '../../error/AppError';

export class CompanyService {
  constructor(private companyRepository: ICompanyRepository) {}

  async createCompany(data: CreateCompanyDTO): Promise<Company> {
    const company = new Company(
      0, // ID generado por la BD
      data.name,
      data.logo || null,
      data.primaryColor || null,
      data.secondaryColor || null
    );
    return await this.companyRepository.create(company);
  }

  async getCompanyById(id: number): Promise<Company> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new AppError("Empresa no encontrada", 404);
    }
    return company;
  }

  async listCompanies(): Promise<Company[]> {
    return await this.companyRepository.findAll();
  }

  async updateCompany(id: number, data: UpdateCompanyDTO): Promise<Company> {
    // Verificar existencia
    await this.getCompanyById(id);
    return await this.companyRepository.update(id, data);
  }

  async deleteCompany(id: number): Promise<void> {
    // Verificar existencia
    await this.getCompanyById(id);
    await this.companyRepository.delete(id);
  }
}
