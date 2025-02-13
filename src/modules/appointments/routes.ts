import { Router } from 'express';
import { AppointmentController } from './AppointmentController';
import { PrismaAppointmentRepository } from '../../repositories/implementations/PrismaAppointmentRepository';
import { AppointmentService } from './AppointmentService';
import { authMiddleware } from '../../middlewares/auth.middleware';
import validateRoutePayload from '../../middlewares/validateRoutePayload';
import { CreateAppointmentSchema } from './dto/CreateAppointmentDTO';
import { UpdateAppointmentSchema } from './dto/UpdateAppointmentDTO';

const router = Router();

// Instanciar repositorio, servicio y controlador
const appointmentRepository = new PrismaAppointmentRepository();
const appointmentService = new AppointmentService(appointmentRepository);
const appointmentController = new AppointmentController(appointmentService);

// Todas las rutas se protegen con el middleware de autenticación
router.use(authMiddleware);

// Crear una cita
router.post(
  '/',
  validateRoutePayload(CreateAppointmentSchema),
  (req, res, next) => appointmentController.create(req, res, next)
);

// Obtener cita por ID
router.get('/:id', (req, res, next) => appointmentController.getById(req, res, next));

// Listar citas filtradas por la empresa del usuario
router.get('/', (req, res, next) => appointmentController.list(req, res, next));

// Actualizar una cita
router.put(
  '/:id',
  validateRoutePayload(UpdateAppointmentSchema),
  (req, res, next) => appointmentController.update(req, res, next)
);

// Eliminar una cita
router.delete('/:id', (req, res, next) => appointmentController.delete(req, res, next));

export default router;
