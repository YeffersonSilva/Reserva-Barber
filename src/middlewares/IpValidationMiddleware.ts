import { Request, Response, NextFunction } from "express";
import { IpBlockingService } from "../services/IpBlockingService";
import { SecurityAuditLogger } from "../services/SecurityAuditService";

export const ipValidationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const clientIp = req.ip || req.socket.remoteAddress || "0.0.0.0";

  try {
    // Verificar si la IP está bloqueada
    const isBlocked = await IpBlockingService.isIpBlocked(clientIp);
    if (isBlocked) {
      const reason = await IpBlockingService.getBlockReason(clientIp);
      SecurityAuditLogger.logSecurityEvent({
        type: "ACCESS_DENIED",
        ip: clientIp,
        success: false,
        details: { reason },
      });

      res.status(403).json({
        status: "error",
        message: "IP bloqueada por actividad sospechosa",
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};
