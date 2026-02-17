import { z } from 'zod';

export const todoStatusSchema = z.enum(['todo', 'in_progress', 'done']);
export const todoPrioritySchema = z.enum(['low', 'medium', 'high']);

export const todoInputSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be 100 characters or fewer'),
  description: z
    .string()
    .max(1000, 'Description must be 1000 characters or fewer'),
  status: todoStatusSchema,
  priority: todoPrioritySchema,
  dueDate: z.string().nullable(),
});

export const todoSchema = todoInputSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const todoFiltersSchema = z.object({
  search: z.string().optional(),
  status: todoStatusSchema.optional(),
});

export type Todo = z.infer<typeof todoSchema>;
export type TodoInput = z.infer<typeof todoInputSchema>;
export type TodoFilters = z.infer<typeof todoFiltersSchema>;
