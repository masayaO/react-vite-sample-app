import { createBrowserHistory, type RouterHistory } from '@tanstack/history';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { useState } from 'react';

import { makeRouter } from './router';

type AppProps = {
  history?: RouterHistory;
};

export function App({ history }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());
  const [router] = useState(() =>
    makeRouter(queryClient, history ?? createBrowserHistory()),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
