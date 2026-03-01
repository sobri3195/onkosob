import { Link, useParams } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import type { Store } from '@/store/useLocalStore'
import { useEffect } from 'react'
import { ArrowLeft, Bookmark, BookmarkCheck, CalendarDays } from 'lucide-react'
import { useLearningProgress } from '@/store/useLearningProgress'

export function EdukasiDetailPage({ store }: { store: Store }) {
  const { slug = '' } = useParams()
  const article = store.articles.find((a) => a.slug === slug && a.status === 'publish')
  const { state, markRead, toggleBookmark } = useLearningProgress()

  useEffect(() => {
    if (article) markRead(article.id)
  }, [article, markRead])

  if (!article) return <p>Artikel tidak ditemukan.</p>

  const related = store.articles.filter((item) => item.status === 'publish' && item.category === article.category && item.id !== article.id).slice(0, 2)
  const isBookmarked = state.bookmarks.includes(article.id)

  return (
    <div className='space-y-4'>
      <Link to='/edukasi' className='inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:underline'>
        <ArrowLeft size={14} /> Kembali ke edukasi
      </Link>

      <article className='prose max-w-none rounded-xl border border-blue-100 bg-white p-5 dark:prose-invert dark:border-slate-700 dark:bg-slate-900'>
        <p className='inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700'>
          <CalendarDays size={12} /> {article.createdAt}
        </p>
        <h1>{article.title}</h1>
        <p>{article.content}</p>

        <button
          type='button'
          onClick={() => toggleBookmark(article.id)}
          className='not-prose mt-4 inline-flex items-center gap-2 rounded-full border border-blue-200 px-3 py-1.5 text-sm font-medium text-blue-700 transition hover:bg-blue-50'
        >
          {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
          {isBookmarked ? 'Artikel tersimpan' : 'Simpan artikel'}
        </button>
      </article>

      {!!related.length && (
        <Card className='border-blue-100'>
          <h2 className='text-sm font-semibold text-slate-900'>Artikel terkait</h2>
          <div className='mt-2 space-y-2'>
            {related.map((item) => (
              <Link key={item.id} to={`/edukasi/${item.slug}`} className='block rounded-lg bg-blue-50 px-3 py-2 text-sm text-blue-700 hover:bg-blue-100'>
                {item.title}
              </Link>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
