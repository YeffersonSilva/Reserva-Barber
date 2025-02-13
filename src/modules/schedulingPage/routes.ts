import { Router } from 'express';
import { SchedulingPageController } from './SchedulingPageController';
import { PrismaSchedulingPageRepository } from '../../repositories/implementations/PrismaSchedulingPageRepository';
import { SchedulingPageService } from './SchedulingPageService';
import validateRoutePayload from '../../middlewares/validateRoutePayload';
import { CreateSchedulingPageSchema } from './dto/CreateSchedulingPageDTO';
import { UpdateSchedulingPageSchema } from './dto/UpdateSchedulingPageDTO';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

const schedulingPageRepository = new PrismaSchedulingPageRepository();
const schedulingPageService = new SchedulingPageService(schedulingPageRepository);
const schedulingPageController = new SchedulingPageController(schedulingPageService);

router.use(authMiddleware);

// Crear la página de agendamiento (con posibilidad de personalización completa)
router.post(
  '/',
  validateRoutePayload(CreateSchedulingPageSchema),
  (req, res, next) => schedulingPageController.create(req, res, next)
);

// Obtener la página de agendamiento de la empresa
router.get('/', (req, res, next) => schedulingPageController.get(req, res, next));

// Actualizar la configuración de la página de agendamiento
router.put(
  '/',
  validateRoutePayload(UpdateSchedulingPageSchema),
  (req, res, next) => schedulingPageController.update(req, res, next)
);

// Eliminar la página de agendamiento
router.delete('/', (req, res, next) => schedulingPageController.delete(req, res, next));

export default router;
