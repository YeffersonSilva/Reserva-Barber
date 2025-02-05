import { Router } from "express";
import authRoutes from "./modules/auth/routes";
import serviceRoutes from "./modules/services/routes";
import operatingHoursRoutes from "./modules/operatingHours/routes"; // Importar rutas de horarios
import path from "path";
import express from "express";

const routes = Router();

routes.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));
routes.use("/auth", authRoutes);
routes.use("/services", serviceRoutes);
routes.use("/operating-hours", operatingHoursRoutes); // Registrar la ruta

export default routes;
