import { createFileRoute } from '@tanstack/react-router';

import { TodoNewPage } from '@/features/todos/new/page';

export const Route = createFileRoute('/todos/new')({
  component: TodoNewPage,
});
