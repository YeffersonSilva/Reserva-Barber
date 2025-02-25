import Stripe from "stripe";
import { AppError } from "../../error/AppError";
import { CreatePaymentDTO } from "./dto/CreatePaymentDTO";
import { IAppointmentRepository } from "../../repositories/interfaces/IAppointmentRepository";
import { SecurityAuditLogger } from "../../services/SecurityAuditService";

export class PaymentService {
  private stripe: Stripe;

  constructor(
    private appointmentRepository: IAppointmentRepository,
    private readonly stripeSecretKey: string,
    private readonly stripeWebhookSecret: string
  ) {
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia",
      typescript: true,
    });
  }

  async createPaymentIntent(
    data: CreatePaymentDTO,
    userId: number,
    companyId: number
  ) {
    try {
      const customer = await this.findOrCreateCustomer(userId, data.email);

      // Validar que el monto sea válido (mínimo 50 centavos en BRL)
      if (data.amount < 50) {
        throw new AppError("El monto mínimo es de R$0.50", 400);
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: data.amount,
        currency: "brl",
        customer: customer.id,
        metadata: {
          userId: userId.toString(),
          companyId: companyId.toString(),
          appointmentId: data.appointmentId?.toString() ?? null,
        },
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
        capture_method: "manual", // Permite captura posterior
        setup_future_usage: "off_session", // Permite pagos futuros
        description: data.description || "Pago de cita",
        statement_descriptor: "RESERVABARBER", // Máximo 22 caracteres
      });

      await SecurityAuditLogger.logSecurityEvent({
        type: "DATA_MODIFICATION",
        userId,
        ip: "system",
        success: true,
        details: {
          action: "payment_intent_created",
          paymentIntentId: paymentIntent.id,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        customerId: customer.id,
        paymentIntentId: paymentIntent.id,
      };
    } catch (error: any) {
      throw new AppError(
        `Error al crear intento de pago: ${error.message}`,
        400
      );
    }
  }

  async capturePayment(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.capture(
        paymentIntentId
      );
      return paymentIntent;
    } catch (error: any) {
      throw new AppError(`Error al capturar el pago: ${error.message}`, 400);
    }
  }

  async cancelPayment(paymentIntentId: string) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.cancel(
        paymentIntentId
      );
      return paymentIntent;
    } catch (error: any) {
      throw new AppError(`Error al cancelar el pago: ${error.message}`, 400);
    }
  }

  async refundPayment(paymentIntentId: string, amount?: number) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount,
        reason: "requested_by_customer",
      });
      return refund;
    } catch (error: any) {
      throw new AppError(`Error al reembolsar el pago: ${error.message}`, 400);
    }
  }

  async handleWebhookEvent(payload: any, signature: string) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.stripeWebhookSecret
      );

      switch (event.type) {
        case "payment_intent.succeeded":
          await this.handlePaymentSuccess(event.data.object);
          break;
        case "payment_intent.payment_failed":
          await this.handlePaymentFailure(event.data.object);
          break;
        case "payment_intent.canceled":
          await this.handlePaymentCancellation(event.data.object);
          break;
        case "charge.refunded":
          await this.handleRefund(event.data.object);
          break;
      }
    } catch (error: any) {
      throw new AppError(`Error en webhook: ${error.message}`, 400);
    }
  }

  private async findOrCreateCustomer(userId: number, email: string) {
    try {
      const customers = await this.stripe.customers.list({
        email: email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        return customers.data[0];
      }

      return await this.stripe.customers.create({
        email: email,
        metadata: {
          userId: userId.toString(),
        },
      });
    } catch (error: any) {
      throw new AppError(`Error al gestionar cliente: ${error.message}`, 400);
    }
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const appointmentId = Number(paymentIntent.metadata.appointmentId);
    if (appointmentId) {
      await this.appointmentRepository.update(appointmentId, {
        status: "CONFIRMED",
        paymentStatus: "PAID",
        paymentIntentId: paymentIntent.id,
      });
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const appointmentId = Number(paymentIntent.metadata.appointmentId);
    if (appointmentId) {
      await this.appointmentRepository.update(appointmentId, {
        status: "PAYMENT_FAILED",
        paymentStatus: "FAILED",
      });
    }
  }

  private async handlePaymentCancellation(paymentIntent: Stripe.PaymentIntent) {
    const appointmentId = Number(paymentIntent.metadata.appointmentId);
    if (appointmentId) {
      await this.appointmentRepository.update(appointmentId, {
        status: "CANCELED",
        paymentStatus: "CANCELED",
      });
    }
  }

  private async handleRefund(charge: Stripe.Charge) {
    if (charge.payment_intent) {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        charge.payment_intent as string
      );
      const appointmentId = Number(paymentIntent.metadata.appointmentId);

      if (appointmentId) {
        await this.appointmentRepository.update(appointmentId, {
          status: "REFUNDED",
          paymentStatus: "REFUNDED",
        });
      }
    }
  }

  async listPaymentMethods(customerId: string) {
    try {
      const methods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      });
      return methods.data;
    } catch (error: any) {
      throw new AppError(
        `Error al listar métodos de pago: ${error.message}`,
        400
      );
    }
  }
}
