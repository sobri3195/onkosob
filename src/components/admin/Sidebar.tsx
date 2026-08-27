import { Menu, LayoutDashboard, BookOpen, CircleHelp, CalendarClock, Megaphone, Inbox, Settings, Home, LogOut, Users, PanelLeftClose } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const menus = [
  ['Dashboard','/admin/dashboard', LayoutDashboard],
  ['Kelola Edukasi','/admin/edukasi', BookOpen],
  ['Kelola FAQ','/admin/faq', CircleHelp],
  ['Kelola Jadwal','/admin/jadwal', CalendarClock],
  ['Pengumuman','/admin/pengumuman', Megaphone],
  ['Inbox (Demo)','/admin/inbox', Inbox],
  ['Modul Pasien','/admin/pasien', Users],
  ['Pengaturan','/admin/pengaturan', Settings]
] as const

export function Sidebar({collapsed,toggle,onLogout}:{collapsed:boolean;toggle:()=>void;onLogout:()=>void}) {
  return <aside className={`admin-sidebar sticky top-0 z-40 hidden h-screen shrink-0 flex-col border-r border-white/10 bg-[#0b1d2d] p-3 text-slate-300 shadow-2xl transition-[width] duration-300 md:flex ${collapsed?'w-20':'w-72'}`}>
    <div className={`mb-6 flex h-16 items-center ${collapsed?'justify-center':'justify-between px-2'}`}><Link to='/' className='flex items-center gap-3' aria-label='Lentera, kembali ke situs'>{!collapsed&&<><span className='grid h-10 w-10 place-items-center rounded-xl bg-[#d4a94d] font-serif text-xl text-[#071426]'>L</span><span><strong className='block font-serif text-lg font-medium text-white'>Lentera</strong><small className='block text-[9px] uppercase tracking-[.19em] text-[#d4a94d]'>Onko Vision</small></span></>}</Link><Button className='h-10 min-h-10 w-10 bg-white/5 p-0 shadow-none hover:bg-white/10' onClick={toggle} aria-label={collapsed?'Perluas sidebar':'Ciutkan sidebar'}>{collapsed?<Menu className='h-4 w-4'/>:<PanelLeftClose className='h-4 w-4'/>}</Button></div>
    {!collapsed&&<p className='mb-2 px-3 text-[10px] font-bold uppercase tracking-[.16em] text-slate-500'>Manajemen</p>}
    <div className='space-y-1'>
      {menus.map(([label, to, Icon]) => <NavLink title={collapsed?label:undefined} key={to} to={to} className={({isActive})=>`group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition-all ${isActive?'bg-[#d4a94d] font-semibold text-[#071426] shadow-lg shadow-black/10':'hover:bg-white/7 hover:text-white'}`}><Icon className='h-[18px] w-[18px] shrink-0'/>{!collapsed && label}</NavLink>)}
    </div>
    <div className='mt-auto space-y-1 border-t border-white/10 pt-3'>
      <Link to='/' className='flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition hover:bg-white/5 hover:text-white' title={collapsed?'Kembali ke publik':undefined}><Home className='h-[18px] w-[18px] shrink-0'/>{!collapsed&&'Kembali ke publik'}</Link>
      <button onClick={onLogout} className='flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-left text-sm text-rose-300 transition hover:bg-rose-400/10'><LogOut className='h-[18px] w-[18px] shrink-0'/>{!collapsed&&'Keluar dari demo'}</button>
    </div>
  </aside>
}
