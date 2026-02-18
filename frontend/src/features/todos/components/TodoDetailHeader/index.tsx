import { Link } from '@tanstack/react-router';

import { useTodoDetailHeader } from '@/features/todos/components/TodoDetailHeader/useTodoDetailHeader';

export function TodoDetailHeader() {
  const { backTo } = useTodoDetailHeader();

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-semibold text-slate-900">Todo Detail</h2>
      <Link className="text-sm text-sky-700 hover:underline" to={backTo}>
        Back to list
      </Link>
    </div>
  );
}
