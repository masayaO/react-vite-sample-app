import { createFileRoute } from '@tanstack/react-router';

import { AccountEditPage } from '@/features/account/edit/page';

export const Route = createFileRoute('/account/edit')({
  component: AccountEditPage,
});
