import { createMemoryHistory } from '@tanstack/history';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { makeRouter } from '@/app/router';

function renderApp(initialPath = '/todos') {
  const queryClient = new QueryClient();
  const router = makeRouter(
    queryClient,
    createMemoryHistory({ initialEntries: [initialPath] }),
  );

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe('todo app integration', () => {
  test('shows list and navigates to detail', async () => {
    const user = userEvent.setup();
    renderApp('/todos');

    expect(
      await screen.findByText('Set up TanStack Router'),
    ).toBeInTheDocument();

    await user.click(screen.getAllByRole('link', { name: 'View detail' })[0]);
    expect(
      await screen.findByRole('heading', { name: 'Todo Detail' }),
    ).toBeInTheDocument();
  });

  test('creates a todo and returns to list', async () => {
    const user = userEvent.setup();
    renderApp('/todos/new');
    expect(
      await screen.findByRole('heading', { name: 'Create Todo' }),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText('Title'), 'Write integration tests');
    await user.type(
      screen.getByLabelText('Description'),
      'Cover list/new/detail flow.',
    );
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(
      await screen.findByRole('heading', { name: 'Todo List' }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Write integration tests'),
    ).toBeInTheDocument();
  });

  test('updates and deletes todo from detail page', async () => {
    const user = userEvent.setup();
    renderApp('/todos/todo-1');

    const titleInput = await screen.findByLabelText('Title');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated title');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));

    await waitFor(() => {
      expect(screen.getByDisplayValue('Updated title')).toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(
      await screen.findByRole('heading', { name: 'Todo List' }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Updated title')).not.toBeInTheDocument();
  });

  test('shows api error on create failure', async () => {
    const user = userEvent.setup();
    renderApp('/todos/new');
    expect(
      await screen.findByRole('heading', { name: 'Create Todo' }),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText('Title'), 'force-error');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    expect(await screen.findByText('Forced API error')).toBeInTheDocument();
  });
});
