import { Link } from '@tanstack/react-router';

import { useAccountEditPage } from '@/routes/account/edit/useAccountEditPage';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';
import { Input } from '@/ui/input';

export function AccountEditPage() {
  const {
    accountQuery,
    handleSubmit,
    name,
    setName,
    successMessage,
    updateMutation,
    validationError,
  } = useAccountEditPage();

  if (accountQuery.isPending) return <p>Loading account...</p>;
  if (accountQuery.isError)
    return <p className="text-red-600">{accountQuery.error.message}</p>;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Edit Account</h2>
        <Link className="text-sm text-sky-700 hover:underline" to="/todos">
          Back to todos
        </Link>
      </div>

      <label
        className="flex flex-col gap-1 text-sm font-medium text-slate-700"
        htmlFor="account-name"
      >
        Name
        <Input
          id="account-name"
          onChange={(event) => setName(event.target.value)}
          value={name}
        />
      </label>

      {validationError ? (
        <p className="text-red-600">{validationError}</p>
      ) : null}
      {updateMutation.isError ? (
        <p className="text-red-600">{updateMutation.error.message}</p>
      ) : null}
      {successMessage ? (
        <p className="text-green-700">{successMessage}</p>
      ) : null}

      <Button disabled={updateMutation.isPending} onClick={handleSubmit}>
        {updateMutation.isPending ? 'Saving...' : 'Save'}
      </Button>
    </Card>
  );
}
