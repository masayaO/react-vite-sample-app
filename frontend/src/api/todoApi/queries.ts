import { useQuery } from '@tanstack/react-query';
import { fetchTodo, fetchTodos } from '@/api/todoApi/client';
import { todoKeys } from '@/api/todoApi/keys';
import type { TodoFilters } from '@/api/todoApi/types';

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
