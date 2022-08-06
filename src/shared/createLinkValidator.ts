import { z } from 'zod';

export const createLinkValidator = z.object({
  tag: z.string().max(255).min(1),
  url: z.string().max(2000).min(1)
});

export type createLinkValidatorType = z.infer<typeof createLinkValidator>;
