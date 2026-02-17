import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { createApp } from '../src/app.js';

async function buildAppWithTempData() {
  const dir = await mkdtemp(path.join(tmpdir(), 'todo-api-'));
  process.env.TODO_DATA_FILE = path.join(dir, 'todos.json');
  process.env.ACCOUNT_DATA_FILE = path.join(dir, 'account.json');
  return createApp();
}

describe('todo API', () => {
  test('GET /api/account returns account', async () => {
    const app = await buildAppWithTempData();
    const response = await app.request('/api/account');

    expect(response.status).toBe(200);
    const body = (await response.json()) as { name: string };
    expect(body.name).toBeTruthy();
  });

  test('PATCH /api/account updates account name', async () => {
    const app = await buildAppWithTempData();
    const response = await app.request('/api/account', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: 'Updated Account Name' }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      name: 'Updated Account Name',
    });
  });

  test('PATCH /api/account returns 400 when payload is invalid', async () => {
    const app = await buildAppWithTempData();
    const response = await app.request('/api/account', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ name: '' }),
    });

    expect(response.status).toBe(400);
  });

  test('GET /api/todos returns list', async () => {
    const app = await buildAppWithTempData();
    const response = await app.request('/api/todos');

    expect(response.status).toBe(200);
    const body = (await response.json()) as unknown[];
    expect(body.length).toBeGreaterThan(0);
  });

  test('GET /api/todos/:id returns 404 for missing todo', async () => {
    const app = await buildAppWithTempData();
    const response = await app.request('/api/todos/missing-id');

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: 'Todo not found',
    });
  });

  test('POST/PATCH/DELETE flow works', async () => {
    const app = await buildAppWithTempData();

    const createdResponse = await app.request('/api/todos', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: 'from api test',
        description: '',
        status: 'todo',
        priority: 'medium',
        dueDate: null,
      }),
    });

    expect(createdResponse.status).toBe(201);
    const created = (await createdResponse.json()) as { id: string };

    const patchedResponse = await app.request(`/api/todos/${created.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: 'updated',
        description: 'x',
        status: 'done',
        priority: 'high',
        dueDate: null,
      }),
    });

    expect(patchedResponse.status).toBe(200);

    const deleteResponse = await app.request(`/api/todos/${created.id}`, {
      method: 'DELETE',
    });

    expect(deleteResponse.status).toBe(204);
  });

  test('POST returns 400 when payload is invalid', async () => {
    const app = await buildAppWithTempData();

    const response = await app.request('/api/todos', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        title: '',
        description: '',
        status: 'todo',
        priority: 'low',
        dueDate: null,
      }),
    });

    expect(response.status).toBe(400);
  });
});
