import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { useState } from 'react'
import type { Store } from '@/store/useLocalStore'

export function EdukasiPage({store}:{store:Store}) {
  const [q,setQ] = useState(''); const [cat,setCat]=useState('all')
  const cats = ['all', ...new Set(store.articles.map(a=>a.category))]
  const list = store.articles.filter(a=>a.status==='publish' && a.title.toLowerCase().includes(q.toLowerCase()) && (cat==='all'||a.category===cat))
  return <div><h1 className='mb-4 text-2xl font-semibold'>Edukasi</h1><div className='mb-4 flex gap-2'><Input placeholder='Cari artikel' value={q} onChange={e=>setQ(e.target.value)}/><select className='rounded border px-2' value={cat} onChange={e=>setCat(e.target.value)}>{cats.map(c=><option key={c}>{c}</option>)}</select></div><div className='grid gap-3 md:grid-cols-2'>{list.map(a=><Card key={a.id}><h3 className='font-semibold'>{a.title}</h3><p>{a.excerpt}</p><p className='text-xs'>{a.category} • {a.createdAt}</p><Link className='text-blue-600' to={`/edukasi/${a.slug}`}>Baca</Link></Card>)}</div></div>
}
