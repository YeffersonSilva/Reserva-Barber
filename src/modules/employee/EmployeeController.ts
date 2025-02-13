import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from './EmployeeService';
import { CreateEmployeeDTO } from './dto/CreateEmployeeDTO';
import { UpdateEmployeeDTO } from './dto/UpdateEmployeeDTO';

export class EmployeeController {
  constructor(private employeeService: EmployeeService) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateEmployeeDTO = req.body;
      // Se asume que req.user tiene companyId (por ejemplo, del usuario COMPANY_ADMIN)
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new Error("Información de empresa no encontrada en la solicitud");
      }
      const employee = await this.employeeService.createEmployee(data, companyId);
      res.status(201).json(employee);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const employee = await this.employeeService.getEmployeeById(id);
      res.status(200).json(employee);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companyId = req.user?.companyId;
      if (!companyId) {
        throw new Error("Información de empresa no encontrada en la solicitud");
      }
      const employees = await this.employeeService.listEmployees(companyId);
      res.status(200).json(employees);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data: UpdateEmployeeDTO = req.body;
      const updated = await this.employeeService.updateEmployee(id, data);
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.employeeService.deleteEmployee(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
