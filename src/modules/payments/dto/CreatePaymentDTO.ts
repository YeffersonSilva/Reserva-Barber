import { z } from "zod";

export const CreatePaymentSchema = z.object({
  amount: z.number().positive("El monto debe ser positivo").min(50, "El monto mínimo es de R$0.50"),
  email: z.string().email("Email inválido"),
  appointmentId: z.number().optional(),
  description: z.string().optional(),
});

export const RefundPaymentSchema = z.object({
  amount: z.number().positive("El monto debe ser positivo").optional(),
});

export type CreatePaymentDTO = z.infer<typeof CreatePaymentSchema>;
export type RefundPaymentDTO = z.infer<typeof RefundPaymentSchema>; 