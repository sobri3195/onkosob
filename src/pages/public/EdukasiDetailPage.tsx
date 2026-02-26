import { useParams } from 'react-router-dom'
import type { Store } from '@/store/useLocalStore'

export function EdukasiDetailPage({store}:{store:Store}) {
  const {slug=''} = useParams(); const article = store.articles.find(a=>a.slug===slug && a.status==='publish')
  if(!article) return <p>Artikel tidak ditemukan.</p>
  return <article className='prose dark:prose-invert'><h1>{article.title}</h1><p>{article.content}</p></article>
}
