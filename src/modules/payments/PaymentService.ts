import Stripe from "stripe";
import { AppError } from "../../error/AppError";
import { CreatePaymentDTO } from "./dto/CreatePaymentDTO";
import { IAppointmentRepository } from "../../repositories/interfaces/IAppointmentRepository";

export class PaymentService {
  private stripe: Stripe;

  constructor(
    private appointmentRepository: IAppointmentRepository,
    private readonly stripeSecretKey: string,
    private readonly stripeWebhookSecret: string
  ) {
    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2025-02-24.acacia",
    });
  }

  async createPaymentIntent(data: CreatePaymentDTO, userId: number, companyId: number) {
    try {
      // Crear o recuperar cliente de Stripe
      let customer = await this.findOrCreateCustomer(userId, data.email);

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: data.amount,
        currency: "brl",
        customer: customer.id,
        metadata: {
          userId: userId.toString(),
          companyId: companyId.toString(),
          appointmentId: data.appointmentId?.toString(),
        },
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        customerId: customer.id,
      };
    } catch (error: any) {
      throw new AppError(`Error al crear intento de pago: ${error.message}`, 400);
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
      }
    } catch (error: any) {
      throw new AppError(`Error en webhook: ${error.message}`, 400);
    }
  }

  private async findOrCreateCustomer(userId: number, email: string) {
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
  }

  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const appointmentId = Number(paymentIntent.metadata.appointmentId);
    if (appointmentId) {
      await this.appointmentRepository.update(appointmentId, {
        status: "SCHEDULED",
      });
    }
  }

  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const appointmentId = Number(paymentIntent.metadata.appointmentId);
    if (appointmentId) {
      await this.appointmentRepository.update(appointmentId, {
        status: "CANCELED",
      });
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
      throw new AppError(`Error al listar métodos de pago: ${error.message}`, 400);
    }
  }
} 