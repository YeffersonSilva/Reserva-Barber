import { z } from 'zod';

export const UpdateSchedulingPageSchema = z.object({
  slug: z.string().optional(),
  background: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  customCss: z.string().optional(),
  customJs: z.string().optional(),
});

export type UpdateSchedulingPageDTO = z.infer<typeof UpdateSchedulingPageSchema>;
