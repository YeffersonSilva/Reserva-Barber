import { z } from 'zod';

export const CreateCompanySchema = z.object({
  name: z.string().nonempty("El nombre de la empresa es obligatorio"),
  logo: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
});

export type CreateCompanyDTO = z.infer<typeof CreateCompanySchema>;
