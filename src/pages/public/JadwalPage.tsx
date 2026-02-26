import { useState } from 'react'
import { Table } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import type { Store } from '@/store/useLocalStore'

export function JadwalPage({ store }: { store: Store }) {
  const [day, setDay] = useState('all')
  const days = ['all', ...new Set(store.schedules.map((s) => s.day))]
  const rows = store.schedules.filter((s) => day === 'all' || s.day === day)

  return (
    <div>
      <h1 className='mb-4 text-2xl font-semibold'>Jadwal Layanan</h1>

      <select className='mb-3 w-full rounded-lg border px-3 py-2 md:mb-4 md:w-72' value={day} onChange={(e) => setDay(e.target.value)}>
        {days.map((d) => (
          <option key={d}>{d}</option>
        ))}
      </select>

      <div className='hidden overflow-x-auto rounded-xl border md:block'>
        <Table>
          <thead className='bg-slate-100 dark:bg-slate-800'>
            <tr>
              <th className='p-3 text-left'>Hari</th>
              <th className='p-3 text-left'>Jam</th>
              <th className='p-3 text-left'>Layanan</th>
              <th className='p-3 text-left'>Catatan</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className='border-t'>
                <td className='p-3'>{r.day}</td>
                <td className='p-3'>{r.time}</td>
                <td className='p-3'>{r.service}</td>
                <td className='p-3'>{r.note}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className='space-y-3 md:hidden'>
        {rows.map((r) => (
          <Card key={r.id} className='border-blue-100'>
            <p className='text-sm font-semibold text-blue-700'>{r.day}</p>
            <p className='text-sm'>{r.time}</p>
            <p className='mt-1 font-medium'>{r.service}</p>
            <p className='mt-1 text-xs text-slate-600'>{r.note}</p>
          </Card>
        ))}
      </div>

      <p className='mt-3 text-sm text-slate-600'>* Jadwal dapat berubah sesuai kondisi klinis dan hari libur nasional.</p>
    </div>
  )
}
