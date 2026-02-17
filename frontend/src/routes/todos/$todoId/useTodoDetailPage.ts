import { useNavigate, useParams } from '@tanstack/react-router';

import {
  type TodoInput,
  useDeleteTodo,
  useTodo,
  useUpdateTodo,
} from '@/features/todos';

export function useTodoDetailPage() {
  const { todoId } = useParams({ from: '/todos/$todoId' });
  const navigate = useNavigate();

  const todoQuery = useTodo(todoId);
  const updateMutation = useUpdateTodo(todoId);
  const deleteMutation = useDeleteTodo(todoId);

  const handleSubmit = async (values: TodoInput) => {
    await updateMutation.mutateAsync(values);
  };

  const handleDelete = async () => {
    await deleteMutation.mutateAsync();
    await navigate({ to: '/todos' });
  };

  return {
    todoQuery,
    updateMutation,
    deleteMutation,
    handleSubmit,
    handleDelete,
  };
}
