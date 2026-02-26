import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
export const Input = ({className,...props}: InputHTMLAttributes<HTMLInputElement>) => <input className={cn('w-full rounded-md border px-3 py-2 text-sm dark:bg-slate-800', className)} {...props} />
