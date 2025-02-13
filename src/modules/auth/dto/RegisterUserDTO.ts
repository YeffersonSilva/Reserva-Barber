import { z } from 'zod';

export const RegisterUserSchema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().nonempty('Phone is required'),
  role: z.enum(['ADMIN', 'COMPANY_ADMIN', 'CLIENT']),
  companyId: z.number().optional()  // Agregado: companyId como propiedad opcional
});

export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;
