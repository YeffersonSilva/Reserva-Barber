import { Router } from 'express';
import { CompanyController } from './CompanyController';
import { PrismaCompanyRepository } from '../../repositories/implementations/PrismaCompanyRepository';
import { CompanyService } from './CompanyService';
import validateRoutePayload from '../../middlewares/validateRoutePayload';
import { CreateCompanySchema } from './dto/CreateCompanyDTO';
import { UpdateCompanySchema } from './dto/UpdateCompanyDTO';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();

// Instanciar repositorio, servicio y controlador
const companyRepository = new PrismaCompanyRepository();
const companyService = new CompanyService(companyRepository);
const companyController = new CompanyController(companyService);

// Rutas públicas o protegidas según necesidades. Por ejemplo, crear y listar empresas pueden ser accesibles solo a roles ADMIN o COMPANY_ADMIN.

// Crear una empresa (ejemplo: solo ADMIN puede crear empresas)
router.post(
  '/',
  authMiddleware,
  requireRole('ADMIN'),
  validateRoutePayload(CreateCompanySchema),
  (req, res, next) => companyController.create(req, res, next)
);

// Obtener una empresa por ID
router.get('/:id', authMiddleware, (req, res, next) => companyController.getById(req, res, next));

// Listar todas las empresas
router.get('/', authMiddleware, (req, res, next) => companyController.list(req, res, next));

// Actualizar una empresa (por ejemplo, solo COMPANY_ADMIN o ADMIN)
router.put(
  '/:id',
  authMiddleware,
  requireRole('COMPANY_ADMIN'),
  validateRoutePayload(UpdateCompanySchema),
  (req, res, next) => companyController.update(req, res, next)
);

// Eliminar una empresa (solo ADMIN)
router.delete('/:id', authMiddleware, requireRole('ADMIN'), (req, res, next) => companyController.delete(req, res, next));

export default router;
