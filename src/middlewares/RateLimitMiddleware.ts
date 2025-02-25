import { Request, Response, NextFunction } from "express";
import { RateLimitService } from "../services/RateLimitService";
import { SecurityAuditLogger } from "../services/SecurityAuditService";

interface RateLimitOptions {
  windowMs: number;
  maxRequestsPerIp: number;
  maxRequestsPerUser: number;
}

const defaultOptions: RateLimitOptions = {
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequestsPerIp: 100,
  maxRequestsPerUser: 200
};

export const createRateLimiter = (options: Partial<RateLimitOptions> = {}) => {
  const opts = { ...defaultOptions, ...options };

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const clientIp = req.ip || req.socket.remoteAddress || "0.0.0.0";
    const userId = req.user?.id;

    try {
      // Verificar límite por IP
      const ipKey = RateLimitService.generateKey(clientIp, "ip");
      const ipLimit = await RateLimitService.incrementAndCheckLimit(
        ipKey,
        opts.maxRequestsPerIp,
        opts.windowMs
      );

      // Si hay usuario autenticado, verificar también su límite
      if (userId) {
        const userKey = RateLimitService.generateKey(userId.toString(), "user");
        const userLimit = await RateLimitService.incrementAndCheckLimit(
          userKey,
          opts.maxRequestsPerUser,
          opts.windowMs
        );

        // Si cualquiera de los límites se excede, bloquear la solicitud
        if (!ipLimit.allowed || !userLimit.allowed) {
          await SecurityAuditLogger.logSecurityEvent({
            type: "ACCESS_DENIED",
            ip: clientIp,
            userId,
            success: false,
            details: {
              reason: "Rate limit exceeded",
              ipRemaining: ipLimit.remaining,
              userRemaining: userLimit.remaining
            }
          });

          res.status(429).json({
            status: "error",
            message: "Demasiadas solicitudes. Por favor, intente más tarde.",
            ipRemaining: ipLimit.remaining,
            userRemaining: userLimit.remaining
          });
          return;
        }

        // Establecer headers de rate limit
        res.setHeader("X-RateLimit-Remaining-IP", ipLimit.remaining.toString());
        res.setHeader("X-RateLimit-Remaining-User", userLimit.remaining.toString());
      } else {
        // Solo verificar límite por IP para usuarios no autenticados
        if (!ipLimit.allowed) {
          await SecurityAuditLogger.logSecurityEvent({
            type: "ACCESS_DENIED",
            ip: clientIp,
            success: false,
            details: {
              reason: "IP rate limit exceeded",
              ipRemaining: ipLimit.remaining
            }
          });

          res.status(429).json({
            status: "error",
            message: "Demasiadas solicitudes. Por favor, intente más tarde.",
            remaining: ipLimit.remaining
          });
          return;
        }

        res.setHeader("X-RateLimit-Remaining", ipLimit.remaining.toString());
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Rate limiter global
export const rateLimitMiddleware = createRateLimiter();

// Rate limiter específico para login con límites más estrictos
export const loginLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hora
  maxRequestsPerIp: 5,
  maxRequestsPerUser: 5
});
