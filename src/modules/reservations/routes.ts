import { Router } from 'express';
import { ReservationController } from './ReservationController';
import { PrismaReservationRepository } from '../../repositories/implementations/PrismaReservationRepository';
import { ReservationService } from './ReservationService';
import { authMiddleware } from '../../middlewares/auth.middleware';
import validateRoutePayload from '../../middlewares/validateRoutePayload';
import { CreateReservationSchema } from './dto/CreateReservationDTO';
import { UpdateReservationSchema } from './dto/UpdateReservationDTO';

const router = Router();

// Instanciar repositorio, servicio y controlador
const reservationRepository = new PrismaReservationRepository();
const reservationService = new ReservationService(reservationRepository);
const reservationController = new ReservationController(reservationService);

// Se usa authMiddleware para asegurar que el usuario esté autenticado en todas las rutas de reservas
router.use(authMiddleware);

// Crear una reserva
router.post(
  '/',
  validateRoutePayload(CreateReservationSchema),
  (req, res, next) => reservationController.create(req, res, next)
);

// Listar reservas
// Si se pasa el query parameter "mine=true", se retornarán solo las reservas del usuario autenticado
router.get('/', (req, res, next) => reservationController.list(req, res, next));

// Obtener detalle de una reserva por ID
router.get('/:id', (req, res, next) => reservationController.getById(req, res, next));

// Actualizar una reserva (por ejemplo, para actualizar el estado)
router.put(
  '/:id',
  validateRoutePayload(UpdateReservationSchema),
  (req, res, next) => reservationController.update(req, res, next)
);

// Eliminar una reserva (el usuario solo podrá eliminar sus propias reservas, a menos que sea ADMIN)
router.delete('/:id', (req, res, next) => reservationController.delete(req, res, next));

export default router;
