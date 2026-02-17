import type { TodoFilters } from './types';

export const todoKeys = {
  all: ['todos'] as const,
  list: (filters: TodoFilters) => ['todos', filters] as const,
  detail: (id: string) => ['todo', id] as const,
};
