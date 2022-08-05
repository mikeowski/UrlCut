import { z } from 'zod';

export const createLinkValidator = z.object({
  tag: z.string().max(255),
  url: z.string().max(2000)
});

export type createLinkValidatorType = z.infer<typeof createLinkValidator>;
