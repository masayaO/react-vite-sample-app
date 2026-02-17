import type { Account, AccountInput } from '@/api/accountApi/types';
import { apiClient } from '@/api/httpClient';

export async function fetchAccount(): Promise<Account> {
  const response = await apiClient.get<Account>('/account');
  return response.data;
}

export async function updateAccount(input: AccountInput): Promise<Account> {
  const response = await apiClient.patch<Account>('/account', input);
  return response.data;
}
