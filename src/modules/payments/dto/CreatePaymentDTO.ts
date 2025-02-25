import { z } from "zod";

export const CreatePaymentSchema = z.object({
  amount: z.number().positive("El monto debe ser positivo"),
  email: z.string().email("Email inválido"),
  appointmentId: z.number().optional(),
  description: z.string().optional(),
});

export type CreatePaymentDTO = z.infer<typeof CreatePaymentSchema>; 