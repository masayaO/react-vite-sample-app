import { createMemoryHistory } from '@tanstack/history';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';

import { makeRouter } from '@/app/router';

function renderApp(initialPath = '/account/edit') {
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

describe('account edit integration', () => {
  test('updates name successfully', async () => {
    const user = userEvent.setup();
    renderApp();

    const input = await screen.findByLabelText('Name');
    await user.clear(input);
    await user.type(input, 'Updated Account');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Account updated.')).toBeInTheDocument();
    expect(await screen.findByText('Updated Account')).toBeInTheDocument();
  });

  test('shows validation error for empty name', async () => {
    const user = userEvent.setup();
    renderApp();

    const input = await screen.findByLabelText('Name');
    await user.clear(input);
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Name is required')).toBeInTheDocument();
  });

  test('shows api error on update failure', async () => {
    const user = userEvent.setup();
    renderApp();

    const input = await screen.findByLabelText('Name');
    await user.clear(input);
    await user.type(input, 'force-error');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Forced API error')).toBeInTheDocument();
  });
});
