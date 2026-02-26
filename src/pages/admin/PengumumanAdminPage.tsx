import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Announcement } from '@/data/seed'
import type { Store } from '@/store/useLocalStore'

export function PengumumanAdminPage({ store, onSave, onDelete }: { store: Store; onSave: (p: Announcement) => void; onDelete: (id: string) => void }) {
  const [p, setP] = useState<Announcement>({ id: '', title: '', message: '', isActive: true, start: '', end: '' })

  return (
    <div className='space-y-3'>
      <Card className='space-y-2'>
        <h2 className='font-semibold'>Kelola Pengumuman</h2>
        <Input placeholder='Judul' value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} />
        <textarea className='mt-2 w-full rounded border p-2 dark:bg-slate-800' placeholder='Pesan' value={p.message} onChange={(e) => setP({ ...p, message: e.target.value })} />
        <label className='block py-2'>
          <input type='checkbox' checked={p.isActive} onChange={(e) => setP({ ...p, isActive: e.target.checked })} /> Aktif
        </label>
        <div className='grid gap-2 md:grid-cols-2'>
          <Input type='date' value={p.start} onChange={(e) => setP({ ...p, start: e.target.value })} />
          <Input type='date' value={p.end} onChange={(e) => setP({ ...p, end: e.target.value })} />
        </div>
        <Button
          className='mt-2'
          onClick={() => {
            onSave({ ...p, id: p.id || crypto.randomUUID() })
            setP({ id: '', title: '', message: '', isActive: true, start: '', end: '' })
          }}
        >
          Simpan
        </Button>
      </Card>

      {store.announcements.map((x) => (
        <div key={x.id} className='mt-2 flex justify-between rounded border bg-white p-2 dark:bg-slate-900'>
          <span>{x.title}</span>
          <div className='space-x-1'>
            <Button onClick={() => setP(x)}>Edit</Button>
            <Button className='bg-red-600' onClick={() => onDelete(x.id)}>
              Hapus
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
