import prisma from '../../config/dbConfig';
import { Company } from '../../entities/Company';
import { ICompanyRepository } from '../interfaces/ICompanyRepository';

export class PrismaCompanyRepository implements ICompanyRepository {
  async create(company: Company): Promise<Company> {
    const created = await prisma.company.create({
      data: {
        name: company.name,
        logo: company.logo || null,
        primaryColor: company.primaryColor || null,
        secondaryColor: company.secondaryColor || null,
      },
    });
    return new Company(
      created.id,
      created.name,
      created.logo,
      created.primaryColor,
      created.secondaryColor,
  
    );
  }

  async findById(id: number): Promise<Company | null> {
    const found = await prisma.company.findUnique({ where: { id } });
    if (!found) return null;
    return new Company(
      found.id,
      found.name,
      found.logo,
      found.primaryColor,
      found.secondaryColor,
    
    );
  }

  async findAll(): Promise<Company[]> {
    const companies = await prisma.company.findMany();
    return companies.map(c => new Company(
      c.id,
      c.name,
      c.logo,
      c.primaryColor,
      c.secondaryColor,
     
    ));
  }

  async update(id: number, data: Partial<Company>): Promise<Company> {
    const updated = await prisma.company.update({
      where: { id },
      data: {
        name: data.name,
        logo: data.logo,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
      },
    });
    return new Company(
      updated.id,
      updated.name,
      updated.logo,
      updated.primaryColor,
      updated.secondaryColor,
   
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.company.delete({ where: { id } });
  }
}
