import { Employee } from '../../entities/Employee';

export interface IEmployeeRepository {
  create(employee: Employee): Promise<Employee>;
  findById(id: number): Promise<Employee | null>;
  findAllByCompany(companyId: number): Promise<Employee[]>;
  update(id: number, data: Partial<Employee>): Promise<Employee>;
  delete(id: number): Promise<void>;
}
