import { Request, Response, NextFunction } from "express";

export const jsonValidationMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      status: "error",
      message: "Invalid JSON payload"
    });
    return;
  }
  next();
}; 