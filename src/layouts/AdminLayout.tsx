import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import { Sidebar } from '@/components/admin/Sidebar'

export function AdminLayout({ onLogout }: { onLogout: () => void }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className='admin-shell flex min-h-screen bg-[#f4f6f5] dark:bg-slate-950'>
      <Sidebar collapsed={collapsed} toggle={() => setCollapsed(!collapsed)} onLogout={onLogout} />
      <div className='min-w-0 flex-1'>
        <header className='admin-topbar sticky top-0 z-30 flex min-h-[76px] items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/85 md:px-7'>
          <div><p className='m-0 text-[10px] font-bold uppercase tracking-[.18em] text-[#96732f]'>Ruang operasional</p><strong className='text-sm text-slate-800 dark:text-white'>Panel Admin Lentera</strong></div>
          <div className='flex items-center gap-2'><label className='hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-slate-500 lg:flex'><Search className='h-4 w-4'/><span className='sr-only'>Cari di panel admin</span><input className='w-48 bg-transparent py-2.5 text-sm outline-none' placeholder='Cari modul…'/><kbd className='text-[10px]'>⌘K</kbd></label><button className='relative grid h-11 w-11 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-[#d4a94d] hover:text-[#173d5b]' aria-label='Notifikasi'><Bell className='h-[18px] w-[18px]'/><span className='absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-[#d4a94d]'/></button><div className='grid h-11 w-11 place-items-center rounded-xl bg-[#173d5b] text-xs font-bold text-white' aria-label='Akun admin'>AD</div></div>
        </header>
        <main className='p-4 md:p-7 lg:p-9'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
