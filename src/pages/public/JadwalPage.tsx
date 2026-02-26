import { useState } from 'react'
import { Table } from '@/components/ui/table'
import type { Store } from '@/store/useLocalStore'

export function JadwalPage({store}:{store:Store}) {
  const [day,setDay]=useState('all')
  const days=['all',...new Set(store.schedules.map(s=>s.day))]
  const rows=store.schedules.filter(s=>day==='all'||s.day===day)
  return <div><h1 className='mb-4 text-2xl font-semibold'>Jadwal Layanan</h1><select className='mb-2 rounded border px-2 py-1' value={day} onChange={e=>setDay(e.target.value)}>{days.map(d=><option key={d}>{d}</option>)}</select><Table><thead><tr><th>Hari</th><th>Jam</th><th>Layanan</th><th>Catatan</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.day}</td><td>{r.time}</td><td>{r.service}</td><td>{r.note}</td></tr>)}</tbody></Table><p className='mt-2 text-sm'>* Jadwal bisa berubah.</p></div>
}
