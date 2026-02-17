import type { Todo, TodoFilters, TodoInput } from '../domain/todo.js';

export interface TodoRepository {
  list(filters: TodoFilters): Promise<Todo[]>;
  findById(id: string): Promise<Todo | null>;
  create(input: TodoInput): Promise<Todo>;
  update(id: string, input: TodoInput): Promise<Todo | null>;
  remove(id: string): Promise<boolean>;
}
