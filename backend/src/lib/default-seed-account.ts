import type { Account } from '../domain/account.js';

export function buildDefaultSeedAccount(): Account {
  return {
    name: 'Sample User',
    updatedAt: new Date('2026-02-15T09:00:00.000Z').toISOString(),
  };
}
