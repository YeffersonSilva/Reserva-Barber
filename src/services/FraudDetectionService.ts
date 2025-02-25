import Stripe from "stripe";
import { PaymentAlertService } from "./PaymentAlertService";
import { PrismaClient } from "@prisma/client";

interface RiskFactors {
  paymentVelocity: number;
  amountRisk: number;
  userHistory: number;
  locationRisk: number;
  timeOfDay: number;
}

export class FraudDetectionService {
  private static prisma = new PrismaClient();

  static async checkPayment(
    paymentIntent: Stripe.PaymentIntent,
    userId: number
  ): Promise<boolean> {
    const riskScore = await this.calculateRiskScore(paymentIntent, userId);

    if (riskScore > 0.7) {
      await PaymentAlertService.alertSuspiciousActivity(
        paymentIntent,
        "Alto riesgo de fraude detectado"
      );
      return false;
    }

    return true;
  }

  private static async calculateRiskScore(
    paymentIntent: Stripe.PaymentIntent,
    userId: number
  ): Promise<number> {
    const riskFactors = await this.analyzeRiskFactors(paymentIntent, userId);

    // Pesos para cada factor de riesgo
    const weights = {
      paymentVelocity: 0.3,
      amountRisk: 0.25,
      userHistory: 0.2,
      locationRisk: 0.15,
      timeOfDay: 0.1,
    };

    // Calcular score ponderado
    const weightedScore = Object.entries(riskFactors).reduce(
      (score, [factor, value]) => {
        return score + value * weights[factor as keyof RiskFactors];
      },
      0
    );

    return weightedScore;
  }

  private static async analyzeRiskFactors(
    paymentIntent: Stripe.PaymentIntent,
    userId: number
  ): Promise<RiskFactors> {
    const [paymentVelocity, userHistory, locationRisk, timeOfDay] =
      await Promise.all([
        this.checkPaymentVelocity(userId),
        this.evaluateUserHistory(userId),
        this.assessLocationRisk(paymentIntent),
        this.evaluateTimeRisk(),
      ]);

    const amountRisk = this.calculateAmountRisk(paymentIntent.amount);

    return {
      paymentVelocity,
      amountRisk,
      userHistory,
      locationRisk,
      timeOfDay,
    };
  }

  private static async checkPaymentVelocity(userId: number): Promise<number> {
    const lastHour = new Date(Date.now() - 60 * 60 * 1000);

    const recentPayments = await this.prisma.appointment.count({
      where: {
        userId,
        createdAt: {
          gte: lastHour,
        },
        paymentStatus: "PAID",
      },
    });

    // Más de 3 pagos por hora es sospechoso
    return Math.min(recentPayments / 3, 1);
  }

  private static calculateAmountRisk(amount: number): number {
    const thresholds = {
      low: 5000, // R$50
      medium: 50000, // R$500
      high: 200000, // R$2000
    };

    if (amount > thresholds.high) return 1;
    if (amount > thresholds.medium) return 0.7;
    if (amount > thresholds.low) return 0.3;
    return 0;
  }

  private static async evaluateUserHistory(userId: number): Promise<number> {
    const userStats = await this.prisma.appointment.aggregate({
      where: {
        userId,
        paymentStatus: {
          in: ["PAID", "FAILED", "REFUNDED"],
        },
      },
      _count: {
        paymentStatus: true,
      },
      _sum: {
        id: true, // Usar como proxy para el total de transacciones
      },
    });

    if (!userStats._count.paymentStatus) return 0.5; // Usuario nuevo

    const failedPayments = await this.prisma.appointment.count({
      where: {
        userId,
        paymentStatus: {
          in: ["FAILED", "REFUNDED"],
        },
      },
    });

    const failureRate = failedPayments / userStats._count.paymentStatus;
    return failureRate;
  }

  private static async assessLocationRisk(
    paymentIntent: Stripe.PaymentIntent
  ): Promise<number> {
    // Implementar lógica de riesgo por ubicación
    // Por ejemplo, comparar con ubicaciones anteriores del usuario
    return 0;
  }

  private static evaluateTimeRisk(): number {
    const hour = new Date().getHours();

    // Pagos entre 1am y 5am son más sospechosos
    if (hour >= 1 && hour <= 5) {
      return 0.8;
    }

    // Pagos en horario normal
    if (hour >= 8 && hour <= 20) {
      return 0;
    }

    // Otros horarios tienen riesgo moderado
    return 0.3;
  }
}
