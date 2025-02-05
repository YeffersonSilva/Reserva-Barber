import { Router } from 'express';
import { ServiceController } from './ServiceController';
import { PrismaServiceRepository } from '../../repositories/implementations/PrismaServiceRepository';
import { ServiceService } from './ServiceService';
import { requireRole } from '../../middlewares/roleMiddleware';
import validateRoutePayload from '../../middlewares/validateRoutePayload';
import { CreateServiceSchema } from './dto/CreateServiceDTO';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

// Instanciar repositorio, servicio y controlador
const serviceRepository = new PrismaServiceRepository();
const serviceService = new ServiceService(serviceRepository);
const serviceController = new ServiceController(serviceService);

// Ruta para que un ADMIN cree un servicio
router.post(
  '/',
  authMiddleware,         // Verifica que el usuario esté autenticado
  requireRole('ADMIN'),     // Solo los administradores pueden crear servicios
  validateRoutePayload(CreateServiceSchema), // Valida el payload de la petición
  (req, res, next) => serviceController.create(req, res, next)
);

export default router;
