import { delay, HttpResponse, http } from 'msw';

import type { AccountInput } from '@/api/accountApi';
import type { Todo, TodoInput } from '@/api/todoApi';

import { getAccount, getTodos, setAccount, setTodos } from './data';

function withLatency() {
  return delay(100);
}

export const handlers = [
  http.get('/api/account', async () => {
    await withLatency();
    return HttpResponse.json(getAccount());
  }),

  http.patch('/api/account', async ({ request }) => {
    await withLatency();

    const payload = (await request.json()) as AccountInput;

    if (payload.name === 'force-error') {
      return HttpResponse.json(
        { message: 'Forced API error' },
        { status: 500 },
      );
    }

    const nextAccount = {
      ...getAccount(),
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    setAccount(nextAccount);
    return HttpResponse.json(nextAccount);
  }),

  http.get('/api/todos', async ({ request }) => {
    await withLatency();

    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() ?? '';
    const status = url.searchParams.get('status');

    const filtered = getTodos().filter((todo) => {
      const bySearch = search
        ? todo.title.toLowerCase().includes(search)
        : true;
      const byStatus = status ? todo.status === status : true;
      return bySearch && byStatus;
    });

    return HttpResponse.json(filtered);
  }),

  http.get('/api/todos/:id', async ({ params }) => {
    await withLatency();

    const todo = getTodos().find((item) => item.id === params.id);
    if (!todo) {
      return HttpResponse.json({ message: 'Todo not found' }, { status: 404 });
    }

    return HttpResponse.json(todo);
  }),

  http.post('/api/todos', async ({ request }) => {
    await withLatency();

    const payload = (await request.json()) as TodoInput;
    if (payload.title === 'force-error') {
      return HttpResponse.json(
        { message: 'Forced API error' },
        { status: 500 },
      );
    }

    const now = new Date().toISOString();
    const todo: Todo = {
      id: crypto.randomUUID(),
      ...payload,
      createdAt: now,
      updatedAt: now,
    };

    setTodos([todo, ...getTodos()]);
    return HttpResponse.json(todo, { status: 201 });
  }),

  http.patch('/api/todos/:id', async ({ params, request }) => {
    await withLatency();

    const payload = (await request.json()) as TodoInput;
    const current = getTodos();
    const index = current.findIndex((item) => item.id === params.id);

    if (index < 0) {
      return HttpResponse.json({ message: 'Todo not found' }, { status: 404 });
    }

    const updated: Todo = {
      ...current[index],
      ...payload,
      updatedAt: new Date().toISOString(),
    };

    const next = [...current];
    next[index] = updated;
    setTodos(next);

    return HttpResponse.json(updated);
  }),

  http.delete('/api/todos/:id', async ({ params }) => {
    await withLatency();

    const current = getTodos();
    const exists = current.some((item) => item.id === params.id);

    if (!exists) {
      return HttpResponse.json({ message: 'Todo not found' }, { status: 404 });
    }

    setTodos(current.filter((item) => item.id !== params.id));
    return HttpResponse.json({}, { status: 204 });
  }),
];
