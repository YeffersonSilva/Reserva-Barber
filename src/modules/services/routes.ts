// src/modules/services/routes.ts
import { Router } from 'express';
import { ServiceController } from './ServiceController';
import { PrismaServiceRepository } from '../../repositories/implementations/PrismaServiceRepository';
import { ServiceService } from './ServiceService';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/roleMiddleware';
import validateRoutePayload from '../../middlewares/validateRoutePayload';
import { CreateServiceSchema } from './dto/CreateServiceDTO';
import { UpdateServiceSchema } from './dto/UpdateServiceDTO';

const router = Router();

const serviceRepository = new PrismaServiceRepository();
const serviceService = new ServiceService(serviceRepository);
const serviceController = new ServiceController(serviceService);

// Listar servicios de la empresa
router.get('/', authMiddleware, (req, res, next) => serviceController.list(req, res, next));

// Obtener un servicio por ID
router.get('/:id', authMiddleware, (req, res, next) => serviceController.getById(req, res, next));

// Crear un servicio (solo ADMIN o COMPANY_ADMIN)
router.post(
  '/',
  authMiddleware,
  requireRole(['ADMIN', 'COMPANY_ADMIN']),
  validateRoutePayload(CreateServiceSchema),
  (req, res, next) => serviceController.create(req, res, next)
);

// Actualizar un servicio (solo ADMIN o COMPANY_ADMIN)
router.put(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN', 'COMPANY_ADMIN']),
  validateRoutePayload(UpdateServiceSchema),
  (req, res, next) => serviceController.update(req, res, next)
);

// Eliminar un servicio (solo ADMIN o COMPANY_ADMIN)
router.delete(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN', 'COMPANY_ADMIN']),
  (req, res, next) => serviceController.delete(req, res, next)
);

export default router;
