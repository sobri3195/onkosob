import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { BookOpenText, CalendarClock, CircleHelp, HeartPulse, Home, Menu, Phone, Route, Search, X } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Beranda', icon: Home, keywords: ['home', 'utama'] },
  { to: '/edukasi', label: 'Edukasi', icon: BookOpenText, keywords: ['artikel', 'materi', 'belajar'] },
  { to: '/jadwal', label: 'Jadwal', icon: CalendarClock, keywords: ['jam', 'layanan', 'kunjungan'] },
  { to: '/panduan', label: 'Panduan', icon: Route, keywords: ['checklist', 'persiapan', 'alur'] },
  { to: '/faq', label: 'FAQ', icon: CircleHelp, keywords: ['pertanyaan', 'bantuan'] },
  { to: '/kontak', label: 'Kontak', icon: Phone, keywords: ['hubungi', 'telepon', 'email'] }
]

export function PublicLayout({ onAdmin }: { onAdmin: () => void }) {
  const [open, setOpen] = useState(false)
  const [commandOpen, setCommandOpen] = useState(false)
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setCommandOpen(true)
      }

      if (event.key === 'Escape') {
        setCommandOpen(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  const quickResults = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return navItems

    return navItems.filter((item) => {
      const text = `${item.label} ${item.keywords.join(' ')}`.toLowerCase()
      return text.includes(normalized)
    })
  }, [query])

  const runCommand = (to: string) => {
    setCommandOpen(false)
    setQuery('')
    navigate(to)
  }

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

          <div className='hidden items-center gap-2 md:flex'>
            <button
              type='button'
              onClick={() => setCommandOpen(true)}
              className='inline-flex items-center gap-2 rounded-full border border-blue-200 px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 dark:border-slate-700 dark:text-slate-200'
            >
              <Search size={14} /> Cari cepat
              <span className='rounded bg-slate-100 px-1.5 py-0.5 text-[10px] dark:bg-slate-800'>Ctrl+K</span>
            </button>
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
            <button type='button' onClick={() => setCommandOpen(true)} className='w-full rounded-md border border-blue-200 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50'>Aksi Cepat</button>
            <Button
              onClick={() => {
                setOpen(false)
                onAdmin()
              }}
              className='w-full'
            >
              Masuk Admin (Demo)
            </Button>
          </div>
        )}
      </nav>

      <main className='mx-auto max-w-6xl p-4 pb-24 md:p-6 md:pb-6'>
        <Outlet />
      </main>

      <nav className='fixed inset-x-0 bottom-0 z-50 border-t border-blue-100 bg-white/95 px-2 py-2 backdrop-blur md:hidden dark:border-slate-800 dark:bg-slate-950/95'>
        <div className='mx-auto grid max-w-6xl grid-cols-6 gap-1'>
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 rounded-lg px-1 py-2 text-[10px] font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-blue-50 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon size={14} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>

      <Dialog open={commandOpen}>
        <DialogContent>
          <div className='space-y-3'>
            <p className='text-xs font-semibold uppercase tracking-wide text-slate-500'>Pusat Navigasi Cepat</p>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoFocus
              placeholder='Cari halaman atau aksi...'
              className='w-full rounded-lg border border-blue-200 px-3 py-2 text-sm outline-none ring-blue-500 focus:ring-2'
            />
            <div className='max-h-72 space-y-1 overflow-y-auto'>
              {quickResults.map((item) => (
                <button
                  key={item.to}
                  type='button'
                  onClick={() => runCommand(item.to)}
                  className='flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm hover:bg-blue-50 dark:hover:bg-slate-800'
                >
                  <span>{item.label}</span>
                  <span className='text-xs text-slate-500'>{item.to}</span>
                </button>
              ))}
              {!quickResults.length && <p className='rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600'>Tidak ada hasil yang cocok.</p>}
            </div>
            <p className='text-xs text-slate-500'>Gunakan Ctrl/Cmd + K untuk membuka pencarian cepat.</p>
          </div>
        </DialogContent>
      </Dialog>

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
