import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import type { Store } from '@/store/useLocalStore'

export function HomePage({store}:{store:Store}) {
  const active = store.announcements.filter(a=>a.isActive)
  return <div className='space-y-6'><section className='rounded-xl bg-blue-50 p-8 dark:bg-slate-900'><h1 className='text-3xl font-bold'>Layanan Pasien Onkologi Radiasi Indonesia</h1><p className='mt-2'>Pusat informasi ramah pasien dan keluarga.</p><div className='mt-4 flex gap-2'>{['/edukasi','/jadwal','/panduan','/faq','/kontak'].map(p=><Link className='rounded bg-blue-600 px-3 py-2 text-white' key={p} to={p}>{p.replace('/','')||'Beranda'}</Link>)}</div></section>
  {!!active.length && <Card><h2 className='font-semibold'>Pengumuman</h2>{active.map(a=><p key={a.id}>• {a.title}: {a.message}</p>)}</Card>}
  <section className='grid gap-3 md:grid-cols-2'>{['Pendaftaran/Rujukan','Persiapan Radioterapi','Efek Samping','Nutrisi & Dukungan'].map(x=><Card key={x}><h3 className='font-semibold'>{x}</h3></Card>)}</section></div>
}
