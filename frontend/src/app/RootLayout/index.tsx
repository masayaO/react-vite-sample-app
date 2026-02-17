import { Link, Outlet } from '@tanstack/react-router';
import { CircleUserRound } from 'lucide-react';

import { useAccountApi } from '@/api/accountApi';

function AccountMenu() {
  const accountApi = useAccountApi();
  const accountQuery = accountApi.useAccount();

  return (
    <details className="relative">
      <summary className="list-none cursor-pointer rounded-md px-2 py-1 text-sm text-slate-700 hover:bg-slate-100">
        <span className="inline-flex items-center gap-2">
          <CircleUserRound className="h-4 w-4" />
          {accountQuery.data?.name ?? 'Loading account...'}
        </span>
      </summary>
      <div className="absolute right-0 z-10 mt-2 w-40 rounded-md border border-slate-200 bg-white p-1 shadow-lg">
        <Link
          className="block rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
          to="/account/edit"
        >
          Edit account
        </Link>
      </div>
    </details>
  );
}

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#f0f9ff,_#f8fafc_55%)]">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <h1 className="text-lg font-semibold text-slate-900">
            Frontend CRUD Sandbox
          </h1>
          <div className="flex items-center gap-3">
            <Link
              className="text-sm font-medium text-sky-700 hover:underline"
              to="/todos"
            >
              Todos
            </Link>
            <AccountMenu />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
