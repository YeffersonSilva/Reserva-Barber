// src/modules/services/dto/UpdateServiceDTO.ts
import { z } from 'zod';

export const UpdateServiceSchema = z.object({
  name: z.string().nonempty("El nombre es obligatorio").optional(),
  description: z.string().nonempty("La descripción es obligatoria").optional(),
  duration: z.number().int("La duración debe ser un número entero").positive("La duración debe ser positiva").optional(),
  active: z.boolean().optional()
});

export type UpdateServiceDTO = z.infer<typeof UpdateServiceSchema>;
