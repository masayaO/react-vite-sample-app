import type { HTMLAttributes } from 'react';

import { cn } from '@/shared/lib/utils';

const statusClassName: Record<string, string> = {
  todo: 'bg-slate-200 text-slate-700',
  in_progress: 'bg-amber-100 text-amber-700',
  done: 'bg-emerald-100 text-emerald-700',
};

export function Badge({
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        statusClassName[props.children?.toString() ?? ''] ??
          'bg-slate-200 text-slate-700',
        className,
      )}
      {...props}
    />
  );
}
