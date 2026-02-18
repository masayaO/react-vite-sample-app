import { z } from 'zod';

export const todoStatusOptions = [
  'all',
  'todo',
  'in_progress',
  'done',
] as const;

export const todoFiltersSchema = z.object({
  search: z.string(),
  status: z.enum(todoStatusOptions),
});

export type TodoFiltersFormValues = z.infer<typeof todoFiltersSchema>;
