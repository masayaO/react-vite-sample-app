export { todoKeys } from '@/api/todoApi/keys';
export {
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo,
} from '@/api/todoApi/mutations';
export { useTodo, useTodos } from '@/api/todoApi/queries';
export { todoInputSchema } from '@/api/todoApi/schema';
export type {
  Todo,
  TodoFilters,
  TodoInput,
  TodoPriority,
  TodoStatus,
} from '@/api/todoApi/types';

import {
  useCreateTodo,
  useDeleteTodo,
  useUpdateTodo,
} from '@/api/todoApi/mutations';
import { useTodo, useTodos } from '@/api/todoApi/queries';

export function useTodoApi() {
  return {
    useTodos,
    useTodo,
    useCreateTodo,
    useUpdateTodo,
    useDeleteTodo,
  };
}
