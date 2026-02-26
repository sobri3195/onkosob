import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Announcement } from '@/data/seed'
import type { Store } from '@/store/useLocalStore'

export function PengumumanAdminPage({store,onSave,onDelete}:{store:Store;onSave:(p:Announcement)=>void;onDelete:(id:string)=>void}) {
 const [p,setP]=useState<Announcement>({id:'',title:'',message:'',isActive:true,start:'',end:''})
 return <div><Input placeholder='Judul' value={p.title} onChange={e=>setP({...p,title:e.target.value})}/><textarea className='mt-2 w-full rounded border p-2 dark:bg-slate-800' placeholder='Pesan' value={p.message} onChange={e=>setP({...p,message:e.target.value})}/><label className='block py-2'><input type='checkbox' checked={p.isActive} onChange={e=>setP({...p,isActive:e.target.checked})}/> Aktif</label><div className='grid gap-2 md:grid-cols-2'><Input type='date' value={p.start} onChange={e=>setP({...p,start:e.target.value})}/><Input type='date' value={p.end} onChange={e=>setP({...p,end:e.target.value})}/></div><Button className='mt-2' onClick={()=>{onSave({...p,id:p.id||crypto.randomUUID()});setP({id:'',title:'',message:'',isActive:true,start:'',end:''})}}>Simpan</Button>{store.announcements.map(x=><div key={x.id} className='mt-2 flex justify-between rounded border p-2'><span>{x.title}</span><div className='space-x-1'><Button onClick={()=>setP(x)}>Edit</Button><Button className='bg-red-600' onClick={()=>onDelete(x.id)}>Hapus</Button></div></div>)}</div>
}
