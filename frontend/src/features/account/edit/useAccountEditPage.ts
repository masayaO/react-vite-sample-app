import { useEffect, useState } from 'react';

import {
  type AccountInput,
  accountInputSchema,
  useAccountApi,
} from '@/api/accountApi';

export function useAccountEditPage() {
  const accountApi = useAccountApi();
  const accountQuery = accountApi.useAccount();
  const updateMutation = accountApi.useUpdateAccount();

  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (accountQuery.data) {
      setName(accountQuery.data.name);
    }
  }, [accountQuery.data]);

  const handleSubmit = async () => {
    const parsed = accountInputSchema.safeParse({ name });

    if (!parsed.success) {
      setValidationError(parsed.error.issues[0]?.message ?? 'Invalid input');
      setSuccessMessage(null);
      return;
    }

    setValidationError(null);
    setSuccessMessage(null);
    try {
      await updateMutation.mutateAsync(parsed.data as AccountInput);
      setSuccessMessage('Account updated.');
    } catch {
      // Mutation error state is displayed by the page component.
    }
  };

  return {
    name,
    setName,
    accountQuery,
    updateMutation,
    validationError,
    successMessage,
    handleSubmit,
  };
}
