import prisma from '../../config/dbConfig';
import { Employee } from '../../entities/Employee';
import { IEmployeeRepository } from '../interfaces/IEmployeeRepository';

export class PrismaEmployeeRepository implements IEmployeeRepository {
  async create(employee: Employee): Promise<Employee> {
    const created = await prisma.user.create({
      data: {
        name: employee.name,
        email: employee.email,
        password: employee.password, // Asegúrate de que se haya encriptado la contraseña
        role: employee.role,
        companyId: employee.companyId,
      },
    });
    return new Employee(
      created.id,
      created.name,
      created.email,
      created.password,
      created.companyId!,
      created.role as 'EMPLOYEE',
      created.createdAt,
      created.updatedAt
    );
  }

  async findById(id: number): Promise<Employee | null> {
    const found = await prisma.user.findUnique({
      where: { id },
    });
    if (!found || found.role !== 'EMPLOYEE') return null;
    return new Employee(
      found.id,
      found.name,
      found.email,
      found.password,
      found.companyId!,
      found.role as 'EMPLOYEE',
      found.createdAt,
      found.updatedAt
    );
  }

  async findAllByCompany(companyId: number): Promise<Employee[]> {
    const employees = await prisma.user.findMany({
      where: { companyId, role: 'EMPLOYEE' },
    });
    return employees.map(emp => new Employee(
      emp.id,
      emp.name,
      emp.email,
      emp.password,
      emp.companyId!,
      emp.role as 'EMPLOYEE',
      emp.createdAt,
      emp.updatedAt
    ));
  }

  async update(id: number, data: Partial<Employee>): Promise<Employee> {
    const updated = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
    return new Employee(
      updated.id,
      updated.name,
      updated.email,
      updated.password,
      updated.companyId!,
      updated.role as 'EMPLOYEE',
      updated.createdAt,
      updated.updatedAt
    );
  }

  async delete(id: number): Promise<void> {
    await prisma.user.delete({
      where: { id },
    });
  }
}
