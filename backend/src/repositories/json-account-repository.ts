import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import type { Account, AccountInput } from '../domain/account.js';
import { accountSchema } from '../domain/account.js';
import { buildDefaultSeedAccount } from '../lib/default-seed-account.js';
import type { AccountRepository } from './account-repository.js';

export class JsonAccountRepository implements AccountRepository {
  private account: Account = buildDefaultSeedAccount();

  constructor(
    private readonly filePath: string,
    private readonly seedFilePath?: string,
  ) {}

  async init() {
    await mkdir(path.dirname(this.filePath), { recursive: true });

    try {
      const raw = await readFile(this.filePath, 'utf-8');
      const parsed = JSON.parse(raw) as unknown;
      this.account = accountSchema.parse(parsed);
    } catch {
      this.account = await this.loadSeedAccount();
      await this.persist();
    }
  }

  async get(): Promise<Account> {
    return this.account;
  }

  async update(input: AccountInput): Promise<Account> {
    const next: Account = {
      ...this.account,
      ...input,
      updatedAt: new Date().toISOString(),
    };

    this.account = next;
    await this.persist();

    return next;
  }

  private async persist() {
    await writeFile(this.filePath, JSON.stringify(this.account, null, 2));
  }

  private async loadSeedAccount() {
    if (this.seedFilePath) {
      try {
        const raw = await readFile(this.seedFilePath, 'utf-8');
        const parsed = JSON.parse(raw) as unknown;
        return accountSchema.parse(parsed);
      } catch {
        // Fall through to code-based default when seed file is unavailable.
      }
    }

    return buildDefaultSeedAccount();
  }
}
