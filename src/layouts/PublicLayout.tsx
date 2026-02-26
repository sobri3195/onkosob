import { useState } from 'react'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { HeartPulse, Menu, X } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Beranda' },
  { to: '/edukasi', label: 'Edukasi' },
  { to: '/jadwal', label: 'Jadwal' },
  { to: '/panduan', label: 'Panduan' },
  { to: '/faq', label: 'FAQ' },
  { to: '/kontak', label: 'Kontak' }
]

export function PublicLayout({ onAdmin }: { onAdmin: () => void }) {
  const [open, setOpen] = useState(false)

  return (
    <div className='min-h-screen bg-gradient-to-b from-blue-50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900'>
      <nav className='sticky top-0 z-50 border-b border-blue-100 bg-white/90 p-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90'>
        <div className='mx-auto flex max-w-6xl items-center justify-between gap-3'>
          <Link to='/' className='flex items-center gap-2 text-sm font-bold tracking-wide text-blue-900 dark:text-blue-100 md:text-base'>
            <img src='/logo-onko.svg' alt='Logo Onko Radiasi Indonesia' className='h-8 w-8 rounded-lg border border-blue-100 bg-white p-0.5' />
            Onko Radiasi Indonesia
          </Link>

          <div className='hidden items-center gap-4 text-sm md:flex'>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-full px-3 py-1.5 transition ${isActive ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-blue-50 dark:text-slate-200 dark:hover:bg-slate-800'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className='hidden md:block'>
            <Button onClick={onAdmin}>Masuk Admin (Demo)</Button>
          </div>

          <button className='rounded-md border p-2 md:hidden' onClick={() => setOpen((v) => !v)}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {open && (
          <div className='mx-auto mt-3 flex max-w-6xl flex-col gap-2 border-t border-blue-100 pt-3 md:hidden dark:border-slate-800'>
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2 text-sm transition ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-50 dark:hover:bg-slate-800'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Button
              onClick={() => {
                setOpen(false)
                onAdmin()
              }}
              className='mt-2 w-full'
            >
              Masuk Admin (Demo)
            </Button>
          </div>
        )}
      </nav>

      <main className='mx-auto max-w-6xl p-4 md:p-6'>
        <Outlet />
      </main>

      <footer className='border-t border-blue-100 p-6 text-center text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300'>
        <div className='mx-auto flex max-w-6xl flex-col items-center gap-2'>
          <p className='inline-flex items-center gap-2 font-medium text-blue-700 dark:text-blue-200'>
            <HeartPulse size={16} className='animate-pulse-glow rounded-full' />
            Platform edukasi & layanan pasien onkologi radioterapi.
          </p>
          <p>© Layanan Pasien Onkologi Radiasi Indonesia</p>
        </div>
      </footer>
    </div>
  )
}
