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
import { sqlInjectionPreventionMiddleware } from "./middlewares/SqlInjectionPreventionMiddleware";
import { xssPreventionMiddleware } from "./middlewares/XssPreventionMiddleware";
import { ipValidationMiddleware } from "./middlewares/IpValidationMiddleware";
import { httpMethodValidationMiddleware } from "./middlewares/HttpMethodValidationMiddleware";
import helmet from "helmet";
import { csrfProtection, csrfErrorHandler } from "./middlewares/CsrfMiddleware";
import { parameterPollutionMiddleware } from "./middlewares/ParameterPollutionMiddleware";
import { jsonValidationMiddleware } from "./middlewares/JsonValidationMiddleware";
import cookieParser from "cookie-parser";
import swaggerSetup from "./config/swagger";

const app = express();

// Configuraciones básicas
app.use(helmet());
app.use(express.json({ limit: "10kb" })); // Limitar tamaño de payload
app.use(jsonValidationMiddleware);

// Configurar headers de seguridad
configureSecurityHeaders(app);

// Middlewares de parseo
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
); // Usar CORS

// Middlewares de seguridad
app.use(ipValidationMiddleware);
app.use(rateLimitMiddleware);
app.use(sqlInjectionPreventionMiddleware);
app.use(xssPreventionMiddleware);
app.use(sanitizeMiddleware);
app.use(httpMethodValidationMiddleware());
app.use(cookieParser());
app.use(csrfProtection);
app.use(csrfErrorHandler);
app.use(parameterPollutionMiddleware);

// Rate limiting específico para login
app.use("/api/auth/login", loginLimiter);

// Configurar Swagger para documentar la API
swaggerSetup(app);

app.use("/", routes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

export default app;
