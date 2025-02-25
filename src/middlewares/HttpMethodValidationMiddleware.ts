import { Request, Response, NextFunction } from "express";

export const httpMethodValidationMiddleware = (
  allowedMethods: string[] = ["GET", "POST", "PUT", "DELETE"]
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const method = req.method.toUpperCase();

    if (!allowedMethods.includes(method)) {
      res.status(405).json({
        status: "error",
        message: "Método HTTP no permitido",
      });
      return;
    }

    // Agregar headers de métodos permitidos
    res.setHeader("Allow", allowedMethods.join(", "));
    next();
  };
};
