import { Request, Response, NextFunction } from "express";

export const parameterPollutionMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const cleanParams = (obj: any): any => {
    for (let key in obj) {
      if (Array.isArray(obj[key])) {
        obj[key] = obj[key][0]; // Tomar solo el primer valor
      }
    }
    return obj;
  };

  req.query = cleanParams(req.query);
  req.body = cleanParams(req.body);
  next();
}; 