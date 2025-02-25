import Stripe from "stripe";
import { AppError } from "../error/AppError";
import { envConfig } from "../config/envConfig";

interface PaymentIntentData {
  amount: number;
  currency?: string;
  customerId?: string;
  description?: string;
  metadata?: Record<string, any>;
  receiptEmail?: string;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export class StripePaymentService {
  static async createCustomer(
    email: string,
    name: string,
    metadata?: Record<string, any>
  ) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata,
      });
      return customer;
    } catch (error: any) {
      throw new AppError(`Error al crear el cliente: ${error.message}`, 400);
    }
  }

  static async createPaymentIntent({
    amount,
    currency = "brl",
    customerId,
    description,
    metadata,
    receiptEmail,
  }: PaymentIntentData) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        customer: customerId,
        description,
        metadata,
        receipt_email: receiptEmail,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
        setup_future_usage: customerId ? "off_session" : undefined,
      });
      return paymentIntent;
    } catch (error: any) {
      throw new AppError(
        `Error al crear el PaymentIntent: ${error.message}`,
        400
      );
    }
  }

  static async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethod?: string
  ) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(
        paymentIntentId,
        {
          payment_method: paymentMethod,
        }
      );
      return paymentIntent;
    } catch (error: any) {
      throw new AppError(`Error al confirmar el pago: ${error.message}`, 400);
    }
  }

  static async retrievePaymentIntent(paymentIntentId: string) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(
        paymentIntentId
      );
      return paymentIntent;
    } catch (error: any) {
      throw new AppError(`Error al obtener el pago: ${error.message}`, 400);
    }
  }

  static async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: "duplicate" | "fraudulent" | "requested_by_customer"
  ) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount,
        reason,
      });
      return refund;
    } catch (error: any) {
      throw new AppError(`Error al crear el reembolso: ${error.message}`, 400);
    }
  }

  static async createSetupIntent(customerId: string) {
    try {
      const setupIntent = await stripe.setupIntents.create({
        customer: customerId,
        automatic_payment_methods: { enabled: true },
      });
      return setupIntent;
    } catch (error: any) {
      throw new AppError(`Error al crear SetupIntent: ${error.message}`, 400);
    }
  }

  static async listPaymentMethods(customerId: string) {
    try {
      const paymentMethods = await stripe.customers.listPaymentMethods(
        customerId,
        { type: "card" }
      );
      return paymentMethods.data;
    } catch (error: any) {
      throw new AppError(
        `Error al listar métodos de pago: ${error.message}`,
        400
      );
    }
  }
}
