import { z } from 'zod';

export const CreateAppointmentSchema = z.object({
  serviceId: z.number({ invalid_type_error: "El ID del servicio es requerido" }),
  dateTime: z
    .string()
    .nonempty("La fecha y hora son requeridas")
    .refine(val => !isNaN(Date.parse(val)), "Formato de fecha inválido"),
  employeeId: z.number().optional(), // Opcional: para asignar un empleado
});

export type CreateAppointmentDTO = z.infer<typeof CreateAppointmentSchema>;
