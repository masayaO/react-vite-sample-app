import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createTodo,
  deleteTodo,
  fetchTodo,
  fetchTodos,
  updateTodo,
} from './api';
import { todoKeys } from './keys';
import type { TodoFilters, TodoInput } from './types';

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

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TodoInput) => createTodo(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

export function useUpdateTodo(todoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TodoInput) => updateTodo(todoId, input),
    onSuccess: (todo) => {
      queryClient.setQueryData(todoKeys.detail(todoId), todo);
      void queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}

export function useDeleteTodo(todoId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteTodo(todoId),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: todoKeys.detail(todoId) });
      void queryClient.invalidateQueries({ queryKey: todoKeys.all });
    },
  });
}
