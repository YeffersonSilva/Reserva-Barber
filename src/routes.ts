// src/routes.ts
import { Router } from 'express';
import authRoutes from './modules/auth/routes';
import companyRoutes from './modules/company/routes';
import employeeRoutes from './modules/employee/routes';
import serviceRoutes from './modules/services/routes';
import operatingHoursRoutes from './modules/operatingHours/routes';
import reservationRoutes from './modules/reservations/routes';
import schedulingPageRoutes from './modules/schedulingPage/routes';
import dashboardRoutes from './modules/dashboard/routes';
import appointments from './modules/appointments/routes';
import path from 'path';
import express from 'express';

const routes = Router();

// Servir archivos estáticos (por ejemplo, imágenes subidas)
routes.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Rutas de autenticación
routes.use('/auth', authRoutes);

// Rutas para la gestión de empresas
routes.use('/companies', companyRoutes);

// Rutas para la gestión de empleados
routes.use('/employees', employeeRoutes);

// Rutas para la gestión de servicios
routes.use('/services', serviceRoutes);

// Rutas para la gestión de horarios operativos
routes.use('/operating-hours', operatingHoursRoutes);

// Rutas para la gestión de citas/reservas
routes.use('/reservations', reservationRoutes);

// Rutas para la configuración de la página de agendamiento (SchedulingPage)
routes.use('/scheduling-page', schedulingPageRoutes);

// Rutas para el dashboard de administración
routes.use('/dashboard', dashboardRoutes);

// Rutas para la gestión de citas
routes.use('/appointments', appointments);

export default routes;
