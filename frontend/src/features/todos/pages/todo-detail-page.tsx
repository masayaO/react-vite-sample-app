import { Link, useNavigate, useParams } from '@tanstack/react-router';

import { TodoForm } from '@/features/todos/components/todo-form';
import { useDeleteTodo, useTodo, useUpdateTodo } from '@/features/todos/hooks';
import { Button } from '@/shared/ui/button';
import { Card } from '@/shared/ui/card';

export function TodoDetailPage() {
  const { todoId } = useParams({ from: '/todos/$todoId' });
  const navigate = useNavigate();

  const todoQuery = useTodo(todoId);
  const updateMutation = useUpdateTodo(todoId);
  const deleteMutation = useDeleteTodo(todoId);

  if (todoQuery.isPending) return <p>Loading todo...</p>;
  if (todoQuery.isError)
    return <p className="text-red-600">{todoQuery.error.message}</p>;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-slate-900">Todo Detail</h2>
        <Link className="text-sm text-sky-700 hover:underline" to="/todos">
          Back to list
        </Link>
      </div>

      {updateMutation.isError ? (
        <p className="text-red-600">{updateMutation.error.message}</p>
      ) : null}
      {deleteMutation.isError ? (
        <p className="text-red-600">{deleteMutation.error.message}</p>
      ) : null}

      <TodoForm
        initialValues={todoQuery.data}
        isSubmitting={updateMutation.isPending}
        onSubmit={async (values) => {
          await updateMutation.mutateAsync(values);
        }}
        submitLabel="Save changes"
      />

      <Button
        disabled={deleteMutation.isPending}
        onClick={async () => {
          await deleteMutation.mutateAsync();
          await navigate({ to: '/todos' });
        }}
        variant="destructive"
      >
        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
      </Button>
    </Card>
  );
}
