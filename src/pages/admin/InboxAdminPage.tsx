import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import type { Store } from '@/store/useLocalStore'

export function InboxAdminPage({ store, onRead }: { store: Store; onRead: (id: string) => void }) {
  const unread = store.inbox.filter((m) => !m.read).length

  return (
    <div className='space-y-3'>
      <Card className='border-blue-100'>
        <p className='text-sm text-slate-600'>Pesan masuk belum dibaca</p>
        <p className='text-2xl font-bold text-blue-700'>{unread}</p>
      </Card>
      {store.inbox.map((m) => (
        <Card key={m.id} className='space-y-2'>
          <p className='font-semibold'>
            {m.name} {!m.read && <span className='text-xs text-red-600'>baru</span>}
          </p>
          <p className='text-sm text-slate-700 dark:text-slate-200'>{m.message}</p>
          {!m.read && (
            <Button className='mt-1' onClick={() => onRead(m.id)}>
              Tandai dibaca
            </Button>
          )}
        </Card>
      ))}
    </div>
  )
}
