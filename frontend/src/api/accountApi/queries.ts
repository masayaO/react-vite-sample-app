import { useQuery } from '@tanstack/react-query';

import { fetchAccount } from '@/api/accountApi/client';
import { accountKeys } from '@/api/accountApi/keys';

export function useAccount() {
  return useQuery({
    queryKey: accountKeys.detail(),
    queryFn: () => fetchAccount(),
  });
}
