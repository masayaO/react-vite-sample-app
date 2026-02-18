import { Link } from '@tanstack/react-router';

import { TodoFilters } from '@/features/todos/components/TodoFilters';
import { TodosPageHeader } from '@/features/todos/components/TodosPageHeader';
import { useTodoListPage } from '@/features/todos/useTodoListPage';
import { Badge } from '@/ui/badge';
import { Card } from '@/ui/card';

export function TodosListPage() {
  const { search, setSearch, status, setStatus, todosQuery } =
    useTodoListPage();

  return (
    <div className="space-y-6">
      <TodosPageHeader />

      <Card className="space-y-4">
        <TodoFilters
          onSearchChange={setSearch}
          onStatusChange={setStatus}
          search={search}
          status={status}
        />
      </Card>

      {todosQuery.isPending ? <p>Loading todos...</p> : null}
      {todosQuery.isError ? (
        <p className="text-red-600">{todosQuery.error.message}</p>
      ) : null}

      <div className="space-y-3">
        {todosQuery.data?.map((todo) => (
          <Card
            key={todo.id}
            className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
          >
            <div className="space-y-1">
              <p className="text-lg font-medium text-slate-900">{todo.title}</p>
              <p className="text-sm text-slate-600">{todo.description}</p>
              <div className="flex items-center gap-2">
                <Badge>{todo.status}</Badge>
                <span className="text-xs text-slate-500">
                  priority: {todo.priority}
                </span>
              </div>
            </div>
            <Link
              className="text-sm font-medium text-sky-700 hover:underline"
              params={{ todoId: todo.id }}
              to="/todos/$todoId"
            >
              View detail
            </Link>
          </Card>
        ))}
        {todosQuery.data?.length === 0 ? (
          <Card>
            <p className="text-sm text-slate-600">No todos found.</p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
