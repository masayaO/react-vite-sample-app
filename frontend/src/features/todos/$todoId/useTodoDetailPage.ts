import { useNavigate, useParams } from '@tanstack/react-router';

import { type TodoInput, useTodoApi } from '@/api/todoApi';

export function useTodoDetailPage() {
  const todoApi = useTodoApi();
  const { todoId } = useParams({ from: '/todos/$todoId' });
  const navigate = useNavigate();

  const todoQuery = todoApi.useTodo(todoId);
  const updateMutation = todoApi.useUpdateTodo(todoId);
  const deleteMutation = todoApi.useDeleteTodo(todoId);

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
