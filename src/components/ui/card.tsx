import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
export const Card = ({className, ...props}: HTMLAttributes<HTMLDivElement>) => <div className={cn('rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900', className)} {...props} />
