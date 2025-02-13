// src/modules/dashboard/routes.ts
import { Router } from 'express';
import { DashboardController } from './DashboardController';
import { DashboardService } from './DashboardService';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

const dashboardService = new DashboardService();
const dashboardController = new DashboardController(dashboardService);

// Todas las rutas se protegen con el middleware de autenticación
router.use(authMiddleware);

// Endpoint para obtener resumen de citas
router.get('/summary', (req, res, next) => dashboardController.getSummary(req, res, next));

// Endpoint para obtener próximas citas
router.get('/upcoming', (req, res, next) => dashboardController.getUpcoming(req, res, next));

export default router;
