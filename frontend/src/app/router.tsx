import { createMemoryHistory, type RouterHistory } from '@tanstack/history';
import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from '@tanstack/react-router';
import { RootLayout } from '@/app/RootLayout';
import { AccountEditPage } from '@/routes/account/edit/page';
import { TodoDetailPage } from '@/routes/todos/$todoId/page';
import { TodoNewPage } from '@/routes/todos/new/page';
import { TodosListPage } from '@/routes/todos/page';

const rootRoute = createRootRoute({ component: RootLayout });

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    throw redirect({ to: '/todos' });
  },
});

const todosRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/todos',
  component: TodosListPage,
});

const todoNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/todos/new',
  component: TodoNewPage,
});

const todoDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/todos/$todoId',
  component: TodoDetailPage,
});

const accountEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/account/edit',
  component: AccountEditPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  todosRoute,
  todoNewRoute,
  todoDetailRoute,
  accountEditRoute,
]);

export function makeRouter(queryClient: QueryClient, history?: RouterHistory) {
  return createRouter({
    routeTree,
    context: { queryClient },
    history: history ?? createMemoryHistory({ initialEntries: ['/todos'] }),
    defaultPreload: 'intent',
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof makeRouter>;
  }
}
