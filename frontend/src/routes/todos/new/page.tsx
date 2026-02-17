import { TodoForm } from '@/features/todos';
import { NewTodoHeader } from '@/routes/todos/new/components/NewTodoHeader';
import { useTodoNewPage } from '@/routes/todos/new/useTodoNewPage';
import { Card } from '@/shared/ui/card';

export function TodoNewPage() {
  const { createMutation, handleSubmit, initialValues } = useTodoNewPage();

  return (
    <Card className="space-y-4">
      <NewTodoHeader />
      {createMutation.isError ? (
        <p className="text-red-600">{createMutation.error.message}</p>
      ) : null}
      <TodoForm
        initialValues={initialValues}
        isSubmitting={createMutation.isPending}
        onSubmit={handleSubmit}
        submitLabel="Create"
      />
    </Card>
  );
}
