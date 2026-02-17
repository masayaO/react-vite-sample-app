import type { Todo } from '../domain/todo.js';

export function buildDefaultSeedTodos(): Todo[] {
  return [
    {
      id: 'todo-1',
      title: 'Set up TanStack Router',
      description: 'Create nested routes for list/new/detail pages.',
      status: 'in_progress',
      priority: 'high',
      dueDate: null,
      createdAt: new Date('2026-02-15T08:00:00.000Z').toISOString(),
      updatedAt: new Date('2026-02-16T08:00:00.000Z').toISOString(),
    },
    {
      id: 'todo-2',
      title: 'Add Query hooks',
      description: 'Implement list/detail query and CRUD mutations.',
      status: 'todo',
      priority: 'medium',
      dueDate: null,
      createdAt: new Date('2026-02-15T09:00:00.000Z').toISOString(),
      updatedAt: new Date('2026-02-15T09:00:00.000Z').toISOString(),
    },
  ];
}
