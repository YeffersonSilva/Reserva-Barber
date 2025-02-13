import { z } from 'zod';

export const CreateSchedulingPageSchema = z.object({
  // Slug opcional que servirá para la URL personalizada
  slug: z.string().optional(),
  background: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  customCss: z.string().optional(),
  customJs: z.string().optional(),
});

export type CreateSchedulingPageDTO = z.infer<typeof CreateSchedulingPageSchema>;
