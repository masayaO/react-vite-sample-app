import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';

import { accountInputSchema } from '../domain/account.js';
import type { AccountRepository } from '../repositories/account-repository.js';

type AccountRouteEnv = {
  Variables: {
    accountRepository: AccountRepository;
  };
};

export const accountRoute = new Hono<AccountRouteEnv>();

const bodyValidator = zValidator('json', accountInputSchema, (result, c) => {
  if (!result.success) {
    return c.json(
      { message: 'Validation failed', issues: result.error.issues },
      400,
    );
  }
});

accountRoute.get('/', async (c) => {
  const repository = c.get('accountRepository');
  const account = await repository.get();
  return c.json(account, 200);
});

accountRoute.patch('/', bodyValidator, async (c) => {
  const input = c.req.valid('json');
  const repository = c.get('accountRepository');
  const account = await repository.update(input);
  return c.json(account, 200);
});
