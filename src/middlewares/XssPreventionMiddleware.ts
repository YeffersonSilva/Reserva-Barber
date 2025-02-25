import { Request, Response, NextFunction } from "express";
import xss from "xss";

export const xssPreventionMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const cleanValue = (value: any): any => {
    if (typeof value === "string") {
      return xss(value, {
        whiteList: {}, // No permitir ninguna etiqueta HTML
        stripIgnoreTag: true,
        stripIgnoreTagBody: ["script"],
      });
    }
    if (Array.isArray(value)) {
      return value.map((item) => cleanValue(item));
    }
    if (typeof value === "object" && value !== null) {
      return Object.keys(value).reduce(
        (acc, key) => ({
          ...acc,
          [key]: cleanValue(value[key]),
        }),
        {}
      );
    }
    return value;
  };

  req.body = cleanValue(req.body);
  req.query = cleanValue(req.query);
  req.params = cleanValue(req.params);

  next();
};
