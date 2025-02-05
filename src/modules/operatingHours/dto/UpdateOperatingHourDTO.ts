import { z } from 'zod';

export const UpdateOperatingHourSchema = z.object({
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']).optional(),
  openTime: z.string().nonempty("La hora de apertura no puede estar vacía").optional(),
  closeTime: z.string().nonempty("La hora de cierre no puede estar vacía").optional(),
});

export type UpdateOperatingHourDTO = z.infer<typeof UpdateOperatingHourSchema>;
