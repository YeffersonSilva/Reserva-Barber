import { Request, Response, NextFunction } from "express";
import sanitizeHtml from "sanitize-html";

export const sanitizeMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const sanitizeValue = (value: any): any => {
    if (typeof value === "string") {
      return sanitizeHtml(value, {
        allowedTags: [],
        allowedAttributes: {},
      });
    }
    if (typeof value === "object" && value !== null) {
      Object.keys(value).forEach((key) => {
        value[key] = sanitizeValue(value[key]);
      });
    }
    return value;
  };

  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query);
  req.params = sanitizeValue(req.params);

  next();
};
