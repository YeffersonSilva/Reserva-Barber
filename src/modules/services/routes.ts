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

// Instanciar repositorio, servicio y controlador
const serviceRepository = new PrismaServiceRepository();
const serviceService = new ServiceService(serviceRepository);
const serviceController = new ServiceController(serviceService);

// Listar todos los servicios (acceso público o protegido según requerimiento)
router.get('/', (req, res, next) => serviceController.list(req, res, next));

// Obtener un servicio por ID
router.get('/:id', (req, res, next) => serviceController.getById(req, res, next));

// Las siguientes rutas requieren autenticación y rol ADMIN para modificar los servicios

// Crear un servicio
router.post(
  '/',
  authMiddleware,
  requireRole('ADMIN'),
  validateRoutePayload(CreateServiceSchema),
  (req, res, next) => serviceController.create(req, res, next)
);

// Actualizar un servicio
router.put(
  '/:id',
  authMiddleware,
  requireRole('ADMIN'),
  validateRoutePayload(UpdateServiceSchema),
  (req, res, next) => serviceController.update(req, res, next)
);

// Eliminar un servicio
router.delete(
  '/:id',
  authMiddleware,
  requireRole('ADMIN'),
  (req, res, next) => serviceController.delete(req, res, next)
);

export default router;
