import { useMemo, useState } from 'react'
import { CalendarDays, Clock3, Info, ShieldCheck } from 'lucide-react'
import { Table } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import type { Store } from '@/store/useLocalStore'

export function JadwalPage({ store }: { store: Store }) {
  const [day, setDay] = useState('all')
  const days = ['all', ...new Set(store.schedules.map((s) => s.day))]
  const rows = store.schedules.filter((s) => day === 'all' || s.day === day)

  const busiestDay = useMemo(() => {
    const counts = store.schedules.reduce<Record<string, number>>((acc, item) => {
      acc[item.day] = (acc[item.day] ?? 0) + 1
      return acc
    }, {})

    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return top ? `${top[0]} (${top[1]} sesi)` : '-'
  }, [store.schedules])

  return (
    <div className='space-y-4'>
      <section className='rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 p-5 text-white shadow-lg md:p-7'>
        <h1 className='text-2xl font-bold md:text-3xl'>Jadwal Layanan Onkologi Radiasi</h1>
        <p className='mt-2 max-w-2xl text-sm text-cyan-50'>
          Lihat jam layanan berdasarkan hari kunjungan agar proses registrasi dan terapi berjalan lebih lancar.
        </p>
      </section>

      <section className='grid gap-3 md:grid-cols-3'>
        <Card className='border-blue-100'>
          <p className='inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-blue-700'>
            <CalendarDays size={14} /> Total sesi
          </p>
          <p className='mt-2 text-2xl font-bold text-slate-900'>{store.schedules.length}</p>
          <p className='text-sm text-slate-600'>Jadwal tersedia minggu ini</p>
        </Card>

        <Card className='border-blue-100'>
          <p className='inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-blue-700'>
            <Clock3 size={14} /> Hari terpadat
          </p>
          <p className='mt-2 text-lg font-bold text-slate-900'>{busiestDay}</p>
          <p className='text-sm text-slate-600'>Pertimbangkan datang lebih awal</p>
        </Card>

        <Card className='border-blue-100'>
          <p className='inline-flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-blue-700'>
            <ShieldCheck size={14} /> Prioritas layanan
          </p>
          <p className='mt-2 text-lg font-bold text-slate-900'>Terapi aktif & evaluasi</p>
          <p className='text-sm text-slate-600'>Konfirmasi jadwal ke admin bila ada perubahan</p>
        </Card>
      </section>

      <Card className='border-blue-100 bg-blue-50/50'>
        <p className='text-sm font-medium text-blue-800'>Filter hari kunjungan</p>
        <select className='mt-2 w-full rounded-lg border border-blue-200 bg-white px-3 py-2 md:w-72' value={day} onChange={(e) => setDay(e.target.value)}>
          {days.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </Card>

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
                <td className='p-3 font-medium'>{r.service}</td>
                <td className='p-3 text-sm text-slate-600'>{r.note}</td>
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

      <p className='inline-flex items-start gap-2 text-sm text-slate-600'>
        <Info size={16} className='mt-0.5 text-blue-700' />
        Jadwal dapat berubah sesuai kondisi klinis, hari libur nasional, dan kebutuhan kalibrasi mesin.
      </p>
    </div>
  )
}
