import express from "express";
import cors from "cors"; // Importa cors
import routes from "./routes";
import { errorHandler } from "./middlewares/ErrorHandler";
import {
  rateLimitMiddleware,
  loginLimiter,
} from "./middlewares/RateLimitMiddleware";
import { sanitizeMiddleware } from "./middlewares/SanitizationMiddleware";
import { configureSecurityHeaders } from "./middlewares/SecurityHeadersMiddleware";

const app = express();

// Configurar headers de seguridad
configureSecurityHeaders(app);

// Aplicar rate limiting global
app.use(rateLimitMiddleware);

// Aplicar sanitización global
app.use(sanitizeMiddleware);

// Aplicar rate limiting específico para login
app.use("/api/auth/login", loginLimiter);

// Configura CORS con las opciones necesarias (puedes personalizarlo)
app.use(
  cors({
    origin(_requestOrigin, callback) {
      callback(null, true);
    },
  })
); // Usar CORS
app.use(express.json());

app.use("/", routes);
app.use(errorHandler);

export default app;
