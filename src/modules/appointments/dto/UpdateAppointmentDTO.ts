import { z } from 'zod';

export const UpdateAppointmentSchema = z.object({
  status: z.enum(['SCHEDULED', 'COMPLETED', 'CANCELED'], {
    required_error: "El estado es requerido",
  }),
});

export type UpdateAppointmentDTO = z.infer<typeof UpdateAppointmentSchema>;
