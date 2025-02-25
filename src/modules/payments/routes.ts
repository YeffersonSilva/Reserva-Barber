import { Router } from "express";
import { PaymentController } from "./PaymentController";
import { PaymentService } from "./PaymentService";
import { PrismaAppointmentRepository } from "../../repositories/implementations/PrismaAppointmentRepository";
import { authMiddleware } from "../../middlewares/auth.middleware";
import validateRoutePayload from "../../middlewares/validateRoutePayload";
import { CreatePaymentSchema } from "./dto/CreatePaymentDTO";
import express from "express";

const router = Router();

const appointmentRepository = new PrismaAppointmentRepository();
const paymentService = new PaymentService(
  appointmentRepository,
  process.env.STRIPE_SECRET_KEY!,
  process.env.STRIPE_WEBHOOK_SECRET!
);
const paymentController = new PaymentController(paymentService);

router.post(
  "/create-payment-intent",
  authMiddleware,
  validateRoutePayload(CreatePaymentSchema),
  (req, res, next) => paymentController.createPaymentIntent(req, res, next)
);

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res, next) => paymentController.handleWebhook(req, res, next)
);

router.get(
  "/payment-methods/:customerId",
  authMiddleware,
  (req, res, next) => paymentController.listPaymentMethods(req, res, next)
);

export default router; 