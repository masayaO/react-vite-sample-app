import { randomUUID } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { Todo, TodoFilters, TodoInput } from '../domain/todo.js';
import { todoSchema } from '../domain/todo.js';
import { buildDefaultSeedTodos } from '../lib/default-seed.js';
import type { TodoRepository } from './todo-repository.js';

export class JsonTodoRepository implements TodoRepository {
  private todos: Todo[] = [];

  constructor(
    private readonly filePath: string,
    private readonly seedFilePath?: string,
  ) {}

  async init() {
    await mkdir(path.dirname(this.filePath), { recursive: true });

    try {
      const raw = await readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw) as unknown;
      this.todos = todoSchema.array().parse(parsed);
    } catch {
      this.todos = await this.loadSeedTodos();
      await this.persist();
    }
  }

  async list(filters: TodoFilters): Promise<Todo[]> {
    const search = filters.search?.trim().toLowerCase() ?? '';
    return this.todos.filter((todo) => {
      const bySearch = search
        ? todo.title.toLowerCase().includes(search)
        : true;
      const byStatus = filters.status ? todo.status === filters.status : true;
      return bySearch && byStatus;
    });
  }

  async findById(id: string): Promise<Todo | null> {
    return this.todos.find((todo) => todo.id === id) ?? null;
  }

  async create(input: TodoInput): Promise<Todo> {
    const now = new Date().toISOString();
    const todo: Todo = {
      id: randomUUID(),
      ...input,
      createdAt: now,
      updatedAt: now,
    };
    this.todos = [todo, ...this.todos];
    await this.persist();
    return todo;
  }

  async update(id: string, input: TodoInput): Promise<Todo | null> {
    const index = this.todos.findIndex((todo) => todo.id === id);
    if (index < 0) return null;

    const updated: Todo = {
      ...this.todos[index],
      ...input,
      updatedAt: new Date().toISOString(),
    };

    const nextTodos = [...this.todos];
    nextTodos[index] = updated;
    this.todos = nextTodos;

    await this.persist();
    return updated;
  }

  async remove(id: string): Promise<boolean> {
    const exists = this.todos.some((todo) => todo.id === id);
    if (!exists) return false;

    this.todos = this.todos.filter((todo) => todo.id !== id);
    await this.persist();
    return true;
  }

  private async persist() {
    await writeFile(this.filePath, JSON.stringify(this.todos, null, 2));
  }

  private async loadSeedTodos() {
    if (this.seedFilePath) {
      try {
        const raw = await readFile(this.seedFilePath, 'utf-8');
        const parsed = JSON.parse(raw) as unknown;
        return todoSchema.array().parse(parsed);
      } catch {
        // Fall through to code-based defaults when seed file is unavailable.
      }
    }

    return buildDefaultSeedTodos();
  }
}
