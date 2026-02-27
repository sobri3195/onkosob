import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Activity, ArrowRight, CalendarClock, FileText, HeartHandshake, MessageCircleQuestion, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react'
import type { Store } from '@/store/useLocalStore'
import type { OnboardingData } from '@/data/seed'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'

const features = [
  {
    title: 'Pendaftaran & Rujukan',
    desc: 'Alur rujukan digital dan daftar berkas terbaru agar proses registrasi lebih cepat.',
    icon: FileText
  },
  {
    title: 'Persiapan Radioterapi',
    desc: 'Panduan langkah demi langkah sebelum simulasi hingga sesi terapi pertama.',
    icon: Stethoscope
  },
  {
    title: 'Pemantauan Efek Samping',
    desc: 'Edukasi gejala yang umum dan kapan harus segera menghubungi fasilitas kesehatan.',
    icon: Activity
  },
  {
    title: 'Nutrisi & Dukungan Keluarga',
    desc: 'Tips nutrisi klinis, pendampingan psikososial, dan komunitas pasien.',
    icon: ShieldCheck
  }
]

const journey = ['Daftar & unggah berkas awal', 'Konsultasi awal dengan tim medis', 'Simulasi & perencanaan terapi', 'Sesi radioterapi terjadwal', 'Monitoring pasca terapi']

type HomePageProps = {
  store: Store
  onCompleteOnboarding: (payload: OnboardingData) => void
}

export function HomePage({ store, onCompleteOnboarding }: HomePageProps) {
  const active = store.announcements.filter((a) => a.isActive)
  const quickLinks = [
    { to: '/edukasi', label: 'Edukasi', icon: MessageCircleQuestion },
    { to: '/jadwal', label: 'Jadwal', icon: CalendarClock },
    { to: '/panduan', label: 'Panduan', icon: FileText },
    { to: '/faq', label: 'FAQ', icon: MessageCircleQuestion },
    { to: '/kontak', label: 'Kontak', icon: Stethoscope }
  ]

  const summaryStats = [
    ['Artikel', store.articles.length],
    ['FAQ', store.faqs.length],
    ['Sesi/Jadwal', store.schedules.length],
    ['Pengumuman', active.length]
  ] as const

  const personalization = {
    titleByGoal: {
      'pahami-terapi': 'Fokus Anda: Memahami alur terapi',
      'atur-jadwal': 'Fokus Anda: Mengatur jadwal & pengingat',
      'dukungan-keluarga': 'Fokus Anda: Dukungan keluarga'
    } as Record<Exclude<OnboardingData['goal'], ''>, string>,
    reminderByTime: {
      pagi: 'Pengingat aktif di pagi hari agar persiapan kunjungan lebih tenang.',
      siang: 'Pengingat aktif di siang hari untuk menyesuaikan aktivitas harian.',
      malam: 'Pengingat aktif di malam hari untuk persiapan esok hari.'
    } as Record<Exclude<OnboardingData['notificationPreferences']['reminderTime'], ''>, string>
  }

  return (
    <div className='space-y-6 md:space-y-8'>
      {!store.onboarding.completed && <OnboardingWizard initial={store.onboarding} onComplete={onCompleteOnboarding} />}

      {store.onboarding.completed && store.onboarding.goal && store.onboarding.notificationPreferences.reminderTime && (
        <Card className='border-emerald-100 bg-emerald-50/70'>
          <p className='text-xs font-semibold uppercase tracking-wide text-emerald-700'>Beranda personal Anda</p>
          <h2 className='mt-1 text-lg font-semibold text-emerald-900'>{personalization.titleByGoal[store.onboarding.goal]}</h2>
          <p className='mt-1 text-sm text-emerald-800'>{personalization.reminderByTime[store.onboarding.notificationPreferences.reminderTime]}</p>
          <div className='mt-3 flex flex-wrap gap-2'>
            {store.onboarding.educationTopics.map((topic) => (
              <span key={topic} className='rounded-full bg-white px-3 py-1 text-xs font-medium text-emerald-800 ring-1 ring-emerald-200'>
                #{topic}
              </span>
            ))}
          </div>
        </Card>
      )}

      <section className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 p-6 text-white shadow-xl md:p-10'>
        <div className='animate-shimmer absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.12)_30%,transparent_60%)]' />
        <div className='animate-float absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10 blur-md' />
        <div className='animate-float absolute -bottom-8 left-10 h-24 w-24 rounded-full bg-cyan-300/30 blur-md [animation-delay:1s]' />
        <div className='relative grid gap-6 md:grid-cols-[1fr_auto] md:items-end'>
          <div>
            <p className='inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-blue-50 ring-1 ring-white/20'>
              <Sparkles size={14} /> Platform pendamping pasien & keluarga
            </p>

            <h1 className='mt-3 max-w-2xl text-2xl font-bold leading-tight md:text-4xl'>Layanan Pasien Onkologi Radiasi Indonesia</h1>
            <p className='mt-3 max-w-2xl text-sm text-blue-50 md:text-base'>
              Pusat informasi terintegrasi untuk pasien dan keluarga, mulai dari edukasi, jadwal layanan, hingga konsultasi awal.
            </p>
          </div>

          <Link
            to='/kontak'
            className='group inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2 text-sm font-semibold text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-50'
          >
            Konsultasi Sekarang
            <ArrowRight size={16} className='transition group-hover:translate-x-0.5' />
          </Link>
        </div>

        <div className='relative mt-6 flex flex-wrap gap-2'>
          {quickLinks.map((item, index) => (
            <Link
              className='animate-fade-in inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur transition hover:scale-[1.02] hover:bg-white/30'
              style={{ animationDelay: `${index * 80}ms` }}
              key={item.to}
              to={item.to}
            >
              <item.icon size={14} /> {item.label}
            </Link>
          ))}
        </div>
      </section>

      <section className='overflow-hidden rounded-xl border border-blue-100 bg-white py-3 dark:border-slate-700 dark:bg-slate-900'>
        <div className='animate-marquee flex min-w-max gap-8 px-4 text-sm text-slate-600 dark:text-slate-200'>
          {['Informasi tervalidasi tenaga medis', 'Konten edukasi pasien & keluarga', 'Akses jadwal layanan yang selalu diperbarui', 'Kanal komunikasi dengan admin layanan'].map(
            (item) => (
              <p key={item} className='inline-flex items-center gap-2'>
                <Sparkles size={14} className='text-cyan-600' /> {item}
              </p>
            )
          )}
          {['Informasi tervalidasi tenaga medis', 'Konten edukasi pasien & keluarga', 'Akses jadwal layanan yang selalu diperbarui', 'Kanal komunikasi dengan admin layanan'].map(
            (item) => (
              <p key={`${item}-dup`} className='inline-flex items-center gap-2'>
                <Sparkles size={14} className='text-cyan-600' /> {item}
              </p>
            )
          )}
        </div>
      </section>

      <section className='grid grid-cols-2 gap-3 md:grid-cols-4'>
        {summaryStats.map(([label, value], index) => (
          <Card
            key={label}
            className='animate-fade-in border-blue-100 text-center transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700'
            style={{ animationDelay: `${index * 110}ms` }}
          >
            <p className='text-2xl font-bold text-blue-700 dark:text-blue-300'>{value}</p>
            <p className='text-xs text-slate-600 dark:text-slate-300 md:text-sm'>{label}</p>
          </Card>
        ))}
      </section>

      {!!active.length && (
        <Card className='space-y-2 border-l-4 border-l-amber-400'>
          <h2 className='font-semibold'>Pengumuman Aktif</h2>
          {active.map((a) => (
            <p key={a.id} className='text-sm text-slate-700 dark:text-slate-200'>
              • <span className='font-medium'>{a.title}</span>: {a.message}
            </p>
          ))}
        </Card>
      )}

      <section className='grid gap-4 md:grid-cols-2'>
        {features.map((x, index) => (
          <Card
            key={x.title}
            className='group animate-fade-in border-blue-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700'
            style={{ animationDelay: `${index * 120}ms` }}
          >
            <x.icon className='mb-2 text-blue-600 transition group-hover:scale-110 dark:text-blue-300' size={20} />
            <h3 className='font-semibold'>{x.title}</h3>
            <p className='mt-1 text-sm text-slate-600 dark:text-slate-300'>{x.desc}</p>
          </Card>
        ))}
      </section>

      <section className='rounded-2xl border border-blue-100 bg-blue-50/60 p-4 dark:border-slate-700 dark:bg-slate-900/60 md:p-6'>
        <h2 className='text-lg font-semibold'>Perjalanan pasien yang lebih jelas</h2>
        <div className='mt-4 grid gap-3 md:grid-cols-5'>
          {journey.map((step, index) => (
            <div
              key={step}
              className='relative animate-rise-in rounded-xl bg-white p-3 text-sm shadow-sm ring-1 ring-blue-100 dark:bg-slate-900 dark:ring-slate-700'
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <p className='mb-1 text-xs font-semibold text-blue-700 dark:text-blue-300'>Langkah {index + 1}</p>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      <Card className='flex flex-col items-start justify-between gap-3 border-cyan-100 bg-gradient-to-r from-cyan-50 to-blue-50 p-5 dark:border-slate-700 dark:from-slate-900 dark:to-slate-900 md:flex-row md:items-center'>
        <div>
          <h3 className='inline-flex items-center gap-2 text-lg font-semibold'>
            <HeartHandshake className='text-cyan-700 dark:text-cyan-300' size={20} />
            Butuh konsultasi awal?
          </h3>
          <p className='text-sm text-slate-600 dark:text-slate-300'>Hubungi tim kami untuk orientasi layanan, informasi jadwal, dan dukungan keluarga pasien.</p>
        </div>
        <Link to='/kontak' className='rounded-full bg-blue-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-800'>
          Hubungi Sekarang
        </Link>
      </Card>
    </div>
  )
}
