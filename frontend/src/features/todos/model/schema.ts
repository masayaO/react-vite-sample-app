import { z } from 'zod';

export const todoInputSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or fewer'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or fewer'),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  dueDate: z.string().nullable(),
});

export type TodoInputValues = z.infer<typeof todoInputSchema>;
