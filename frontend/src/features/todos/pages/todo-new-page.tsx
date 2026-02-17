import { useNavigate } from '@tanstack/react-router';

import { TodoForm } from '@/features/todos/components/todo-form';
import { useCreateTodo } from '@/features/todos/hooks';
import { Card } from '@/shared/ui/card';

export function TodoNewPage() {
  const navigate = useNavigate();
  const createMutation = useCreateTodo();

  return (
    <Card className="space-y-4">
      <h2 className="text-2xl font-semibold text-slate-900">Create Todo</h2>
      {createMutation.isError ? (
        <p className="text-red-600">{createMutation.error.message}</p>
      ) : null}
      <TodoForm
        initialValues={{
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          dueDate: null,
        }}
        isSubmitting={createMutation.isPending}
        onSubmit={async (values) => {
          await createMutation.mutateAsync(values);
          await navigate({ to: '/todos' });
        }}
        submitLabel="Create"
      />
    </Card>
  );
}
