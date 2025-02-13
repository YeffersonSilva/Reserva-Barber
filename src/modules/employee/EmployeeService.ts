import { IEmployeeRepository } from '../../repositories/interfaces/IEmployeeRepository';
import { CreateEmployeeDTO } from './dto/CreateEmployeeDTO';
import { UpdateEmployeeDTO } from './dto/UpdateEmployeeDTO';
import { Employee } from '../../entities/Employee';
import { AppError } from '../../error/AppError';
import { hashPassword } from '../../utils/password';

export class EmployeeService {
  constructor(private employeeRepository: IEmployeeRepository) {}

  async createEmployee(data: CreateEmployeeDTO, companyId: number): Promise<Employee> {
    const hashedPassword = await hashPassword(data.password);
    const employee = new Employee(
      0, // ID autogenerado
      data.name,
      data.email,
      hashedPassword,
      companyId,
      'EMPLOYEE'
    );
    return await this.employeeRepository.create(employee);
  }

  async getEmployeeById(id: number): Promise<Employee> {
    const employee = await this.employeeRepository.findById(id);
    if (!employee) {
      throw new AppError("Empleado no encontrado", 404);
    }
    return employee;
  }

  async listEmployees(companyId: number): Promise<Employee[]> {
    return await this.employeeRepository.findAllByCompany(companyId);
  }

  async updateEmployee(id: number, data: UpdateEmployeeDTO): Promise<Employee> {
    // Se podría agregar verificación de existencia si se desea
    return await this.employeeRepository.update(id, data);
  }

  async deleteEmployee(id: number): Promise<void> {
    await this.employeeRepository.delete(id);
  }
}
