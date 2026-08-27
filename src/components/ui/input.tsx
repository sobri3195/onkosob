import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
export const Input = ({className,...props}: InputHTMLAttributes<HTMLInputElement>) => <input className={cn('min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-[#2f6652] focus:ring-4 focus:ring-[#2f6652]/10 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white', className)} {...props} />
