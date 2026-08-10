import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowRight, Instagram, Menu, Search, X } from 'lucide-react'
import { BrandLogo } from '../components/shared/BrandLogo'

const navItems = [
  { to: '/', label: 'Beranda' }, { to: '/journey', label: 'Perjalanan' },
  { to: '/learning', label: 'Edukasi' }, { to: '/glossary', label: 'Tools' },
  { to: '/edukasi', label: 'Artikel' }, { to: '/caregiver', label: 'Caregiver' }
]

export function PublicLayout({ onAdmin }: { onAdmin: () => void }) {
  const [open, setOpen] = useState(false); const [scrolled, setScrolled] = useState(false); const [onboarding,setOnboarding]=useState(()=>localStorage.getItem('lentera.onboarding.dismissed')!=='true'); const [palette,setPalette]=useState(false); const location = useLocation()
  useEffect(() => { const update = () => setScrolled(window.scrollY > 24); update(); addEventListener('scroll', update, { passive: true }); return () => removeEventListener('scroll', update) }, [])
  useEffect(() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }, [location.pathname])
  useEffect(()=>{const fn=(event:KeyboardEvent)=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();setPalette(v=>!v)}if(event.key==='Escape')setPalette(false)};addEventListener('keydown',fn);return()=>removeEventListener('keydown',fn)},[])
  const dismiss=()=>{localStorage.setItem('lentera.onboarding.dismissed','true');setOnboarding(false)}
  const go = (to: string) => { setOpen(false); if (to.startsWith('/#')) setTimeout(() => document.getElementById(to.slice(2))?.scrollIntoView({ behavior: 'smooth' }), 40) }
  return <div className='site-frame'>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className='nav-container'><Link to='/' className='brand' aria-label='Lentera Onko Vision, beranda'><BrandLogo variant='horizontal' theme='dark' size='md' decorative/><span className='mobile-brand'><BrandLogo variant='mark' theme='dark' size='md' decorative/><span>Lentera</span></span></Link>
        <nav className='desktop-nav' aria-label='Navigasi utama'>{navItems.map(item => <NavLink key={item.label} to={item.to} className={({ isActive }) => isActive && item.to === '/' ? 'active' : ''}>{item.label}</NavLink>)}</nav>
        <div className='nav-actions'><Link to='/search' className='icon-button' aria-label='Cari semua konten'><Search /></Link><Link to='/start' className='button button-primary'>Mulai Perjalanan <ArrowRight /></Link></div>
        <button className='mobile-trigger' aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      <div className={`mobile-menu ${open ? 'open' : ''}`} aria-hidden={!open}><p>JELAJAHI LENTERA</p>{navItems.map((item, i) => <Link key={item.label} to={item.to} onClick={() => go(item.to)}><span>0{i + 1}</span>{item.label}<ArrowRight /></Link>)}<Link to='/start' className='button button-primary' onClick={() => setOpen(false)}>Mulai Perjalanan</Link></div>
    </header>
    <main><Outlet /></main>
    {onboarding&&<aside className='onboarding-panel'><div><strong>Temukan informasi sesuai perjalanan Anda</strong><p>Lentera dapat membantu Anda menemukan informasi berdasarkan tahap perjalanan yang sedang Anda jalani.</p></div><Link to='/start' onClick={dismiss}>Mulai</Link><button onClick={dismiss}>Jelajahi sendiri</button></aside>}
    {palette&&<div className='palette-backdrop' role='presentation' onMouseDown={()=>setPalette(false)}><section className='command-palette' role='dialog' aria-modal='true' aria-label='Navigasi cepat' onMouseDown={e=>e.stopPropagation()}><header><Search/> Navigasi cepat <kbd>Esc</kbd></header>{[['Mulai perjalanan','/start'],['Buka glosarium','/glossary'],['Buat pertanyaan konsultasi','/questions'],['Buka checklist','/prepare'],['Buka red flags','/red-flags']].map(([label,to])=><Link key={to} to={to} onClick={()=>setPalette(false)}>{label}<ArrowRight/></Link>)}</section></div>}
    <footer className='site-footer'><div className='footer-main'><div className='footer-brand'><Link to='/' className='brand brand-light' aria-label='Lentera Onko Vision, beranda'><BrandLogo variant='horizontal' theme='dark' size='lg' decorative/></Link><p>Understand the journey. Navigate with confidence.</p><a href='https://instagram.com/lentera.onko.vision' target='_blank' rel='noreferrer'><Instagram /> @lentera.onko.vision</a></div><div><h3>Explore</h3><Link to='/journey'>Perjalanan Pasien</Link><Link to='/caregiver'>Untuk Caregiver</Link><Link to='/learning'>Progres Belajar</Link><Link to='/saved'>Tersimpan</Link></div><div><h3>Tools</h3><Link to='/decode'>Decode Report</Link><Link to='/glossary'>Glosarium</Link><Link to='/questions'>Pertanyaan Dokter</Link><Link to='/prepare'>Checklist</Link><Link to='/red-flags'>Red Flags</Link></div><div><h3>Education</h3><Link to='/quiz'>Kuis Mini</Link><Link to='/myth-fact'>Mitos & Fakta</Link><Link to='/edukasi'>Artikel</Link><Link to='/disclaimer'>Privacy & Disclaimer</Link><button className='admin-link' onClick={onAdmin}>Admin demo</button></div></div><div className='footer-bottom'><p>© 2026 Lentera Onko Vision</p><p>Understand the journey. <em>Navigate with confidence.</em></p></div></footer>
  </div>
}
