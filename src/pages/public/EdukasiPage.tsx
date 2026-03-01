import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useMemo, useState } from 'react'
import { BookMarked, BookOpenText, Bookmark, BookmarkCheck, Filter, Sparkles, Tag } from 'lucide-react'
import type { Store } from '@/store/useLocalStore'
import { useLearningProgress } from '@/store/useLearningProgress'

export function EdukasiPage({ store }: { store: Store }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const { state, toggleBookmark } = useLearningProgress()

  const cats = ['all', ...new Set(store.articles.map((a) => a.category))]
  const published = store.articles.filter((article) => article.status === 'publish')

  const list = published.filter((a) => a.title.toLowerCase().includes(q.toLowerCase()) && (cat === 'all' || a.category === cat))

  const continueReading = useMemo(
    () => published.find((article) => article.id === state.lastReadId) ?? published.find((article) => !state.readMap[article.id]),
    [published, state.lastReadId, state.readMap]
  )

  const completedCount = published.filter((article) => state.readMap[article.id]).length
  const progressPercent = published.length ? Math.round((completedCount / published.length) * 100) : 0

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

      <div className='grid gap-3 md:grid-cols-2'>
        <Card className='border-emerald-100 bg-emerald-50/70'>
          <p className='inline-flex items-center gap-2 text-sm font-medium text-emerald-800'>
            <BookMarked size={15} /> Progres belajar Anda
          </p>
          <p className='mt-2 text-sm text-slate-700'>
            {completedCount} dari {published.length} artikel sudah dibaca.
          </p>
          <div className='mt-3 h-2 overflow-hidden rounded-full bg-emerald-100'>
            <div className='h-full rounded-full bg-emerald-500 transition-all' style={{ width: `${progressPercent}%` }} />
          </div>
          <p className='mt-2 text-xs text-emerald-700'>Progres {progressPercent}%</p>
        </Card>

        {continueReading && (
          <Card className='border-blue-100 bg-blue-50/60'>
            <p className='text-xs font-semibold uppercase tracking-wide text-blue-700'>Lanjutkan membaca</p>
            <h2 className='mt-1 text-base font-semibold text-blue-900'>{continueReading.title}</h2>
            <p className='mt-1 text-sm text-slate-600'>{continueReading.excerpt}</p>
            <Link
              className='mt-3 inline-flex items-center gap-2 rounded-full bg-blue-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-800'
              to={`/edukasi/${continueReading.slug}`}
            >
              <BookOpenText size={14} /> Buka artikel
            </Link>
          </Card>
        )}
      </div>

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
        {list.map((a) => {
          const isBookmarked = state.bookmarks.includes(a.id)
          const isRead = !!state.readMap[a.id]

          return (
            <Card key={a.id} className='group border-blue-100 transition duration-200 hover:-translate-y-1 hover:shadow-lg'>
              <div className='flex items-start justify-between gap-2'>
                <p className='inline-flex items-center gap-2 text-xs font-medium text-cyan-700'>
                  <Tag size={13} /> {a.category}
                </p>
                <button
                  type='button'
                  onClick={() => toggleBookmark(a.id)}
                  className='inline-flex items-center gap-1 rounded-full border border-blue-200 px-2 py-1 text-xs text-blue-700 transition hover:bg-blue-100'
                >
                  {isBookmarked ? <BookmarkCheck size={12} /> : <Bookmark size={12} />}
                  {isBookmarked ? 'Tersimpan' : 'Simpan'}
                </button>
              </div>
              <h3 className='mt-2 text-lg font-semibold text-slate-900'>{a.title}</h3>
              <p className='mt-2 text-sm text-slate-600'>{a.excerpt}</p>
              <div className='mt-3 flex items-center justify-between text-xs text-slate-500'>
                <p>Dipublikasikan: {a.createdAt}</p>
                <p className={isRead ? 'text-emerald-700' : 'text-amber-700'}>{isRead ? 'Selesai dibaca' : 'Belum dibaca'}</p>
              </div>
              <Link
                className='mt-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white'
                to={`/edukasi/${a.slug}`}
              >
                <BookOpenText size={14} /> Baca selengkapnya
              </Link>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
