// src/modules/services/dto/CreateServiceDTO.ts
import { z } from 'zod';

export const CreateServiceSchema = z.object({
  name: z.string().nonempty("El nombre es obligatorio"),
  description: z.string().nonempty("La descripción es obligatoria"),
  duration: z.number().int("La duración debe ser un número entero").positive("La duración debe ser positiva")
});

export type CreateServiceDTO = z.infer<typeof CreateServiceSchema>;
