import path from 'node:path';

import { Hono } from 'hono';

import { JsonAccountRepository } from './repositories/json-account-repository.js';
import { JsonTodoRepository } from './repositories/json-todo-repository.js';
import { accountRoute } from './routes/account.js';
import { todosRoute } from './routes/todos.js';

type AppEnv = {
  Variables: {
    todoRepository: JsonTodoRepository;
    accountRepository: JsonAccountRepository;
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
  const accountDataFilePath =
    process.env.ACCOUNT_DATA_FILE ||
    path.resolve(process.cwd(), 'data/account.json');
  const accountSeedFilePath =
    process.env.ACCOUNT_SEED_FILE ||
    path.resolve(process.cwd(), 'data/account.seed.json');

  const todoRepository = new JsonTodoRepository(dataFilePath, seedFilePath);
  await todoRepository.init();
  const accountRepository = new JsonAccountRepository(
    accountDataFilePath,
    accountSeedFilePath,
  );
  await accountRepository.init();

  app.use('*', async (c, next) => {
    c.set('todoRepository', todoRepository);
    c.set('accountRepository', accountRepository);
    await next();
  });

  app.onError((error, c) => {
    console.error(error);
    return c.json({ message: 'Internal server error' }, 500);
  });

  app.get('/health', (c) => c.json({ status: 'ok' }, 200));
  app.route('/api/account', accountRoute);
  app.route('/api/todos', todosRoute);

  return app;
}
