import {
  createBrowserHistory,
  createMemoryHistory,
  type RouterHistory,
} from '@tanstack/history';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { routeTree } from './routeTree.gen';

function buildRouter(queryClient: QueryClient, history: RouterHistory) {
  return createRouter({
    routeTree,
    context: { queryClient },
    history,
    defaultPreload: 'intent',
    Wrap: ({ children }: { children: ReactNode }) => {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    },
  });
}

const queryClient = new QueryClient();

export const router = buildRouter(queryClient, createBrowserHistory());

export function makeRouter(queryClient: QueryClient, history?: RouterHistory) {
  return buildRouter(
    queryClient,
    history ?? createMemoryHistory({ initialEntries: ['/todos'] }),
  );
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
