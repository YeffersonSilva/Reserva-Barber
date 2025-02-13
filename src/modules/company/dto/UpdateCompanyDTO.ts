import { z } from 'zod';

export const UpdateCompanySchema = z.object({
  name: z.string().nonempty("El nombre de la empresa es obligatorio").optional(),
  logo: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
});

export type UpdateCompanyDTO = z.infer<typeof UpdateCompanySchema>;
