import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Store } from '@/store/useLocalStore'

export function KontakPage({store,onSubmit}:{store:Store;onSubmit:(v:{name:string;phone?:string;email?:string;message:string})=>void}) {
  const [form,setForm]=useState({name:'',phone:'',email:'',message:''})
  return <div className='grid gap-5 md:grid-cols-2'><div><h1 className='text-2xl font-semibold'>Kontak</h1><p>Telepon: {store.settings.contact.phone}</p><p>Email: {store.settings.contact.email}</p><p>Alamat: {store.settings.contact.address}</p><p>Jam: {store.settings.contact.hours}</p></div><form className='space-y-2' onSubmit={e=>{e.preventDefault();onSubmit(form);setForm({name:'',phone:'',email:'',message:''})}}><Input required placeholder='Nama' value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><Input placeholder='No HP' value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><Input placeholder='Email' value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><textarea required className='w-full rounded-md border p-2 dark:bg-slate-800' placeholder='Pesan' value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/><Button>Kirim</Button></form></div>
}
