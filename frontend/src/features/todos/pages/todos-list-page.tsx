import { Link } from '@tanstack/react-router';
import { useState } from 'react';

import { useTodos } from '@/features/todos/hooks';
import { Badge } from '@/shared/ui/badge';
import { Card } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Select } from '@/shared/ui/select';

import type { TodoStatus } from '../types';

export function TodosListPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<TodoStatus | 'all'>('all');

  const todosQuery = useTodos({ search, status });

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
        <h2 className="text-2xl font-semibold text-slate-900">Todo List</h2>
        <Link
          className="inline-flex h-10 items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
          to="/todos/new"
        >
          Create Todo
        </Link>
      </div>

      <Card className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_200px]">
          <label
            className="flex flex-col gap-1 text-sm font-medium text-slate-700"
            htmlFor="todo-search"
          >
            Search
            <Input
              id="todo-search"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title"
              value={search}
            />
          </label>

          <label
            className="flex flex-col gap-1 text-sm font-medium text-slate-700"
            htmlFor="todo-status"
          >
            Status
            <Select
              id="todo-status"
              onChange={(event) =>
                setStatus(event.target.value as TodoStatus | 'all')
              }
              value={status}
            >
              <option value="all">all</option>
              <option value="todo">todo</option>
              <option value="in_progress">in_progress</option>
              <option value="done">done</option>
            </Select>
          </label>
        </div>
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
