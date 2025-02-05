import { z } from 'zod';

export const CreateOperatingHourSchema = z.object({
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'], {
    required_error: 'El día de la semana es obligatorio',
  }),
  openTime: z.string().nonempty("La hora de apertura es obligatoria"),
  closeTime: z.string().nonempty("La hora de cierre es obligatoria"),
});

export type CreateOperatingHourDTO = z.infer<typeof CreateOperatingHourSchema>;
