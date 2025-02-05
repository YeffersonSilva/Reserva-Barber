import { z } from 'zod';

export const UpdateServiceSchema = z.object({
  name: z.string().nonempty("El nombre es obligatorio").optional(),
  description: z.string().nonempty("La descripción es obligatoria").optional(),
  price: z.number().positive("El precio debe ser un número positivo").optional(),
  duration: z.number().int("La duración debe ser un número entero").optional(),
});

export type UpdateServiceDTO = z.infer<typeof UpdateServiceSchema>;
