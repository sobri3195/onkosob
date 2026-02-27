import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import { BookOpenText, Filter, Sparkles, Tag } from 'lucide-react'
import type { Store } from '@/store/useLocalStore'

export function EdukasiPage({ store }: { store: Store }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')

  const cats = ['all', ...new Set(store.articles.map((a) => a.category))]
  const list = store.articles.filter(
    (a) => a.status === 'publish' && a.title.toLowerCase().includes(q.toLowerCase()) && (cat === 'all' || a.category === cat)
  )

  return (
    <div className='space-y-5'>
      <section className='rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 p-5 text-white shadow-lg md:p-7'>
        <p className='inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium'>
          <Sparkles size={14} /> Konten tervalidasi tim medis
        </p>
        <h1 className='mt-3 text-2xl font-bold md:text-3xl'>Pusat Edukasi Pasien Onkologi Radiasi</h1>
        <p className='mt-2 max-w-3xl text-sm text-cyan-50 md:text-base'>
          Temukan materi persiapan terapi, pemantauan efek samping, hingga dukungan keluarga dalam format yang mudah dipahami.
        </p>
      </section>

      <Card className='space-y-3 border-blue-100 bg-blue-50/60'>
        <p className='inline-flex items-center gap-2 text-sm font-medium text-blue-800'>
          <Filter size={15} /> Cari artikel sesuai kebutuhan Anda
        </p>
        <div className='grid gap-2 md:grid-cols-[1fr_220px]'>
          <Input placeholder='Cari artikel edukasi...' value={q} onChange={(e) => setQ(e.target.value)} />
          <select className='rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm' value={cat} onChange={(e) => setCat(e.target.value)}>
            {cats.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <p className='text-xs text-slate-600'>Menampilkan {list.length} artikel untuk kategori {cat === 'all' ? 'semua topik' : cat}.</p>
      </Card>

      <div className='grid gap-3 md:grid-cols-2'>
        {list.map((a) => (
          <Card key={a.id} className='group border-blue-100 transition duration-200 hover:-translate-y-1 hover:shadow-lg'>
            <p className='inline-flex items-center gap-2 text-xs font-medium text-cyan-700'>
              <Tag size={13} /> {a.category}
            </p>
            <h3 className='mt-2 text-lg font-semibold text-slate-900'>{a.title}</h3>
            <p className='mt-2 text-sm text-slate-600'>{a.excerpt}</p>
            <p className='mt-3 text-xs text-slate-500'>Dipublikasikan: {a.createdAt}</p>
            <Link
              className='mt-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white'
              to={`/edukasi/${a.slug}`}
            >
              <BookOpenText size={14} /> Baca selengkapnya
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}
