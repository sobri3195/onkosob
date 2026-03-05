import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import type { Store } from '@/store/useLocalStore'
import { Activity, Filter, MapPinned, Users } from 'lucide-react'

type Props = { store: Store }

const provinces = ['Semua', 'DKI Jakarta', 'Jawa Barat', 'Jawa Timur', 'DI Yogyakarta', 'Sumatera Utara', 'Sulawesi Selatan', 'Bali', 'Sumatera Selatan']
const cancerTypes = ['Semua', 'Payudara', 'Serviks', 'Nasofaring', 'Paru', 'Prostat', 'Kolorektal']
const statuses = ['Semua', 'Pemantauan', 'Terapi Aktif', 'Follow-up']

export function PemantauanPage({ store }: Props) {
  const [province, setProvince] = useState('Semua')
  const [cancerType, setCancerType] = useState('Semua')
  const [status, setStatus] = useState('Semua')

  const filtered = useMemo(
    () =>
      store.patientCases.filter(
        (patient) =>
          (province === 'Semua' || patient.province === province) &&
          (cancerType === 'Semua' || patient.cancerType === cancerType) &&
          (status === 'Semua' || patient.status === status)
      ),
    [store.patientCases, province, cancerType, status]
  )

  const regionSummary = useMemo(() => {
    const summary = new Map<string, number>()
    for (const item of filtered) {
      summary.set(item.province, (summary.get(item.province) ?? 0) + 1)
    }
    return [...summary.entries()].sort((a, b) => b[1] - a[1])
  }, [filtered])

  const activeTherapy = filtered.filter((item) => item.status === 'Terapi Aktif').length

  return (
    <div className='space-y-5 md:space-y-6'>
      <section className='rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-5 text-white shadow-xl md:p-8'>
        <p className='inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium'>
          <MapPinned size={14} /> Modul pemantauan kanker nasional
        </p>
        <h1 className='mt-3 text-2xl font-bold md:text-3xl'>Maps Monitoring Pasien Kanker</h1>
        <p className='mt-2 max-w-3xl text-sm text-blue-50 md:text-base'>
          Pantau sebaran pasien berdasarkan wilayah, tipe kanker, stadium, dan status terapi untuk membantu triase layanan lebih cepat.
        </p>
      </section>

      <section className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
        <Card className='border-blue-100'>
          <p className='text-xs text-slate-500'>Total Pasien Terpantau</p>
          <p className='mt-1 inline-flex items-center gap-2 text-2xl font-bold text-blue-700'>
            <Users size={20} /> {filtered.length}
          </p>
        </Card>
        <Card className='border-blue-100'>
          <p className='text-xs text-slate-500'>Terapi Aktif</p>
          <p className='mt-1 inline-flex items-center gap-2 text-2xl font-bold text-rose-600'>
            <Activity size={20} /> {activeTherapy}
          </p>
        </Card>
        <Card className='border-blue-100 sm:col-span-2'>
          <p className='text-xs text-slate-500'>Provinsi dengan kasus terbanyak</p>
          <p className='mt-1 text-lg font-semibold text-slate-800'>{regionSummary[0] ? `${regionSummary[0][0]} (${regionSummary[0][1]} pasien)` : 'Belum ada data'}</p>
        </Card>
      </section>

      <Card className='space-y-3 border-blue-100'>
        <p className='inline-flex items-center gap-2 text-sm font-semibold text-blue-700'>
          <Filter size={16} /> Filter pemantauan
        </p>
        <div className='grid gap-2 sm:grid-cols-3'>
          <select value={province} onChange={(event) => setProvince(event.target.value)} className='rounded-lg border border-blue-200 px-3 py-2 text-sm'>
            {provinces.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select value={cancerType} onChange={(event) => setCancerType(event.target.value)} className='rounded-lg border border-blue-200 px-3 py-2 text-sm'>
            {cancerTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select value={status} onChange={(event) => setStatus(event.target.value)} className='rounded-lg border border-blue-200 px-3 py-2 text-sm'>
            {statuses.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <section className='grid gap-4 lg:grid-cols-[1.2fr_1fr]'>
        <Card className='border-blue-100'>
          <h2 className='text-sm font-semibold text-slate-800'>Peta Sebaran (simulasi berbasis wilayah)</h2>
          <div className='mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3'>
            {regionSummary.map(([region, total]) => (
              <div key={region} className='rounded-xl border border-blue-100 bg-blue-50/70 p-3'>
                <p className='text-xs text-slate-500'>{region}</p>
                <p className='text-lg font-bold text-blue-700'>{total}</p>
                <p className='text-xs text-slate-600'>pasien</p>
              </div>
            ))}
            {!regionSummary.length && <p className='text-sm text-slate-500'>Tidak ada data untuk filter saat ini.</p>}
          </div>
        </Card>

        <Card className='border-blue-100'>
          <h2 className='text-sm font-semibold text-slate-800'>Komposisi tipe kanker</h2>
          <div className='mt-3 space-y-2'>
            {cancerTypes
              .filter((item) => item !== 'Semua')
              .map((type) => {
                const total = filtered.filter((item) => item.cancerType === type).length
                const width = filtered.length ? Math.round((total / filtered.length) * 100) : 0

                return (
                  <div key={type}>
                    <div className='mb-1 flex items-center justify-between text-xs'>
                      <span>{type}</span>
                      <span>{total} pasien</span>
                    </div>
                    <div className='h-2 rounded-full bg-blue-100'>
                      <div className='h-2 rounded-full bg-blue-600 transition-all' style={{ width: `${width}%` }} />
                    </div>
                  </div>
                )
              })}
          </div>
        </Card>
      </section>

      <Card className='border-blue-100'>
        <h2 className='text-sm font-semibold text-slate-800'>Daftar pasien (anonim) untuk pemantauan</h2>
        <div className='mt-3 overflow-x-auto'>
          <table className='min-w-[700px] text-sm'>
            <thead>
              <tr className='text-left text-xs uppercase tracking-wide text-slate-500'>
                <th className='pb-2 pr-3'>Alias</th>
                <th className='pb-2 pr-3'>Wilayah</th>
                <th className='pb-2 pr-3'>Tipe Kanker</th>
                <th className='pb-2 pr-3'>Stadium</th>
                <th className='pb-2 pr-3'>Status</th>
                <th className='pb-2'>Kunjungan Terakhir</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((patient) => (
                <tr key={patient.id} className='border-t border-slate-100 text-slate-700'>
                  <td className='py-2 pr-3 font-medium'>{patient.alias}</td>
                  <td className='py-2 pr-3'>{patient.city}, {patient.province}</td>
                  <td className='py-2 pr-3'>{patient.cancerType}</td>
                  <td className='py-2 pr-3'>{patient.stage}</td>
                  <td className='py-2 pr-3'>{patient.status}</td>
                  <td className='py-2'>{patient.lastVisit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
