import { Request, Response, NextFunction } from "express";
import { PaymentService } from "./PaymentService";
import { CreatePaymentDTO } from "./dto/CreatePaymentDTO";
import { AppError } from "../../error/AppError";

export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  async createPaymentIntent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data: CreatePaymentDTO = req.body;
      const userId = req.user?.id;
      const companyId = req.user?.companyId;

      if (!userId || !companyId) {
        throw new AppError("Usuario no autenticado", 401);
      }

      const result = await this.paymentService.createPaymentIntent(data, userId, companyId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = req.headers["stripe-signature"] as string;
      await this.paymentService.handleWebhookEvent(req.body, signature);
      res.json({ received: true });
    } catch (error) {
      next(error);
    }
  }

  async listPaymentMethods(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const customerId = req.params.customerId;
      const methods = await this.paymentService.listPaymentMethods(customerId);
      res.json(methods);
    } catch (error) {
      next(error);
    }
  }
} 