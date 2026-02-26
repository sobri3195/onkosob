import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Schedule } from '@/data/seed'
import type { Store } from '@/store/useLocalStore'

export function JadwalAdminPage({store,onSave,onDelete}:{store:Store;onSave:(j:Schedule)=>void;onDelete:(id:string)=>void}) {
 const [j,setJ]=useState<Schedule>({id:'',day:'',time:'',service:'',note:''})
 return <div><div className='grid gap-2 md:grid-cols-4'><Input placeholder='Hari' value={j.day} onChange={e=>setJ({...j,day:e.target.value})}/><Input placeholder='Jam' value={j.time} onChange={e=>setJ({...j,time:e.target.value})}/><Input placeholder='Layanan' value={j.service} onChange={e=>setJ({...j,service:e.target.value})}/><Input placeholder='Catatan' value={j.note} onChange={e=>setJ({...j,note:e.target.value})}/></div><Button className='mt-2' onClick={()=>{onSave({...j,id:j.id||crypto.randomUUID()});setJ({id:'',day:'',time:'',service:'',note:''})}}>Simpan</Button>{store.schedules.map(x=><div key={x.id} className='mt-2 flex justify-between rounded border p-2'><span>{x.day} {x.time} - {x.service}</span><div className='space-x-1'><Button onClick={()=>setJ(x)}>Edit</Button><Button className='bg-red-600' onClick={()=>onDelete(x.id)}>Hapus</Button></div></div>)}</div>
}
