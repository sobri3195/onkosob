import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { PatientCase } from '@/data/seed'
import type { Store } from '@/store/useLocalStore'

type Props = {
  store: Store
  onSave: (patient: PatientCase) => void
  onDelete: (id: string) => void
}

const cancerTypes: PatientCase['cancerType'][] = ['Payudara', 'Serviks', 'Nasofaring', 'Paru', 'Prostat', 'Kolorektal']
const stages: PatientCase['stage'][] = ['I', 'II', 'III', 'IV']
const statuses: PatientCase['status'][] = ['Pemantauan', 'Terapi Aktif', 'Follow-up']

const emptyPatient: PatientCase = {
  id: '',
  alias: '',
  city: '',
  province: '',
  cancerType: 'Payudara',
  stage: 'I',
  status: 'Pemantauan',
  lastVisit: ''
}

export function PasienAdminPage({ store, onSave, onDelete }: Props) {
  const [patient, setPatient] = useState<PatientCase>(emptyPatient)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return store.patientCases

    return store.patientCases.filter((item) => `${item.alias} ${item.city} ${item.province} ${item.cancerType} ${item.status}`.toLowerCase().includes(q))
  }, [store.patientCases, search])

  const therapyActiveCount = store.patientCases.filter((item) => item.status === 'Terapi Aktif').length

  return (
    <div className='space-y-4'>
      <Card className='border-blue-100 bg-gradient-to-r from-blue-600 to-cyan-600 text-white'>
        <p className='text-sm opacity-90'>Modul Pasien</p>
        <h1 className='text-2xl font-semibold'>Kelola data pasien anonim</h1>
        <p className='mt-1 text-sm text-blue-50'>Mendukung update status terapi, wilayah pasien, dan ringkasan monitoring layanan.</p>
      </Card>

      <section className='grid gap-3 md:grid-cols-3'>
        <Card className='border-blue-100'>
          <p className='text-xs text-slate-500'>Total pasien</p>
          <p className='text-2xl font-bold text-blue-700'>{store.patientCases.length}</p>
        </Card>
        <Card className='border-blue-100'>
          <p className='text-xs text-slate-500'>Terapi aktif</p>
          <p className='text-2xl font-bold text-rose-600'>{therapyActiveCount}</p>
        </Card>
        <Card className='border-blue-100'>
          <p className='text-xs text-slate-500'>Provinsi aktif</p>
          <p className='text-2xl font-bold text-emerald-600'>{new Set(store.patientCases.map((item) => item.province)).size}</p>
        </Card>
      </section>

      <Card className='space-y-3 border-blue-100'>
        <h2 className='font-semibold'>Form pasien</h2>
        <div className='grid gap-2 md:grid-cols-2 lg:grid-cols-4'>
          <Input placeholder='Alias pasien (anonim)' value={patient.alias} onChange={(event) => setPatient({ ...patient, alias: event.target.value })} />
          <Input placeholder='Kota' value={patient.city} onChange={(event) => setPatient({ ...patient, city: event.target.value })} />
          <Input placeholder='Provinsi' value={patient.province} onChange={(event) => setPatient({ ...patient, province: event.target.value })} />
          <Input type='date' value={patient.lastVisit} onChange={(event) => setPatient({ ...patient, lastVisit: event.target.value })} />
          <select className='rounded-lg border border-blue-200 px-3 py-2 text-sm' value={patient.cancerType} onChange={(event) => setPatient({ ...patient, cancerType: event.target.value as PatientCase['cancerType'] })}>
            {cancerTypes.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select className='rounded-lg border border-blue-200 px-3 py-2 text-sm' value={patient.stage} onChange={(event) => setPatient({ ...patient, stage: event.target.value as PatientCase['stage'] })}>
            {stages.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select className='rounded-lg border border-blue-200 px-3 py-2 text-sm' value={patient.status} onChange={(event) => setPatient({ ...patient, status: event.target.value as PatientCase['status'] })}>
            {statuses.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
        <div className='flex flex-wrap gap-2'>
          <Button
            onClick={() => {
              if (!patient.alias || !patient.city || !patient.province || !patient.lastVisit) return
              onSave({ ...patient, id: patient.id || crypto.randomUUID() })
              setPatient(emptyPatient)
            }}
          >
            {patient.id ? 'Update Pasien' : 'Simpan Pasien'}
          </Button>
          <Button className='bg-slate-700 hover:bg-slate-800' onClick={() => setPatient(emptyPatient)}>
            Reset Form
          </Button>
        </div>
      </Card>

      <Card className='space-y-3 border-blue-100'>
        <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between'>
          <h2 className='font-semibold'>Daftar pasien anonim</h2>
          <Input placeholder='Cari pasien, wilayah, tipe kanker...' className='max-w-sm' value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>

        <div className='overflow-x-auto'>
          <table className='min-w-[900px] text-sm'>
            <thead>
              <tr className='text-left text-xs uppercase tracking-wide text-slate-500'>
                <th className='pb-2 pr-3'>Alias</th>
                <th className='pb-2 pr-3'>Wilayah</th>
                <th className='pb-2 pr-3'>Tipe Kanker</th>
                <th className='pb-2 pr-3'>Stadium</th>
                <th className='pb-2 pr-3'>Status</th>
                <th className='pb-2 pr-3'>Kunjungan</th>
                <th className='pb-2'>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className='border-t border-slate-100'>
                  <td className='py-2 pr-3 font-medium'>{item.alias}</td>
                  <td className='py-2 pr-3'>{item.city}, {item.province}</td>
                  <td className='py-2 pr-3'>{item.cancerType}</td>
                  <td className='py-2 pr-3'>{item.stage}</td>
                  <td className='py-2 pr-3'>{item.status}</td>
                  <td className='py-2 pr-3'>{item.lastVisit}</td>
                  <td className='py-2'>
                    <div className='flex gap-1'>
                      <Button onClick={() => setPatient(item)}>Edit</Button>
                      <Button className='bg-red-600 hover:bg-red-700' onClick={() => onDelete(item.id)}>Hapus</Button>
                    </div>
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={7} className='py-6 text-center text-slate-500'>
                    Tidak ada data pasien sesuai kata kunci.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
