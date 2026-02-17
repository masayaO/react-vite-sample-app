import { useQuery } from '@tanstack/react-query';

import { fetchTodo, fetchTodos } from '@/features/todos/api/todos-api';
import type { TodoFilters } from '@/features/todos/model/types';
import { todoKeys } from '@/features/todos/query/keys';

export function useTodos(filters: TodoFilters) {
  return useQuery({
    queryKey: todoKeys.list(filters),
    queryFn: () => fetchTodos(filters),
  });
}

export function useTodo(todoId: string) {
  return useQuery({
    queryKey: todoKeys.detail(todoId),
    queryFn: () => fetchTodo(todoId),
  });
}
