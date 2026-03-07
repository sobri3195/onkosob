import { useMemo, useState } from 'react'
import { BellRing, CalendarClock, ClipboardCheck, Pill, Sparkles, Stethoscope, Users2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { Store } from '@/store/useLocalStore'

type Props = { store: Store }

const symptomTips = [
  { label: 'Nyeri', recommendation: 'Gunakan skala 0-10 lalu laporkan bila >6 selama 2 hari berturut-turut.' },
  { label: 'Mual', recommendation: 'Makan porsi kecil namun sering dan jaga hidrasi minimal 2 liter/hari.' },
  { label: 'Kelelahan', recommendation: 'Bagi aktivitas dalam sesi singkat dan sisipkan istirahat terjadwal.' }
]

export function PasienPage({ store }: Props) {
  const [selectedId, setSelectedId] = useState(store.patientCases[0]?.id ?? '')

  const selectedPatient = useMemo(() => store.patientCases.find((item) => item.id === selectedId) ?? store.patientCases[0], [store.patientCases, selectedId])

  const todayAgenda = useMemo(
    () =>
      store.schedules
        .slice(0, 3)
        .map((item) => `${item.day} • ${item.time} • ${item.service}`),
    [store.schedules]
  )

  const patientStatusTone: Record<(typeof store.patientCases)[number]['status'], string> = {
    'Terapi Aktif': 'bg-rose-100 text-rose-700',
    Pemantauan: 'bg-blue-100 text-blue-700',
    'Follow-up': 'bg-emerald-100 text-emerald-700'
  }

  return (
    <div className='space-y-5 md:space-y-6'>
      <section className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 p-6 text-white shadow-xl md:p-8'>
        <div className='animate-shimmer absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.14)_30%,transparent_65%)]' />
        <div className='relative'>
          <p className='inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium'>
            <Sparkles size={14} /> Modul Pasien Cerdas
          </p>
          <h1 className='mt-3 text-2xl font-bold md:text-3xl'>Dasbor pendamping pasien onkologi</h1>
          <p className='mt-2 max-w-3xl text-sm text-blue-50 md:text-base'>
            Pantau status terapi, agenda layanan, dan pengingat harian secara personal agar perjalanan terapi lebih terarah.
          </p>
        </div>
      </section>

      <section className='grid gap-3 md:grid-cols-3'>
        <Card className='border-indigo-100 bg-gradient-to-br from-indigo-50 to-white'>
          <p className='text-xs text-slate-500'>Total profil pasien</p>
          <p className='mt-1 inline-flex items-center gap-2 text-2xl font-bold text-indigo-700'>
            <Users2 size={20} /> {store.patientCases.length}
          </p>
        </Card>
        <Card className='border-blue-100 bg-gradient-to-br from-blue-50 to-white'>
          <p className='text-xs text-slate-500'>Jadwal layanan aktif</p>
          <p className='mt-1 inline-flex items-center gap-2 text-2xl font-bold text-blue-700'>
            <CalendarClock size={20} /> {store.schedules.length}
          </p>
        </Card>
        <Card className='border-cyan-100 bg-gradient-to-br from-cyan-50 to-white'>
          <p className='text-xs text-slate-500'>Topik edukasi tersedia</p>
          <p className='mt-1 inline-flex items-center gap-2 text-2xl font-bold text-cyan-700'>
            <Stethoscope size={20} /> {store.articles.length}
          </p>
        </Card>
      </section>

      <section className='grid gap-4 lg:grid-cols-[1.1fr_1fr]'>
        <Card className='border-blue-100'>
          <h2 className='text-sm font-semibold text-slate-800'>Pilih profil pasien demo</h2>
          <div className='mt-3 grid gap-2 md:grid-cols-2'>
            {store.patientCases.map((patient) => (
              <button
                key={patient.id}
                type='button'
                onClick={() => setSelectedId(patient.id)}
                className={`rounded-xl border p-3 text-left transition ${
                  selectedPatient?.id === patient.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                }`}
              >
                <p className='font-semibold text-slate-800'>{patient.alias}</p>
                <p className='text-xs text-slate-600'>{patient.city}, {patient.province}</p>
                <span className={`mt-2 inline-flex rounded-full px-2 py-1 text-[10px] font-semibold ${patientStatusTone[patient.status]}`}>{patient.status}</span>
              </button>
            ))}
          </div>
        </Card>

        <Card className='border-blue-100'>
          <h2 className='text-sm font-semibold text-slate-800'>Ringkasan terapi personal</h2>
          {selectedPatient ? (
            <div className='mt-3 space-y-2 text-sm text-slate-700'>
              <p><span className='font-medium'>Alias:</span> {selectedPatient.alias}</p>
              <p><span className='font-medium'>Diagnosis:</span> {selectedPatient.cancerType} stadium {selectedPatient.stage}</p>
              <p><span className='font-medium'>Status:</span> {selectedPatient.status}</p>
              <p><span className='font-medium'>Kontrol terakhir:</span> {selectedPatient.lastVisit}</p>
            </div>
          ) : (
            <p className='mt-3 text-sm text-slate-500'>Data pasien belum tersedia.</p>
          )}
          <div className='mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs text-amber-800'>
            Pengingat: laporkan gejala baru ke perawat navigator maksimal 24 jam setelah muncul.
          </div>
        </Card>
      </section>

      <section className='grid gap-4 lg:grid-cols-2'>
        <Card className='border-blue-100'>
          <h2 className='inline-flex items-center gap-2 text-sm font-semibold text-slate-800'>
            <ClipboardCheck size={16} className='text-blue-600' /> Agenda 3 layanan terdekat
          </h2>
          <ul className='mt-3 space-y-2 text-sm text-slate-700'>
            {todayAgenda.map((item) => (
              <li key={item} className='rounded-lg border border-blue-100 bg-blue-50/60 px-3 py-2'>
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className='border-blue-100'>
          <h2 className='inline-flex items-center gap-2 text-sm font-semibold text-slate-800'>
            <BellRing size={16} className='text-indigo-600' /> Tips pemantauan gejala harian
          </h2>
          <div className='mt-3 space-y-2'>
            {symptomTips.map((tip) => (
              <div key={tip.label} className='rounded-lg border border-slate-200 px-3 py-2'>
                <p className='text-sm font-medium text-slate-800'>{tip.label}</p>
                <p className='text-xs text-slate-600'>{tip.recommendation}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className='border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50'>
        <h2 className='inline-flex items-center gap-2 text-sm font-semibold text-emerald-800'>
          <Pill size={16} /> Rekomendasi modul lanjutan
        </h2>
        <div className='mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3'>
          {store.serviceModules.slice(0, 3).map((module) => (
            <div key={module.id} className='rounded-xl border border-emerald-100 bg-white/80 p-3'>
              <p className='text-xs font-semibold uppercase tracking-wide text-emerald-700'>{module.status}</p>
              <p className='mt-1 text-sm font-semibold text-slate-800'>{module.name}</p>
              <p className='mt-1 text-xs text-slate-600'>{module.desc}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
