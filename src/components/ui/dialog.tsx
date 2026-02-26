import { ReactNode } from 'react'
export function Dialog({open, children}: {open:boolean;children:ReactNode}) { return open ? <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50'>{children}</div> : null }
export const DialogContent = ({children}:{children:ReactNode}) => <div className='w-full max-w-xl rounded-lg bg-white p-4 dark:bg-slate-900'>{children}</div>
