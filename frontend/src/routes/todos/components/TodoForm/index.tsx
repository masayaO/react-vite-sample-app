import { useForm } from '@tanstack/react-form';
import { useMemo, useState } from 'react';

import { todoInputSchema } from '@/api/todoApi/schema';
import type { TodoInput, TodoPriority, TodoStatus } from '@/api/todoApi/types';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Select } from '@/ui/select';
import { Textarea } from '@/ui/textarea';

type TodoFormProps = {
  initialValues: TodoInput;
  submitLabel: string;
  isSubmitting: boolean;
  onSubmit: (values: TodoInput) => Promise<void>;
};

function toDateInputValue(value: string | null) {
  if (!value) return '';
  return value.slice(0, 10);
}

export function TodoForm({
  initialValues,
  submitLabel,
  isSubmitting,
  onSubmit,
}: TodoFormProps) {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const defaultValues = useMemo(
    () => ({
      ...initialValues,
      dueDate: toDateInputValue(initialValues.dueDate),
    }),
    [initialValues],
  );

  const form = useForm({
    defaultValues,
    onSubmit: async ({ value }) => {
      const parsed = todoInputSchema.safeParse({
        ...value,
        dueDate: value.dueDate?.trim()
          ? new Date(value.dueDate).toISOString()
          : null,
      });

      if (!parsed.success) {
        const nextErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
          const key = issue.path[0];
          if (typeof key === 'string' && !nextErrors[key]) {
            nextErrors[key] = issue.message;
          }
        }
        setValidationErrors(nextErrors);
        return;
      }

      setValidationErrors({});
      try {
        await onSubmit(parsed.data);
      } catch {
        // Mutation state handles visible errors in page components.
      }
    },
  });

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <form.Field name="title">
        {(field) => (
          <label
            className="flex flex-col gap-1 text-sm font-medium text-slate-700"
            htmlFor={field.name}
          >
            Title
            <Input
              id={field.name}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              value={field.state.value}
            />
            {validationErrors.title ? (
              <span className="text-sm text-red-600">
                {validationErrors.title}
              </span>
            ) : null}
          </label>
        )}
      </form.Field>

      <form.Field name="description">
        {(field) => (
          <label
            className="flex flex-col gap-1 text-sm font-medium text-slate-700"
            htmlFor={field.name}
          >
            Description
            <Textarea
              id={field.name}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              value={field.state.value}
            />
            {validationErrors.description ? (
              <span className="text-sm text-red-600">
                {validationErrors.description}
              </span>
            ) : null}
          </label>
        )}
      </form.Field>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <form.Field name="status">
          {(field) => (
            <label
              className="flex flex-col gap-1 text-sm font-medium text-slate-700"
              htmlFor={field.name}
            >
              Status
              <Select
                id={field.name}
                name={field.name}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value as TodoStatus)
                }
                value={field.state.value}
              >
                <option value="todo">todo</option>
                <option value="in_progress">in_progress</option>
                <option value="done">done</option>
              </Select>
            </label>
          )}
        </form.Field>

        <form.Field name="priority">
          {(field) => (
            <label
              className="flex flex-col gap-1 text-sm font-medium text-slate-700"
              htmlFor={field.name}
            >
              Priority
              <Select
                id={field.name}
                name={field.name}
                onBlur={field.handleBlur}
                onChange={(event) =>
                  field.handleChange(event.target.value as TodoPriority)
                }
                value={field.state.value}
              >
                <option value="low">low</option>
                <option value="medium">medium</option>
                <option value="high">high</option>
              </Select>
            </label>
          )}
        </form.Field>
      </div>

      <form.Field name="dueDate">
        {(field) => (
          <label
            className="flex flex-col gap-1 text-sm font-medium text-slate-700"
            htmlFor={field.name}
          >
            Due Date
            <Input
              id={field.name}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              type="date"
              value={field.state.value ?? ''}
            />
          </label>
        )}
      </form.Field>

      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
