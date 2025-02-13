// src/modules/employee/routes.ts
import { Router } from 'express';
import { EmployeeController } from './EmployeeController';
import { PrismaEmployeeRepository } from '../../repositories/implementations/PrismaEmployeeRepository';
import { EmployeeService } from './EmployeeService';
import validateRoutePayload from '../../middlewares/validateRoutePayload';
import { CreateEmployeeSchema } from './dto/CreateEmployeeDTO';
import { UpdateEmployeeSchema } from './dto/UpdateEmployeeDTO';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/roleMiddleware';

const router = Router();

// Instanciar repositorio, servicio y controlador
const employeeRepository = new PrismaEmployeeRepository();
const employeeService = new EmployeeService(employeeRepository);
const employeeController = new EmployeeController(employeeService);

// Permitir acceso a usuarios con rol COMPANY_ADMIN o ADMIN
router.post(
  '/',
  authMiddleware,
  requireRole(['COMPANY_ADMIN', 'ADMIN']),
  validateRoutePayload(CreateEmployeeSchema),
  (req, res, next) => employeeController.create(req, res, next)
);

// Resto de endpoints...
router.get('/:id', authMiddleware, (req, res, next) => employeeController.getById(req, res, next));
router.get('/', authMiddleware, (req, res, next) => employeeController.list(req, res, next));
router.put(
  '/:id',
  authMiddleware,
  requireRole(['COMPANY_ADMIN', 'ADMIN']),
  validateRoutePayload(UpdateEmployeeSchema),
  (req, res, next) => employeeController.update(req, res, next)
);
router.delete('/:id', authMiddleware, requireRole(['COMPANY_ADMIN', 'ADMIN']), (req, res, next) => employeeController.delete(req, res, next));

export default router;
