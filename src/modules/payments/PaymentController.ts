import { Request, Response, NextFunction } from "express";
import { PaymentService } from "./PaymentService";
import { CreatePaymentDTO } from "./dto/CreatePaymentDTO";
import { AppError } from "../../error/AppError";
import { SecurityAuditLogger } from "../../services/SecurityAuditService";

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  async createPaymentIntent(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const data: CreatePaymentDTO = req.body;
      const userId = req.user?.id;
      const companyId = req.user?.companyId;

      if (!userId || !companyId) {
        throw new AppError("Usuario no autenticado", 401);
      }

      const result = await this.paymentService.createPaymentIntent(
        data,
        userId,
        companyId
      );

      await SecurityAuditLogger.logSecurityEvent({
        type: "DATA_MODIFICATION",
        userId,
        ip: req.ip || "unknown",
        success: true,
        details: {
          action: "payment_intent_created",
          paymentIntentId: result.paymentIntentId,
        },
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async capturePayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { paymentIntentId } = req.params;
      const userId = req.user?.id;

      const result = await this.paymentService.capturePayment(paymentIntentId);

      await SecurityAuditLogger.logSecurityEvent({
        type: "DATA_MODIFICATION",
        userId,
        ip: req.ip || "unknown",
        success: true,
        details: {
          action: "payment_captured",
          paymentIntentId,
        },
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async cancelPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { paymentIntentId } = req.params;
      const userId = req.user?.id;

      const result = await this.paymentService.cancelPayment(paymentIntentId);

      await SecurityAuditLogger.logSecurityEvent({
        type: "DATA_MODIFICATION",
        userId,
        ip: req.ip || "unknown",
        success: true,
        details: {
          action: "payment_cancelled",
          paymentIntentId,
        },
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async refundPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { paymentIntentId } = req.params;
      const { amount } = req.body;
      const userId = req.user?.id;

      const result = await this.paymentService.refundPayment(
        paymentIntentId,
        amount
      );

      await SecurityAuditLogger.logSecurityEvent({
        type: "DATA_MODIFICATION",
        userId,
        ip: req.ip || "unknown",
        success: true,
        details: {
          action: "payment_refunded",
          paymentIntentId,
          amount,
        },
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const signature = req.headers["stripe-signature"] as string;
      await this.paymentService.handleWebhookEvent(req.body, signature);
      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  }

  async listPaymentMethods(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { customerId } = req.params;
      const methods = await this.paymentService.listPaymentMethods(customerId);
      res.json(methods);
    } catch (error) {
      next(error);
    }
  }
}
