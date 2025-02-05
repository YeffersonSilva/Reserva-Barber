import { z } from 'zod';

export const CreateServiceSchema = z.object({
  name: z.string().nonempty("El nombre es obligatorio"),
  description: z.string().nonempty("La descripción es obligatoria"),
  price: z.number().positive("El precio debe ser un número positivo"),
  duration: z.number().int("La duración debe ser un número entero"),
});

export type CreateServiceDTO = z.infer<typeof CreateServiceSchema>;
