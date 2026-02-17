import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAccount } from '@/api/accountApi/client';
import { accountKeys } from '@/api/accountApi/keys';
import type { AccountInput } from '@/api/accountApi/types';

export function useUpdateAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: AccountInput) => updateAccount(input),
    onSuccess: (account) => {
      queryClient.setQueryData(accountKeys.detail(), account);
      void queryClient.invalidateQueries({ queryKey: accountKeys.all });
    },
  });
}
