// src/modules/operatingHours/routes.ts
import { Router } from 'express';
import { OperatingHoursController } from './OperatingHoursController';
import { PrismaOperatingHoursRepository } from '../../repositories/implementations/PrismaOperatingHoursRepository';
import { OperatingHoursService } from './OperatingHoursService';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { requireRole } from '../../middlewares/roleMiddleware';
import validateRoutePayload from '../../middlewares/validateRoutePayload';
import { CreateOperatingHourSchema } from './dto/CreateOperatingHourDTO';
import { UpdateOperatingHourSchema } from './dto/UpdateOperatingHourDTO';

const router = Router();

// Instanciar repositorio, servicio y controlador
const operatingHoursRepository = new PrismaOperatingHoursRepository();
const operatingHoursService = new OperatingHoursService(operatingHoursRepository);
const operatingHoursController = new OperatingHoursController(operatingHoursService);

// Rutas públicas (listar y obtener por ID)
router.get('/', (req, res, next) => operatingHoursController.list(req, res, next));
router.get('/:id', (req, res, next) => operatingHoursController.getById(req, res, next));

// Rutas protegidas: requieren autenticación y rol ADMIN

// Crear un horario de funcionamiento
router.post(
  '/',
  authMiddleware,
  requireRole(['ADMIN']),
  validateRoutePayload(CreateOperatingHourSchema),
  (req, res, next) => operatingHoursController.create(req, res, next)
);

// Actualizar un horario
router.put(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN']),
  validateRoutePayload(UpdateOperatingHourSchema),
  (req, res, next) => operatingHoursController.update(req, res, next)
);

// Eliminar un horario
router.delete(
  '/:id',
  authMiddleware,
  requireRole(['ADMIN']),
  (req, res, next) => operatingHoursController.delete(req, res, next)
);

export default router;
