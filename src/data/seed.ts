export type Article = { id: string; title: string; slug: string; category: string; tags: string[]; excerpt: string; content: string; status: 'draft'|'publish'; createdAt: string; updatedAt: string }
export type FAQ = { id: string; question: string; answer: string; category: string }
export type Schedule = { id: string; day: string; time: string; service: string; note: string }
export type Announcement = { id: string; title: string; message: string; isActive: boolean; start?: string; end?: string }
export type Inbox = { id: string; name: string; phone?: string; email?: string; message: string; read: boolean; createdAt: string }
export type Settings = { theme: 'light'|'dark'; contact: { phone: string; email: string; address: string; hours: string } }

export const seed = {
  articles: [
    { id:'a1', title:'Apa itu Radioterapi?', slug:'apa-itu-radioterapi', category:'Dasar', tags:['edukasi'], excerpt:'Penjelasan dasar radioterapi.', content:'Radioterapi adalah terapi kanker menggunakan radiasi terarah.', status:'publish', createdAt:'2026-01-01', updatedAt:'2026-01-01' },
    { id:'a2', title:'Mengelola Efek Samping Umum', slug:'mengelola-efek-samping-umum', category:'Efek Samping', tags:['tips'], excerpt:'Tips harian untuk pasien.', content:'Istirahat cukup, hidrasi, dan komunikasi dengan tim medis.', status:'publish', createdAt:'2026-01-05', updatedAt:'2026-01-05' }
  ] as Article[],
  faqs: [
    { id:'f1', question:'Apakah radioterapi sakit?', answer:'Secara umum prosesnya tidak menimbulkan rasa sakit.', category:'Umum' },
    { id:'f2', question:'Berapa lama satu sesi?', answer:'Rata-rata 10-30 menit tergantung prosedur.', category:'Jadwal' }
  ] as FAQ[],
  schedules: [
    { id:'s1', day:'Senin', time:'08:00-15:00', service:'Konsultasi Onkologi Radiasi', note:'Datang 30 menit lebih awal' },
    { id:'s2', day:'Rabu', time:'08:00-15:00', service:'Simulasi & Perencanaan', note:'Bawa berkas rujukan' }
  ] as Schedule[],
  announcements: [
    { id:'p1', title:'Informasi Layanan', message:'Layanan hari Sabtu sementara ditutup.', isActive:true }
  ] as Announcement[],
  inbox: [] as Inbox[],
  checklist: ['Bawa kartu identitas', 'Bawa hasil pemeriksaan terakhir', 'Gunakan pakaian nyaman'],
  checkedItems: [] as string[],
  settings: { theme:'light', contact:{ phone:'+62-21-1234-5678', email:'halo@onkoradiasi.id', address:'Jakarta, Indonesia', hours:'Senin-Jumat 08.00-15.00' } } as Settings,
  isAdmin: false
}
