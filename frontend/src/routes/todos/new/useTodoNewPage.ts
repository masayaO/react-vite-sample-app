import { useNavigate } from '@tanstack/react-router';

import { type TodoInput, useCreateTodo } from '@/features/todos';

const initialValues: TodoInput = {
  title: '',
  description: '',
  status: 'todo',
  priority: 'medium',
  dueDate: null,
};

export function useTodoNewPage() {
  const navigate = useNavigate();
  const createMutation = useCreateTodo();

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
