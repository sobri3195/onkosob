import { Card } from '@/components/ui/card'
import type { Store } from '@/store/useLocalStore'
import { ArrowUpRight, BookOpen, CalendarDays, CircleHelp, Inbox, Megaphone, Users } from 'lucide-react'

export function DashboardPage({ store }: { store: Store }) {
  const stats = [
    ['Artikel', store.articles.length, BookOpen, 'Konten edukasi'],
    ['FAQ', store.faqs.length, CircleHelp, 'Pertanyaan umum'],
    ['Jadwal', store.schedules.length, CalendarDays, 'Agenda layanan'],
    ['Pengumuman', store.announcements.length, Megaphone, 'Informasi aktif'],
    ['Pasien terdaftar', store.patientCases.length, Users, 'Data demo'],
    ['Inbox belum dibaca', store.inbox.filter((i) => !i.read).length, Inbox, 'Perlu ditinjau']
  ] as const

  return (
    <div className='mx-auto max-w-7xl space-y-6'>
      <Card className='relative overflow-hidden border-0 bg-[#102d43] p-7 text-white md:p-9'>
        <div className='absolute -right-16 -top-20 h-72 w-72 rounded-full border border-[#d4a94d]/20'/><div className='absolute -right-4 -top-8 h-48 w-48 rounded-full border border-[#d4a94d]/20'/>
        <p className='mb-2 text-xs font-bold uppercase tracking-[.2em] text-[#e0b75e]'>Ringkasan hari ini</p>
        <h1 className='relative m-0 max-w-xl font-serif text-3xl font-medium leading-tight md:text-4xl'>Kelola layanan dengan lebih tenang dan terarah.</h1>
        <p className='relative mb-0 mt-3 max-w-2xl text-sm text-slate-300'>Semua aktivitas edukasi, jadwal, dan komunikasi pasien dalam satu ruang kerja.</p>
      </Card>
      <div><div className='mb-4 flex items-end justify-between'><div><p className='m-0 text-[10px] font-bold uppercase tracking-[.18em] text-[#96732f]'>Ikhtisar</p><h2 className='m-0 font-serif text-2xl font-medium text-slate-900 dark:text-white'>Aktivitas layanan</h2></div><span className='hidden text-xs text-slate-500 sm:block'>Diperbarui otomatis</span></div>
      <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-3'>
        {stats.map(([k, v, Icon, helper]) => (
          <Card key={String(k)} className='group flex items-center gap-4 border-slate-200/80 p-5'>
            <span className='grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-[#e7eee9] text-[#315b49] transition group-hover:bg-[#315b49] group-hover:text-white'><Icon className='h-5 w-5'/></span>
            <div className='min-w-0 flex-1'><p className='m-0 text-sm font-semibold text-slate-700 dark:text-slate-200'>{k}</p><p className='m-0 text-xs text-slate-500'>{helper}</p></div>
            <p className='m-0 font-serif text-3xl font-semibold text-[#173d5b] dark:text-[#e0b75e]'>{String(v)}</p><ArrowUpRight className='h-4 w-4 text-slate-300 transition group-hover:text-[#96732f]'/>
          </Card>
        ))}
      </div></div>
    </div>
  )
}
