import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/admin/Sidebar'

export function AdminLayout({ onLogout }: { onLogout: () => void }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className='flex min-h-screen bg-slate-50 dark:bg-slate-950'>
      <Sidebar collapsed={collapsed} toggle={() => setCollapsed(!collapsed)} onLogout={onLogout} />
      <div className='flex-1'>
        <header className='border-b border-blue-100 bg-white/80 p-4 font-semibold backdrop-blur dark:border-slate-800 dark:bg-slate-900/80'>
          Panel Admin Demo • Onko Radiasi Indonesia
        </header>
        <main className='p-4 md:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
