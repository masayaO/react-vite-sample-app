export { accountKeys } from '@/api/accountApi/keys';
export { useUpdateAccount } from '@/api/accountApi/mutations';
export { useAccount } from '@/api/accountApi/queries';
export { accountInputSchema } from '@/api/accountApi/schema';
export type { Account, AccountInput } from '@/api/accountApi/types';

import { useUpdateAccount } from '@/api/accountApi/mutations';
import { useAccount } from '@/api/accountApi/queries';

export function useAccountApi() {
  return {
    useAccount,
    useUpdateAccount,
  };
}
