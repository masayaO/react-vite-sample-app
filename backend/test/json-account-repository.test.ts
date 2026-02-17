import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { describe, expect, test } from 'vitest';

import { JsonAccountRepository } from '../src/repositories/json-account-repository.js';

describe('JsonAccountRepository', () => {
  test('creates seed file on init when missing', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'account-repo-'));
    const filePath = path.join(dir, 'account.json');

    const repository = new JsonAccountRepository(filePath);
    await repository.init();

    const persisted = JSON.parse(await readFile(filePath, 'utf-8')) as {
      name: string;
    };
    expect(persisted.name).toBeTruthy();
  });

  test('writes update changes to file', async () => {
    const dir = await mkdtemp(path.join(tmpdir(), 'account-repo-'));
    const filePath = path.join(dir, 'account.json');

    const repository = new JsonAccountRepository(filePath);
    await repository.init();

    const updated = await repository.update({ name: 'Updated User Name' });
    expect(updated.name).toBe('Updated User Name');

    const persisted = JSON.parse(await readFile(filePath, 'utf-8')) as {
      name: string;
    };
    expect(persisted.name).toBe('Updated User Name');
  });
});
