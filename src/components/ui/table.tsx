import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
export const Table = ({className,...props}: HTMLAttributes<HTMLTableElement>) => <table className={cn('w-full text-sm', className)} {...props} />
