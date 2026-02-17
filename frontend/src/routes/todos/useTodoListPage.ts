import { useState } from 'react';

import { useTodoApi } from '@/api/todoApi';
import type { TodoFiltersFormValues } from '@/routes/todos/todoFiltersSchema';

export function useTodoListPage() {
  const todoApi = useTodoApi();
  const [search, setSearch] = useState<TodoFiltersFormValues['search']>('');
  const [status, setStatus] = useState<TodoFiltersFormValues['status']>('all');

  const todosQuery = todoApi.useTodos({ search, status });

  return {
    search,
    setSearch,
    status,
    setStatus,
    todosQuery,
  };
}
