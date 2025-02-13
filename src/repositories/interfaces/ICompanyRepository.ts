import { Company } from '../../entities/Company';

export interface ICompanyRepository {
  create(company: Company): Promise<Company>;
  findById(id: number): Promise<Company | null>;
  findAll(): Promise<Company[]>;
  update(id: number, data: Partial<Company>): Promise<Company>;
  delete(id: number): Promise<void>;
}
