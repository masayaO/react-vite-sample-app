import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import { todoFiltersSchema, todoInputSchema } from '../domain/todo.js';
import type { TodoRepository } from '../repositories/todo-repository.js';

type TodoRouteEnv = {
  Variables: {
    todoRepository: TodoRepository;
  };
};

export const todosRoute = new Hono<TodoRouteEnv>();

const queryValidator = zValidator('query', todoFiltersSchema, (result, c) => {
  if (!result.success) {
    return c.json(
      { message: 'Validation failed', issues: result.error.issues },
      400,
    );
  }
});

const bodyValidator = zValidator('json', todoInputSchema, (result, c) => {
  if (!result.success) {
    return c.json(
      { message: 'Validation failed', issues: result.error.issues },
      400,
    );
  }
});

todosRoute.get('/', queryValidator, async (c) => {
  const filters = c.req.valid('query');
  const repository = c.get('todoRepository');
  const todos = await repository.list(filters);
  return c.json(todos, 200);
});

todosRoute.get('/:id', async (c) => {
  const id = c.req.param('id');
  const repository = c.get('todoRepository');
  const todo = await repository.findById(id);

  if (!todo) {
    return c.json({ message: 'Todo not found' }, 404);
  }

  return c.json(todo, 200);
});

todosRoute.post('/', bodyValidator, async (c) => {
  const input = c.req.valid('json');
  const repository = c.get('todoRepository');
  const todo = await repository.create(input);
  return c.json(todo, 201);
});

todosRoute.patch('/:id', bodyValidator, async (c) => {
  const id = c.req.param('id');
  const input = c.req.valid('json');
  const repository = c.get('todoRepository');

  const todo = await repository.update(id, input);
  if (!todo) {
    return c.json({ message: 'Todo not found' }, 404);
  }

  return c.json(todo, 200);
});

todosRoute.delete('/:id', async (c) => {
  const id = c.req.param('id');
  const repository = c.get('todoRepository');
  const removed = await repository.remove(id);

  if (!removed) {
    return c.json({ message: 'Todo not found' }, 404);
  }

  return c.body(null, 204);
});
