import rateLimit from "express-rate-limit";
import { Request, Response, NextFunction } from "express";

export const rateLimitMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // límite de solicitudes
  message: {
    status: "error",
    message:
      "Demasiadas solicitudes desde esta IP, por favor intente más tarde",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware específico para intentos de login
export const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 5, // 5 intentos
  message: {
    status: "error",
    message:
      "Demasiados intentos de inicio de sesión. Intente nuevamente en 1 hora",
  },
});
