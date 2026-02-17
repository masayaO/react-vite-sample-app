import type { Account, AccountInput } from '../domain/account.js';

export interface AccountRepository {
  get(): Promise<Account>;
  update(input: AccountInput): Promise<Account>;
}
