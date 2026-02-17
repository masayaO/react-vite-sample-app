import type {
  Todo,
  TodoFilters,
  TodoInput,
} from '@/features/todos/model/types';
import { apiClient } from '@/shared/api/client';

export async function fetchTodos(filters: TodoFilters): Promise<Todo[]> {
  const response = await apiClient.get<Todo[]>('/todos', {
    params: {
      search: filters.search || undefined,
      status:
        filters.status && filters.status !== 'all' ? filters.status : undefined,
    },
  });
  return response.data;
}

export async function fetchTodo(id: string): Promise<Todo> {
  const response = await apiClient.get<Todo>(`/todos/${id}`);
  return response.data;
}

export async function createTodo(input: TodoInput): Promise<Todo> {
  const response = await apiClient.post<Todo>('/todos', input);
  return response.data;
}

export async function updateTodo(id: string, input: TodoInput): Promise<Todo> {
  const response = await apiClient.patch<Todo>(`/todos/${id}`, input);
  return response.data;
}

export async function deleteTodo(id: string): Promise<void> {
  await apiClient.delete(`/todos/${id}`);
}
