import { z } from 'zod';

export const LoginUserDTO = z.object({
  email: z.string().email(),
  password: z.string(),
  
});

export type LoginUserDTO = z.infer<typeof LoginUserDTO>;
