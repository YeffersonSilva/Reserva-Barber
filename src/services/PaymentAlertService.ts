import Stripe from "stripe";
import { SecurityAuditLogger } from "../services/SecurityAuditService";
import { EmailService } from "../services/EmailService";

export class PaymentAlertService {
  static async alertSuspiciousActivity(
    paymentIntent: Stripe.PaymentIntent,
    reason: string
  ) {
    await SecurityAuditLogger.logSecurityEvent({
      type: "SUSPICIOUS_ACTIVITY",
      userId: Number(paymentIntent.metadata.userId),
      ip: "system",
      success: false,
      details: {
        reason,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
      },
    });

    await EmailService.sendAlert({
      to: process.env.ADMIN_EMAIL!,
      subject: "Actividad Sospechosa Detectada",
      template: "suspicious-payment",
      data: {
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        reason,
      },
    });
  }
}
