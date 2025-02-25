import { Router } from "express";
import { PaymentController } from "./PaymentController";
import { PaymentService } from "./PaymentService";
import { PrismaAppointmentRepository } from "../../repositories/implementations/PrismaAppointmentRepository";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { requireRole } from "../../middlewares/roleMiddleware";
import validateRoutePayload from "../../middlewares/validateRoutePayload";
import { CreatePaymentSchema, RefundPaymentSchema } from "./dto/CreatePaymentDTO";
import express from "express";
import { paymentRateLimiter } from "./middleware/PaymentRateLimiter";

const router = Router();

const appointmentRepository = new PrismaAppointmentRepository();
const paymentService = new PaymentService(
  appointmentRepository,
  process.env.STRIPE_SECRET_KEY!,
  process.env.STRIPE_WEBHOOK_SECRET!
);
const paymentController = new PaymentController(paymentService);

// Crear intento de pago
router.post(
  "/create-payment-intent",
  authMiddleware,
  paymentRateLimiter,
  validateRoutePayload(CreatePaymentSchema),
  (req, res, next) => paymentController.createPaymentIntent(req, res, next)
);

// Capturar pago
router.post(
  "/capture/:paymentIntentId",
  authMiddleware,
  requireRole(["ADMIN", "COMPANY_ADMIN"]),
  (req, res, next) => paymentController.capturePayment(req, res, next)
);

// Cancelar pago
router.post(
  "/cancel/:paymentIntentId",
  authMiddleware,
  requireRole(["ADMIN", "COMPANY_ADMIN"]),
  (req, res, next) => paymentController.cancelPayment(req, res, next)
);

// Reembolsar pago
router.post(
  "/refund/:paymentIntentId",
  authMiddleware,
  requireRole(["ADMIN", "COMPANY_ADMIN"]),
  validateRoutePayload(RefundPaymentSchema),
  (req, res, next) => paymentController.refundPayment(req, res, next)
);

// Webhook de Stripe
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => paymentController.handleWebhook(req, res, next)
);

// Listar métodos de pago
router.get(
  "/payment-methods/:customerId",
  authMiddleware,
  (req, res, next) => paymentController.listPaymentMethods(req, res, next)
);

export default router; 