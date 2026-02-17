import { useState } from 'react';

import { useTodos } from '@/features/todos';
import type { TodoFiltersFormValues } from '@/routes/todos/todoFiltersSchema';

export function useTodoListPage() {
  const [search, setSearch] = useState<TodoFiltersFormValues['search']>('');
  const [status, setStatus] = useState<TodoFiltersFormValues['status']>('all');

  const todosQuery = useTodos({ search, status });

  return {
    search,
    setSearch,
    status,
    setStatus,
    todosQuery,
  };
}
