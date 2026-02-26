import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Store } from '@/store/useLocalStore'

export function PengaturanAdminPage({store,onTheme,onContact}:{store:Store;onTheme:()=>void;onContact:(k:string,v:string)=>void}) {
 const c = store.settings.contact
 return <div><Button onClick={onTheme}>Toggle Theme ({store.settings.theme})</Button><div className='mt-3 grid gap-2 md:grid-cols-2'><Input value={c.phone} onChange={e=>onContact('phone', e.target.value)}/><Input value={c.email} onChange={e=>onContact('email', e.target.value)}/><Input value={c.address} onChange={e=>onContact('address', e.target.value)}/><Input value={c.hours} onChange={e=>onContact('hours', e.target.value)}/></div></div>
}
