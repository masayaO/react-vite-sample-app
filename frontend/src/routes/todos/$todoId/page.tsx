import { TodoDetailHeader } from '@/routes/todos/$todoId/components/TodoDetailHeader';
import { useTodoDetailPage } from '@/routes/todos/$todoId/useTodoDetailPage';
import { TodoForm } from '@/routes/todos/components/TodoForm';
import { Button } from '@/ui/button';
import { Card } from '@/ui/card';

export function TodoDetailPage() {
  const {
    deleteMutation,
    handleDelete,
    handleSubmit,
    todoQuery,
    updateMutation,
  } = useTodoDetailPage();

  if (todoQuery.isPending) return <p>Loading todo...</p>;
  if (todoQuery.isError)
    return <p className="text-red-600">{todoQuery.error.message}</p>;

  return (
    <Card className="space-y-4">
      <TodoDetailHeader />

      {updateMutation.isError ? (
        <p className="text-red-600">{updateMutation.error.message}</p>
      ) : null}
      {deleteMutation.isError ? (
        <p className="text-red-600">{deleteMutation.error.message}</p>
      ) : null}

      <TodoForm
        initialValues={todoQuery.data}
        isSubmitting={updateMutation.isPending}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />

      <Button
        disabled={deleteMutation.isPending}
        onClick={handleDelete}
        variant="destructive"
      >
        {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
      </Button>
    </Card>
  );
}
