import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import type { FAQ } from '@/data/seed'
import type { Store } from '@/store/useLocalStore'

export function FAQAdminPage({store,onSave,onDelete,onMove}:{store:Store;onSave:(f:FAQ)=>void;onDelete:(id:string)=>void;onMove:(id:string,d:number)=>void}) {
 const [f,setF]=useState<FAQ>({id:'',question:'',answer:'',category:''})
 return <div><div className='mb-2 flex gap-2'><Input placeholder='Pertanyaan' value={f.question} onChange={e=>setF({...f,question:e.target.value})}/><Input placeholder='Kategori' value={f.category} onChange={e=>setF({...f,category:e.target.value})}/><Button onClick={()=>{onSave({...f,id:f.id||crypto.randomUUID()});setF({id:'',question:'',answer:'',category:''})}}>Simpan</Button></div><textarea className='mb-3 w-full rounded border p-2 dark:bg-slate-800' placeholder='Jawaban' value={f.answer} onChange={e=>setF({...f,answer:e.target.value})}/>{store.faqs.map(x=><div key={x.id} className='mb-1 flex items-center justify-between rounded border p-2'><span>{x.question}</span><div className='space-x-1'><Button className='bg-slate-600' onClick={()=>onMove(x.id,-1)}>↑</Button><Button className='bg-slate-600' onClick={()=>onMove(x.id,1)}>↓</Button><Button onClick={()=>setF(x)}>Edit</Button><Button className='bg-red-600' onClick={()=>onDelete(x.id)}>Hapus</Button></div></div>)}</div>
}
