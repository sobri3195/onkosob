import { Button } from '@/components/ui/button'
import type { Store } from '@/store/useLocalStore'

export function InboxAdminPage({store,onRead}:{store:Store;onRead:(id:string)=>void}) {
 return <div className='space-y-2'>{store.inbox.map(m=><div key={m.id} className='rounded border p-3'><p className='font-semibold'>{m.name} {!m.read && <span className='text-xs text-red-600'>baru</span>}</p><p>{m.message}</p><Button className='mt-1' onClick={()=>onRead(m.id)}>Tandai dibaca</Button></div>)}</div>
}
