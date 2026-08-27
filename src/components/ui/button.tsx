import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Button({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button className={cn('inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#173d5b] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#0f2d46] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a94d] focus-visible:ring-offset-2 active:translate-y-0 disabled:pointer-events-none disabled:opacity-50', className)} {...props} />
}
