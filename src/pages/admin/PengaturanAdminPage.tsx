import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import type { Store } from '@/store/useLocalStore'

export function PengaturanAdminPage({ store, onTheme, onContact }: { store: Store; onTheme: () => void; onContact: (k: string, v: string) => void }) {
  const c = store.settings.contact

  return (
    <div className='space-y-3'>
      <Card className='space-y-3'>
        <h2 className='font-semibold'>Preferensi Tampilan</h2>
        <Button onClick={onTheme}>Toggle Theme ({store.settings.theme})</Button>
      </Card>
      <Card className='space-y-3'>
        <h2 className='font-semibold'>Informasi Kontak Publik</h2>
        <div className='grid gap-2 md:grid-cols-2'>
          <Input value={c.phone} onChange={(e) => onContact('phone', e.target.value)} placeholder='Nomor telepon' />
          <Input value={c.email} onChange={(e) => onContact('email', e.target.value)} placeholder='Email' />
          <Input value={c.address} onChange={(e) => onContact('address', e.target.value)} placeholder='Alamat' />
          <Input value={c.hours} onChange={(e) => onContact('hours', e.target.value)} placeholder='Jam layanan' />
        </div>
      </Card>
    </div>
  )
}
