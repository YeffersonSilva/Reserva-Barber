import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { checkTokenBlacklist } from "../utils/tokenBlacklist";

interface CustomJwtPayload {
  id: number;
  role: "ADMIN" | "MANAGER" | "USER" | "COMPANY_ADMIN" | "EMPLOYEE";
  companyId?: number;
}

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "No se proporcionó token de autenticación",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as CustomJwtPayload;

    // Verificar si el token está en la lista negra (tokens revocados)
    const isBlacklisted = await checkTokenBlacklist(token);
    if (isBlacklisted) {
      return res.status(401).json({
        status: "error",
        message: "Token inválido o expirado",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Token inválido o expirado",
    });
  }
};
