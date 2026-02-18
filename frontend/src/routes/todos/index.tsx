import { createFileRoute } from '@tanstack/react-router';

import { TodosListPage } from '@/features/todos/page';

export const Route = createFileRoute('/todos/')({
  component: TodosListPage,
});
