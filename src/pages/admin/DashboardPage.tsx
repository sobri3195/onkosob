import { Card } from '@/components/ui/card'
import type { Store } from '@/store/useLocalStore'

export function DashboardPage({ store }: { store: Store }) {
  const stats = [
    ['Artikel', store.articles.length],
    ['FAQ', store.faqs.length],
    ['Jadwal', store.schedules.length],
    ['Pengumuman', store.announcements.length],
    ['Inbox belum dibaca', store.inbox.filter((i) => !i.read).length]
  ]

  return (
    <div className='space-y-4'>
      <Card className='border-blue-100 bg-gradient-to-r from-blue-600 to-cyan-600 text-white'>
        <p className='text-sm opacity-90'>Ringkasan Admin</p>
        <h1 className='text-2xl font-semibold'>Kontrol pusat layanan pasien</h1>
      </Card>
      <div className='grid gap-3 md:grid-cols-3'>
        {stats.map(([k, v]) => (
          <Card key={String(k)} className='border-blue-100'>
            <p className='text-sm text-slate-600'>{k}</p>
            <p className='text-2xl font-bold text-blue-700'>{String(v)}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
