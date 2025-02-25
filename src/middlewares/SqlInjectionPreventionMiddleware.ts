import { Request, Response, NextFunction } from "express";

export const sqlInjectionPreventionMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const sqlInjectionPattern =
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|WHERE)\b)|(['"])/gi;

  const checkValue = (value: any): boolean => {
    if (typeof value === "string" && sqlInjectionPattern.test(value)) {
      return true;
    }
    if (typeof value === "object" && value !== null) {
      return Object.values(value).some((v) => checkValue(v));
    }
    return false;
  };

  if (checkValue(req.body) || checkValue(req.query) || checkValue(req.params)) {
    res.status(403).json({
      status: "error",
      message: "Detectado posible ataque de SQL Injection",
    });
    return;
  }

  next();
};
