import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { OnboardingData } from '@/data/seed'

type OnboardingWizardProps = {
  initial: OnboardingData
  onComplete: (payload: OnboardingData) => void
}

const goalOptions: { value: OnboardingData['goal']; label: string; helper: string }[] = [
  { value: 'pahami-terapi', label: 'Memahami alur terapi', helper: 'Saya ingin memahami proses dari konsultasi sampai evaluasi.' },
  { value: 'atur-jadwal', label: 'Mengatur jadwal & pengingat', helper: 'Saya ingin pengingat kunjungan, obat, dan kontrol rutin.' },
  { value: 'dukungan-keluarga', label: 'Dukungan keluarga', helper: 'Saya ingin materi edukasi yang mudah dibagikan ke pendamping.' }
]

const topicOptions = ['Efek Samping', 'Nutrisi', 'Persiapan Terapi', 'Kesehatan Mental', 'Hak & Administrasi BPJS', 'Latihan Ringan']

export function OnboardingWizard({ initial, onComplete }: OnboardingWizardProps) {
  const [step, setStep] = useState(1)
  const [confirmChecked, setConfirmChecked] = useState(false)
  const [form, setForm] = useState<OnboardingData>(initial)
  const [errors, setErrors] = useState<string[]>([])

  const selectedGoal = useMemo(() => goalOptions.find((item) => item.value === form.goal)?.label ?? '-', [form.goal])

  const next = () => {
    if (step === 1 && !form.goal) {
      setErrors(['Pilih dulu tujuan utama Anda.'])
      return
    }

    if (step === 2) {
      const channels = Object.values(form.notificationPreferences).slice(0, 3).some(Boolean)
      if (!channels || !form.notificationPreferences.reminderTime) {
        setErrors(['Pilih minimal satu kanal notifikasi dan waktu pengingat.'])
        return
      }
    }

    if (step === 3 && form.educationTopics.length < 2) {
      setErrors(['Pilih minimal 2 topik edukasi agar rekomendasi lebih personal.'])
      return
    }

    setErrors([])
    setStep((prev) => Math.min(prev + 1, 4))
  }

  const submit = () => {
    if (!confirmChecked) {
      setErrors(['Anda perlu mencentang konfirmasi sebelum menyelesaikan onboarding.'])
      return
    }

    onComplete({
      ...form,
      completed: true,
      completedAt: new Date().toISOString()
    })
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 p-4'>
      <Card className='max-h-[90vh] w-full max-w-2xl overflow-auto border-blue-100 p-5 md:p-6'>
        <p className='text-xs font-semibold uppercase tracking-wide text-blue-700'>Onboarding Pasien • Langkah {step}/4</p>
        <h2 className='mt-1 text-xl font-bold'>Bantu kami menyesuaikan beranda Anda</h2>
        <p className='mt-1 text-sm text-slate-600'>Waktu isi kurang dari 2 menit. Data ini hanya untuk pengalaman personal di perangkat Anda.</p>

        {step === 1 && (
          <section className='mt-4 space-y-3'>
            <h3 className='font-semibold'>1) Apa tujuan utama Anda saat ini?</h3>
            {goalOptions.map((item) => (
              <label key={item.value} className='block cursor-pointer rounded-lg border border-slate-200 p-3 hover:border-blue-300'>
                <input
                  checked={form.goal === item.value}
                  className='mr-2'
                  name='goal'
                  onChange={() => setForm((prev) => ({ ...prev, goal: item.value }))}
                  type='radio'
                />
                <span className='font-medium'>{item.label}</span>
                <p className='ml-6 mt-1 text-sm text-slate-600'>{item.helper}</p>
              </label>
            ))}
          </section>
        )}

        {step === 2 && (
          <section className='mt-4 space-y-3'>
            <h3 className='font-semibold'>2) Preferensi notifikasi</h3>
            <p className='text-sm text-slate-600'>Pilih kanal pengingat yang paling nyaman untuk Anda.</p>
            {([
              ['whatsapp', 'WhatsApp'],
              ['email', 'Email'],
              ['push', 'Notifikasi browser']
            ] as const).map(([key, label]) => (
              <label key={key} className='mr-4 inline-flex items-center gap-2 text-sm'>
                <input
                  checked={form.notificationPreferences[key]}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      notificationPreferences: {
                        ...prev.notificationPreferences,
                        [key]: event.target.checked
                      }
                    }))
                  }
                  type='checkbox'
                />
                {label}
              </label>
            ))}

            <div>
              <p className='mb-2 text-sm font-medium'>Waktu pengingat yang disukai</p>
              <select
                className='w-full rounded-md border border-slate-300 px-3 py-2 text-sm'
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    notificationPreferences: {
                      ...prev.notificationPreferences,
                      reminderTime: event.target.value as OnboardingData['notificationPreferences']['reminderTime']
                    }
                  }))
                }
                value={form.notificationPreferences.reminderTime}
              >
                <option value=''>Pilih waktu</option>
                <option value='pagi'>Pagi (06.00 - 10.00)</option>
                <option value='siang'>Siang (11.00 - 15.00)</option>
                <option value='malam'>Malam (18.00 - 21.00)</option>
              </select>
            </div>
          </section>
        )}

        {step === 3 && (
          <section className='mt-4 space-y-3'>
            <h3 className='font-semibold'>3) Topik edukasi yang ingin diprioritaskan</h3>
            <p className='text-sm text-slate-600'>Pilih minimal 2 topik agar beranda menampilkan rekomendasi konten yang relevan.</p>
            <div className='grid gap-2 sm:grid-cols-2'>
              {topicOptions.map((topic) => {
                const active = form.educationTopics.includes(topic)
                return (
                  <button
                    className={`rounded-lg border px-3 py-2 text-left text-sm transition ${active ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-200 hover:border-blue-300'}`}
                    key={topic}
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        educationTopics: active ? prev.educationTopics.filter((item) => item !== topic) : [...prev.educationTopics, topic]
                      }))
                    }
                    type='button'
                  >
                    {topic}
                  </button>
                )
              })}
            </div>
          </section>
        )}

        {step === 4 && (
          <section className='mt-4 space-y-3'>
            <h3 className='font-semibold'>4) Konfirmasi ringkasan</h3>
            <div className='rounded-lg bg-slate-50 p-4 text-sm'>
              <p><span className='font-medium'>Tujuan:</span> {selectedGoal}</p>
              <p><span className='font-medium'>Kanal notifikasi:</span> {Object.entries(form.notificationPreferences).filter(([key, value]) => key !== 'reminderTime' && value).map(([key]) => key).join(', ') || '-'}</p>
              <p><span className='font-medium'>Waktu pengingat:</span> {form.notificationPreferences.reminderTime || '-'}</p>
              <p><span className='font-medium'>Topik edukasi:</span> {form.educationTopics.join(', ') || '-'}</p>
            </div>
            <label className='inline-flex items-start gap-2 text-sm'>
              <input checked={confirmChecked} onChange={(event) => setConfirmChecked(event.target.checked)} type='checkbox' />
              <span>Saya menyetujui penggunaan preferensi ini untuk personalisasi beranda.</span>
            </label>
          </section>
        )}

        {!!errors.length && (
          <div className='mt-4 rounded-md border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700'>
            {errors.map((error) => (
              <p key={error}>• {error}</p>
            ))}
          </div>
        )}

        <div className='mt-5 flex items-center justify-between'>
          <Button className='bg-slate-200 text-slate-700 hover:bg-slate-300' disabled={step === 1} onClick={() => setStep((prev) => Math.max(prev - 1, 1))} type='button'>
            Kembali
          </Button>

          {step < 4 ? (
            <Button onClick={next} type='button'>Lanjut</Button>
          ) : (
            <Button onClick={submit} type='button'>Selesai & Personalisasi Beranda</Button>
          )}
        </div>
      </Card>
    </div>
  )
}
