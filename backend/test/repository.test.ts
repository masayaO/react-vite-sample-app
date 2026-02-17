import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { JsonTodoRepository } from '../src/repositories/json-todo-repository.js';

describe('JsonTodoRepository', () => {
  test('creates seed file on init when missing', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'todo-repo-'));
    const filePath = path.join(dir, 'todos.json');

    const repository = new JsonTodoRepository(filePath);
    await repository.init();

    const persisted = JSON.parse(
      await readFile(filePath, 'utf-8'),
    ) as unknown[];
    expect(persisted.length).toBeGreaterThan(0);
  });

  test('writes create/update/delete changes to file', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'todo-repo-'));
    const filePath = path.join(dir, 'todos.json');

    const repository = new JsonTodoRepository(filePath);
    await repository.init();

    const created = await repository.create({
      title: 'persist me',
      description: '',
      status: 'todo',
      priority: 'low',
      dueDate: null,
    });

    const updated = await repository.update(created.id, {
      title: 'persisted update',
      description: 'x',
      status: 'done',
      priority: 'high',
      dueDate: null,
    });

    expect(updated?.title).toBe('persisted update');

    const removed = await repository.remove(created.id);
    expect(removed).toBe(true);

    const persisted = JSON.parse(await readFile(filePath, 'utf-8')) as Array<{
      id: string;
    }>;
    expect(persisted.some((todo) => todo.id === created.id)).toBe(false);
  });
});
