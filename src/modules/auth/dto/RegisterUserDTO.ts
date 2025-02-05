import { z } from 'zod';
import { isValidCpf } from '../../../utils/cpf'; // Asegúrate de que la ruta sea correcta

export const RegisterUserSchema = z.object({
  name: z.string().nonempty('Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().nonempty('Phone is required'),
  role: z.enum(['ADMIN', 'USER']),
  firebaseToken: z.string().optional(), 

});

export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;
