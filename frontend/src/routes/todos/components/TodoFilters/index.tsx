import {
  type TodoFiltersFormValues,
  todoStatusOptions,
} from '@/routes/todos/todoFiltersSchema';
import { Input } from '@/ui/input';
import { Select } from '@/ui/select';

type TodoFiltersProps = {
  search: TodoFiltersFormValues['search'];
  status: TodoFiltersFormValues['status'];
  onSearchChange: (value: string) => void;
  onStatusChange: (value: TodoFiltersFormValues['status']) => void;
};

export function TodoFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: TodoFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_200px]">
      <label
        className="flex flex-col gap-1 text-sm font-medium text-slate-700"
        htmlFor="todo-search"
      >
        Search
        <Input
          id="todo-search"
          onChange={(event) => onSearchChange(event.target.value)}
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
            onStatusChange(
              event.target.value as TodoFiltersFormValues['status'],
            )
          }
          value={status}
        >
          {todoStatusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </label>
    </div>
  );
}
