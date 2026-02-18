import { useNavigate } from '@tanstack/react-router';

import { type TodoInput, useTodoApi } from '@/api/todoApi';

const initialValues: TodoInput = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: null,
};

export function useTodoNewPage() {
  const todoApi = useTodoApi();
  const navigate = useNavigate();
  const createMutation = todoApi.useCreateTodo();

  const handleSubmit = async (values: TodoInput) => {
    await createMutation.mutateAsync(values);
    await navigate({ to: '/todos' });
  };

  return {
    initialValues,
    createMutation,
    handleSubmit,
  };
}
