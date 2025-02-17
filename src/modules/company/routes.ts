// src/modules/company/routes.ts
import { Router } from 'express';
import { CompanyController } from './CompanyController';
import { PrismaCompanyRepository } from '../../repositories/implementations/PrismaCompanyRepository';
import { CompanyService } from './CompanyService';
import { AuthService } from '../auth/AuthService';
import { PrismaUserRepository } from '../../repositories/implementations/PrismaUserRepository';
import validateRoutePayload from '../../middlewares/validateRoutePayload';
import { CreateCompanySchema } from './dto/CreateCompanyDTO';
import { UpdateCompanySchema } from './dto/UpdateCompanyDTO';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();

// Instanciar repositorios y servicios
const companyRepository = new PrismaCompanyRepository();
const companyService = new CompanyService(companyRepository);

// Instanciar AuthService pasando el repositorio de usuario
const userRepository = new PrismaUserRepository();
const authService = new AuthService(userRepository);

// Instanciar el controlador pasando tanto companyService como authService
const companyController = new CompanyController(companyService, authService);

// Rutas
router.post(
  '/',
  authMiddleware,
  requireRole(['ADMIN']), // Para crear, solo ADMIN (o según tu lógica)
  validateRoutePayload(CreateCompanySchema),
  (req, res, next) => companyController.create(req, res, next)
);

router.get('/:id', authMiddleware, (req, res, next) => companyController.getById(req, res, next));
router.get('/', authMiddleware, (req, res, next) => companyController.list(req, res, next));

// Actualizar: permitimos tanto COMPANY_ADMIN como ADMIN
router.put(
  '/:id',
  authMiddleware,
  requireRole(['COMPANY_ADMIN', 'ADMIN']),
  validateRoutePayload(UpdateCompanySchema),
  (req, res, next) => companyController.update(req, res, next)
);

router.delete(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN']),
  (req, res, next) => companyController.delete(req, res, next)
);

export default router;
