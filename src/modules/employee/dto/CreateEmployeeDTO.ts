import { z } from 'zod';

export const CreateEmployeeSchema = z.object({
  name: z.string().nonempty("El nombre es obligatorio"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type CreateEmployeeDTO = z.infer<typeof CreateEmployeeSchema>;
