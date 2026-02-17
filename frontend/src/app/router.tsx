import { createMemoryHistory, type RouterHistory } from '@tanstack/history';
import type { QueryClient } from '@tanstack/react-query';
import {
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  redirect,
} from '@tanstack/react-router';
import { TodoDetailPage } from '@/routes/todos/$todoId/page';
import { TodoNewPage } from '@/routes/todos/new/page';
import { TodosListPage } from '@/routes/todos/page';

function RootLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f0f9ff,_#f8fafc_55%)]">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <h1 className="text-lg font-semibold text-slate-900">
            Frontend CRUD Sandbox
          </h1>
          <Link
            className="text-sm font-medium text-sky-700 hover:underline"
            to="/todos"
          >
            Todos
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}

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

const routeTree = rootRoute.addChildren([
  indexRoute,
  todosRoute,
  todoNewRoute,
  todoDetailRoute,
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
