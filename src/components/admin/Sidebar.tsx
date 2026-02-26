import { Menu, LayoutDashboard, BookOpen, CircleHelp, CalendarClock, Megaphone, Inbox, Settings, Home, LogOut } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { Button } from '@/components/ui/button'

const menus = [
  ['Dashboard','/admin/dashboard', LayoutDashboard],
  ['Kelola Edukasi','/admin/edukasi', BookOpen],
  ['Kelola FAQ','/admin/faq', CircleHelp],
  ['Kelola Jadwal','/admin/jadwal', CalendarClock],
  ['Pengumuman','/admin/pengumuman', Megaphone],
  ['Inbox (Demo)','/admin/inbox', Inbox],
  ['Pengaturan','/admin/pengaturan', Settings]
] as const

export function Sidebar({collapsed,toggle,onLogout}:{collapsed:boolean;toggle:()=>void;onLogout:()=>void}) {
  return <aside className={`border-r bg-white p-2 dark:bg-slate-950 ${collapsed?'w-20':'w-64'}`}>
    <Button className='mb-4 w-full' onClick={toggle}><Menu className='mx-auto h-4 w-4' /></Button>
    <div className='space-y-1'>
      {menus.map(([label, to, Icon]) => <NavLink key={to} to={to} className={({isActive})=>`flex items-center gap-2 rounded p-2 ${isActive?'bg-blue-100 dark:bg-slate-800':''}`}><Icon className='h-4 w-4'/>{!collapsed && label}</NavLink>)}
    </div>
    <hr className='my-3'/>
    <Link to='/' className='flex items-center gap-2 rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-800'><Home className='h-4 w-4'/>{!collapsed&&'Kembali ke Publik'}</Link>
    <button onClick={onLogout} className='flex w-full items-center gap-2 rounded p-2 text-left hover:bg-slate-100 dark:hover:bg-slate-800'><LogOut className='h-4 w-4'/>{!collapsed&&'Logout Admin (Demo)'}</button>
  </aside>
}
