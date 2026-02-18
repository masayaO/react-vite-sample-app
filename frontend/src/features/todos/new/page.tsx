import { NewTodoHeader } from '@/features/todos/components/NewTodoHeader';
import { TodoForm } from '@/features/todos/components/TodoForm';
import { useTodoNewPage } from '@/features/todos/new/useTodoNewPage';
import { Card } from '@/ui/card';

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
