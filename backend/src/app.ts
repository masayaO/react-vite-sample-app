import path from 'node:path';

import { Hono } from 'hono';

import { JsonTodoRepository } from './repositories/json-todo-repository.js';
import { todosRoute } from './routes/todos.js';

type AppEnv = {
  Variables: {
    todoRepository: JsonTodoRepository;
  };
};

export async function createApp() {
  const app = new Hono<AppEnv>();

  const dataFilePath =
    process.env.TODO_DATA_FILE ||
    path.resolve(process.cwd(), 'data/todos.json');
  const seedFilePath =
    process.env.TODO_SEED_FILE ||
    path.resolve(process.cwd(), 'data/todos.seed.json');

  const repository = new JsonTodoRepository(dataFilePath, seedFilePath);
  await repository.init();

  app.use('*', async (c, next) => {
    c.set('todoRepository', repository);
    await next();
  });

  app.onError((error, c) => {
    console.error(error);
    return c.json({ message: 'Internal server error' }, 500);
  });

  app.get('/health', (c) => c.json({ status: 'ok' }, 200));
  app.route('/api/todos', todosRoute);

  return app;
}
