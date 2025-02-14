import { Request, Response, NextFunction } from "express";
import { CompanyService } from "./CompanyService";
import { CreateCompanyDTO } from "./dto/CreateCompanyDTO";
import { UpdateCompanyDTO } from "./dto/UpdateCompanyDTO";
import { AuthService } from "../auth/AuthService";

export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private authService: AuthService
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreateCompanyDTO = req.body;
      // Crear la empresa
      const company = await this.companyService.createCompany(data);

      // Actualizar el usuario que creó la empresa para asignarle el companyId
      const userId = req.user?.id;
      if (userId) {
        await this.authService.updateUserCompany(userId, company.id);
      }

      res.status(201).json(company);
    } catch (error) {
      next(error);
    }
  }

  async getById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = Number(req.params.id);
      const company = await this.companyService.getCompanyById(id);
      res.status(200).json(company);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const companies = await this.companyService.listCompanies();
      res.status(200).json(companies);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const data: UpdateCompanyDTO = req.body;
      const updatedCompany = await this.companyService.updateCompany(id, data);
      res.status(200).json(updatedCompany);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.companyService.deleteCompany(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
