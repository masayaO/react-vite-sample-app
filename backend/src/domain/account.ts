import { z } from 'zod';

export const accountInputSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be 100 characters or fewer'),
});

export const accountSchema = accountInputSchema.extend({
  updatedAt: z.string(),
});

export type Account = z.infer<typeof accountSchema>;
export type AccountInput = z.infer<typeof accountInputSchema>;
