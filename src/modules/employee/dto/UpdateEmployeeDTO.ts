import { z } from 'zod';

export const UpdateEmployeeSchema = z.object({
  name: z.string().nonempty("El nombre es obligatorio").optional(),
  email: z.string().email("Email inválido").optional(),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").optional(),
});

export type UpdateEmployeeDTO = z.infer<typeof UpdateEmployeeSchema>;
