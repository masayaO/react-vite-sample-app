import { createFileRoute } from '@tanstack/react-router';

import { TodoDetailPage } from '@/features/todos/$todoId/page';

export const Route = createFileRoute('/todos/$todoId')({
  component: TodoDetailPage,
});
