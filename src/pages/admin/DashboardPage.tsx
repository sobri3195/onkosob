import { Card } from '@/components/ui/card'
import type { Store } from '@/store/useLocalStore'

export function DashboardPage({store}:{store:Store}) {
 const stats=[['Artikel',store.articles.length],['FAQ',store.faqs.length],['Jadwal',store.schedules.length],['Pengumuman',store.announcements.length],['Inbox belum dibaca',store.inbox.filter(i=>!i.read).length]]
 return <div className='grid gap-3 md:grid-cols-3'>{stats.map(([k,v])=><Card key={String(k)}><p className='text-sm'>{k}</p><p className='text-2xl font-bold'>{String(v)}</p></Card>)}</div>
}
