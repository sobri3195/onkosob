import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Activity, CalendarClock, FileText, HeartHandshake, MessageCircleQuestion, ShieldCheck, Sparkles, Stethoscope } from 'lucide-react'
import type { Store } from '@/store/useLocalStore'

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

export function HomePage({ store }: { store: Store }) {
  const active = store.announcements.filter((a) => a.isActive)

  return (
    <div className='space-y-6 md:space-y-8'>
      <section className='relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-700 to-cyan-600 p-6 text-white shadow-xl md:p-10'>
        <div className='animate-float absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/10 blur-md' />
        <div className='animate-float absolute -bottom-8 left-10 h-24 w-24 rounded-full bg-cyan-300/30 blur-md [animation-delay:1s]' />

        <h1 className='max-w-2xl text-2xl font-bold leading-tight md:text-4xl'>Layanan Pasien Onkologi Radiasi Indonesia</h1>
        <p className='mt-3 max-w-2xl text-sm text-blue-50 md:text-base'>
          Pusat informasi terintegrasi untuk pasien dan keluarga, mulai dari edukasi, jadwal layanan, hingga konsultasi awal.
        </p>

        <div className='mt-6 flex flex-wrap gap-2'>
          {[
            { to: '/edukasi', label: 'Edukasi', icon: MessageCircleQuestion },
            { to: '/jadwal', label: 'Jadwal', icon: CalendarClock },
            { to: '/panduan', label: 'Panduan', icon: FileText },
            { to: '/faq', label: 'FAQ', icon: MessageCircleQuestion },
            { to: '/kontak', label: 'Kontak', icon: Stethoscope }
          ].map((item) => (
            <Link
              className='inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur transition hover:scale-[1.02] hover:bg-white/30'
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
        {[['Artikel', store.articles.length], ['FAQ', store.faqs.length], ['Sesi/Jadwal', store.schedules.length], ['Pengumuman', active.length]].map(
          ([label, value]) => (
            <Card key={label as string} className='animate-fade-in border-blue-100 text-center dark:border-slate-700'>
              <p className='text-2xl font-bold text-blue-700 dark:text-blue-300'>{value as number}</p>
              <p className='text-xs text-slate-600 dark:text-slate-300 md:text-sm'>{label as string}</p>
            </Card>
          )
        )}
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
        {features.map((x) => (
          <Card key={x.title} className='group border-blue-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700'>
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
            <div key={step} className='relative rounded-xl bg-white p-3 text-sm shadow-sm ring-1 ring-blue-100 dark:bg-slate-900 dark:ring-slate-700'>
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
