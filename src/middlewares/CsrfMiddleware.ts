import { Request, Response, NextFunction } from "express";
import csrf from "csurf";

export const csrfProtection = csrf({ 
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict"
  } 
});

export const csrfErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err.code !== "EBADCSRFTOKEN") return next(err);
  res.status(403).json({
    status: "error",
    message: "Invalid CSRF token"
  });
}; 