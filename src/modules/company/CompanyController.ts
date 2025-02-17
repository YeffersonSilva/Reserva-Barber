// src/modules/company/CompanyController.ts
import { Request, Response, NextFunction } from "express";
import { CompanyService } from "./CompanyService";
import { CreateCompanyDTO } from "./dto/CreateCompanyDTO";
import { UpdateCompanyDTO } from "./dto/UpdateCompanyDTO";
import { AuthService } from "../auth/AuthService";
import { PrismaUserRepository } from "../../repositories/implementations/PrismaUserRepository";
import { signToken } from "../../utils/token";

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

      const userId = req.user?.id;
      if (userId) {
        // Actualizar el usuario asignándole el companyId
        await this.authService.updateUserCompany(userId, company.id);

        // Recuperar el usuario actualizado para tener el companyId actualizado
        const userRepository = new PrismaUserRepository();
        const updatedUser = await userRepository.findById(userId);
        if (!updatedUser) {
          throw new Error("Usuario no encontrado después de actualizar la empresa");
        }

        // Generar un nuevo token JWT con la información actualizada
        const payload = {
          id: updatedUser.id,
          role: updatedUser.role,
          companyId: updatedUser.companyId,
        };
        const newToken = signToken(payload, "15m");
        const newRefreshToken = signToken(payload, "3d");

        // Enviar la respuesta sin usar return, ya que el método retorna void
        res.status(201).json({
          company,
          token: newToken,
          refreshToken: newRefreshToken,
        });
        return;
      }

      res.status(201).json(company);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
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
