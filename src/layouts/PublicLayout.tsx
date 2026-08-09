import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { ArrowRight, Instagram, Lamp, Menu, Search, X } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Beranda' }, { to: '/#perjalanan', label: 'Perjalanan Kanker' },
  { to: '/edukasi', label: 'Kenali Kanker' }, { to: '/panduan', label: 'Terapi' },
  { to: '/pasien', label: 'Pendamping Pasien' }, { to: '/faq', label: 'Artikel & FAQ' }
]

export function PublicLayout({ onAdmin }: { onAdmin: () => void }) {
  const [open, setOpen] = useState(false); const [scrolled, setScrolled] = useState(false); const location = useLocation()
  useEffect(() => { const update = () => setScrolled(window.scrollY > 24); update(); addEventListener('scroll', update, { passive: true }); return () => removeEventListener('scroll', update) }, [])
  useEffect(() => { setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }) }, [location.pathname])
  const go = (to: string) => { setOpen(false); if (to.startsWith('/#')) setTimeout(() => document.getElementById(to.slice(2))?.scrollIntoView({ behavior: 'smooth' }), 40) }
  return <div className='site-frame'>
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className='nav-container'><Link to='/' className='brand' aria-label='Lentera Onko Vision, beranda'><span className='brand-mark'><Lamp /></span><span><strong>Lentera Onko</strong><small>VISION</small></span></Link>
        <nav className='desktop-nav' aria-label='Navigasi utama'>{navItems.map(item => <NavLink key={item.label} to={item.to} className={({ isActive }) => isActive && item.to === '/' ? 'active' : ''}>{item.label}</NavLink>)}</nav>
        <div className='nav-actions'><Link to='/edukasi' className='icon-button' aria-label='Cari artikel'><Search /></Link><a href='/#perjalanan' className='button button-primary' onClick={() => go('/#perjalanan')}>Mulai Perjalanan <ArrowRight /></a></div>
        <button className='mobile-trigger' aria-label={open ? 'Tutup menu' : 'Buka menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
      </div>
      <div className={`mobile-menu ${open ? 'open' : ''}`} aria-hidden={!open}><p>JELAJAHI LENTERA</p>{navItems.map((item, i) => <Link key={item.label} to={item.to} onClick={() => go(item.to)}><span>0{i + 1}</span>{item.label}<ArrowRight /></Link>)}<Link to='/#perjalanan' className='button button-primary' onClick={() => go('/#perjalanan')}>Mulai Perjalanan</Link></div>
    </header>
    <main><Outlet /></main>
    <footer className='site-footer'><div className='footer-main'><div className='footer-brand'><Link to='/' className='brand brand-light'><span className='brand-mark'><Lamp /></span><span><strong>Lentera Onko</strong><small>VISION</small></span></Link><p>Menyinari perjalanan kanker dengan edukasi dan navigasi yang lebih mudah dipahami.</p><a href='https://instagram.com/lentera.onko.vision' target='_blank' rel='noreferrer'><Instagram /> @lentera.onko.vision</a></div><div><h3>Explore</h3><Link to='/edukasi'>Tentang Kanker</Link><Link to='/#perjalanan'>Perjalanan Pasien</Link><Link to='/pasien'>Untuk Caregiver</Link><Link to='/pemantauan'>Survivorship</Link></div><div><h3>Resources</h3><Link to='/edukasi'>Artikel</Link><Link to='/faq'>FAQ</Link><Link to='/#glosarium'>Glosarium</Link><Link to='/panduan'>Checklist</Link></div><div><h3>Organization</h3><Link to='/kontak'>Tentang Kami</Link><Link to='/disclaimer'>Prinsip Editorial</Link><Link to='/kontak'>Kontak</Link><Link to='/disclaimer'>Privacy & Disclaimer</Link><button className='admin-link' onClick={onAdmin}>Admin demo</button></div></div><div className='footer-bottom'><p>© 2026 Lentera Onko Vision</p><p>Understand the journey. <em>Navigate with confidence.</em></p></div></footer>
  </div>
}
