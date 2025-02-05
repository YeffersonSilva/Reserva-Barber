import { z } from 'zod';

export const CreateReservationSchema = z.object({
  serviceId: z.number({ invalid_type_error: "El ID del servicio es requerido" }),
  dateTime: z.string().nonempty("La fecha y hora de la reserva es obligatoria")
    .refine(val => !isNaN(Date.parse(val)), "Formato de fecha inválido"),
});

export type CreateReservationDTO = z.infer<typeof CreateReservationSchema>;
