import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTodo, deleteTodo, updateTodo } from '@/api/todoApi/client';
import { todoKeys } from '@/api/todoApi/keys';
import type { TodoInput } from '@/api/todoApi/types';

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
