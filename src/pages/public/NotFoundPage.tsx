import { ArrowLeft, Lamp } from 'lucide-react'
import { Link } from 'react-router-dom'

export function NotFoundPage() {
  return <section className='not-found'>
    <div className='not-found-glow'><Lamp aria-hidden='true' /></div>
    <p>404 · LENTERA ONKO VISION</p>
    <h1>Jalannya belum ditemukan.</h1>
    <span>Mari kembali ke bagian yang sudah kami terangi.</span>
    <Link className='button button-primary' to='/'><ArrowLeft /> Kembali ke Beranda</Link>
  </section>
}
