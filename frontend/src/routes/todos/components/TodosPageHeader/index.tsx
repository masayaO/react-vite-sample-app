import { Link } from '@tanstack/react-router';

export function TodosPageHeader() {
  return (
    <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
      <h2 className="text-2xl font-semibold text-slate-900">Todo List</h2>
      <Link
        className="inline-flex h-10 items-center justify-center rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700"
        to="/todos/new"
      >
        Create Todo
      </Link>
    </div>
  );
}
