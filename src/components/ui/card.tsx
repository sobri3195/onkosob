import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
export const Card = ({className, ...props}: HTMLAttributes<HTMLDivElement>) => <div className={cn('rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_10px_35px_rgba(15,35,55,.06)] transition-shadow duration-300 hover:shadow-[0_16px_45px_rgba(15,35,55,.1)] dark:border-slate-800 dark:bg-slate-900', className)} {...props} />
