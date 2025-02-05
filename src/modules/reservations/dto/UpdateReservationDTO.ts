import { z } from 'zod';

export const UpdateReservationSchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED'], {
    required_error: "El estado es requerido",
  }),
});

export type UpdateReservationDTO = z.infer<typeof UpdateReservationSchema>;
