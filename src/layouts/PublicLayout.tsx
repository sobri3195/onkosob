import { Link, NavLink, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function PublicLayout({onAdmin}:{onAdmin:()=>void}) {
  return <div className='min-h-screen'><nav className='sticky top-0 border-b bg-white/90 p-3 backdrop-blur dark:bg-slate-950/90'><div className='mx-auto flex max-w-6xl items-center justify-between'><Link to='/' className='font-bold'>Onko Radiasi Indonesia</Link><div className='flex gap-3 text-sm'>{['/edukasi','/jadwal','/panduan','/faq','/kontak'].map(p=><NavLink key={p} to={p}>{p.replace('/','')||'beranda'}</NavLink>)}</div><Button onClick={onAdmin}>Masuk Admin (Demo)</Button></div></nav><main className='mx-auto max-w-6xl p-4'><Outlet/></main><footer className='border-t p-4 text-center text-sm'>© Layanan Pasien Onkologi Radiasi Indonesia</footer></div>
}
