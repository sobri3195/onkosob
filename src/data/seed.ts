export type Article = { id: string; title: string; slug: string; category: string; tags: string[]; excerpt: string; content: string; status: 'draft'|'publish'; createdAt: string; updatedAt: string }
export type FAQ = { id: string; question: string; answer: string; category: string }
export type Schedule = { id: string; day: string; time: string; service: string; note: string }
export type Announcement = { id: string; title: string; message: string; isActive: boolean; start?: string; end?: string }
export type Inbox = { id: string; name: string; phone?: string; email?: string; message: string; read: boolean; createdAt: string }
export type Settings = { theme: 'light'|'dark'; contact: { phone: string; email: string; address: string; hours: string } }
export type OnboardingData = {
  completed: boolean
  completedAt?: string
  goal: 'pahami-terapi' | 'atur-jadwal' | 'dukungan-keluarga' | ''
  notificationPreferences: {
    whatsapp: boolean
    email: boolean
    push: boolean
    reminderTime: 'pagi' | 'siang' | 'malam' | ''
  }
  educationTopics: string[]
}

export const seed = {
  articles: [
    {
      id:'a1',
      title:'Apa itu Radioterapi?',
      slug:'apa-itu-radioterapi',
      category:'Dasar',
      tags:['edukasi','pasien-baru'],
      excerpt:'Penjelasan dasar radioterapi untuk pasien dan keluarga.',
      content:'Radioterapi adalah terapi kanker menggunakan radiasi terarah untuk merusak sel kanker dengan tetap menjaga jaringan sehat di sekitarnya. Tim onkologi radiasi akan menentukan dosis, lokasi, dan lama terapi sesuai kondisi klinis pasien.',
      status:'publish',
      createdAt:'2026-01-01',
      updatedAt:'2026-01-01'
    },
    {
      id:'a2',
      title:'Mengelola Efek Samping Umum',
      slug:'mengelola-efek-samping-umum',
      category:'Efek Samping',
      tags:['tips','harian'],
      excerpt:'Langkah praktis untuk mengurangi keluhan saat terapi.',
      content:'Beberapa efek samping umum meliputi kelelahan, kulit kemerahan, dan nafsu makan menurun. Istirahat cukup, hidrasi, nutrisi seimbang, dan komunikasi aktif dengan dokter akan membantu pemulihan lebih baik.',
      status:'publish',
      createdAt:'2026-01-05',
      updatedAt:'2026-01-05'
    },
    {
      id:'a3',
      title:'Persiapan Sebelum Simulasi CT',
      slug:'persiapan-sebelum-simulasi-ct',
      category:'Persiapan',
      tags:['simulasi','rujukan'],
      excerpt:'Daftar hal penting sebelum menjalani CT simulasi radioterapi.',
      content:'Pastikan Anda membawa surat rujukan, hasil patologi, dan daftar obat yang sedang dikonsumsi. Gunakan pakaian longgar serta ikuti instruksi puasa jika diarahkan oleh tim medis.',
      status:'publish',
      createdAt:'2026-01-11',
      updatedAt:'2026-01-11'
    },
    {
      id:'a4',
      title:'Nutrisi Pendamping Radioterapi',
      slug:'nutrisi-pendamping-radioterapi',
      category:'Nutrisi',
      tags:['nutrisi','dukungan'],
      excerpt:'Contoh pola makan seimbang selama program radioterapi berjalan.',
      content:'Fokus pada protein tinggi, cairan yang cukup, serta makanan bertekstur lunak bila ada gangguan menelan. Konsultasi dengan ahli gizi dapat membantu menyesuaikan kebutuhan kalori harian.',
      status:'publish',
      createdAt:'2026-01-19',
      updatedAt:'2026-01-20'
    },
    {
      id:'a5',
      title:'Perawatan Kulit Area Radiasi',
      slug:'perawatan-kulit-area-radiasi',
      category:'Efek Samping',
      tags:['kulit','perawatan'],
      excerpt:'Cara aman merawat kulit agar tetap nyaman selama terapi.',
      content:'Bersihkan area terapi dengan lembut, hindari menggosok, dan gunakan produk tanpa parfum sesuai rekomendasi tim medis. Segera laporkan lepuhan atau nyeri berlebih.',
      status:'publish',
      createdAt:'2026-01-24',
      updatedAt:'2026-01-24'
    },
    {
      id:'a6',
      title:'Panduan Keluarga Pendamping',
      slug:'panduan-keluarga-pendamping',
      category:'Dukungan',
      tags:['keluarga','psikososial'],
      excerpt:'Peran keluarga dalam mendukung kepatuhan jadwal dan kondisi emosional pasien.',
      content:'Keluarga dapat membantu memantau jadwal, asupan nutrisi, dan perubahan keluhan pasien. Dukungan emosional yang konsisten terbukti meningkatkan kualitas hidup selama terapi.',
      status:'publish',
      createdAt:'2026-01-28',
      updatedAt:'2026-01-28'
    },
    {
      id:'a7',
      title:'Checklist Hari Pertama Radioterapi',
      slug:'checklist-hari-pertama-radioterapi',
      category:'Persiapan',
      tags:['checklist','kunjungan-pertama'],
      excerpt:'Daftar singkat yang membantu pasien lebih siap pada sesi radioterapi pertama.',
      content:'Siapkan kartu kontrol, obat rutin, bekal air minum, serta datang 30 menit lebih awal untuk verifikasi data. Jika ada gejala baru, sampaikan kepada petugas sebelum tindakan.',
      status:'publish',
      createdAt:'2026-02-02',
      updatedAt:'2026-02-02'
    },
    {
      id:'a8',
      title:'Aktivitas Fisik Ringan Selama Terapi',
      slug:'aktivitas-fisik-ringan-selama-terapi',
      category:'Aktivitas',
      tags:['kebugaran','pemulihan'],
      excerpt:'Panduan aman memilih aktivitas fisik ringan untuk menjaga stamina pasien.',
      content:'Pilih aktivitas berintensitas rendah seperti jalan kaki 15-20 menit, peregangan, dan latihan napas. Hentikan aktivitas bila merasa pusing, sesak, atau nyeri berlebih.',
      status:'publish',
      createdAt:'2026-02-06',
      updatedAt:'2026-02-06'
    }
  ] as Article[],
  faqs: [
    { id:'f1', question:'Apakah radioterapi sakit?', answer:'Proses penyinaran umumnya tidak menimbulkan nyeri. Namun beberapa pasien bisa mengalami ketidaknyamanan ringan sesuai area terapi.', category:'Umum' },
    { id:'f2', question:'Berapa lama satu sesi radioterapi?', answer:'Rata-rata 10–30 menit termasuk persiapan posisi, sedangkan waktu penyinaran aktif biasanya hanya beberapa menit.', category:'Jadwal' },
    { id:'f3', question:'Apakah saya boleh bekerja selama terapi?', answer:'Sebagian pasien tetap dapat bekerja tergantung kondisi fisik. Diskusikan dengan dokter untuk penyesuaian aktivitas.', category:'Aktivitas' },
    { id:'f4', question:'Kapan harus segera ke IGD?', answer:'Segera ke IGD jika terjadi sesak napas, demam tinggi, perdarahan aktif, atau nyeri berat yang tidak membaik.', category:'Keamanan' },
    { id:'f5', question:'Apakah BPJS dapat digunakan?', answer:'Layanan dapat menggunakan BPJS sesuai prosedur rujukan berjenjang dan kelengkapan dokumen yang berlaku.', category:'Administrasi' },
    { id:'f6', question:'Bolehkah membawa pendamping?', answer:'Ya, pasien diperbolehkan membawa satu pendamping saat registrasi dan edukasi awal sesuai kebijakan fasilitas.', category:'Layanan' },
    { id:'f7', question:'Apakah pasien perlu berpuasa sebelum radioterapi?', answer:'Tidak semua prosedur membutuhkan puasa. Ikuti instruksi khusus dari dokter atau perawat sesuai jenis tindakan.', category:'Persiapan' },
    { id:'f8', question:'Bagaimana jika saya terlambat datang?', answer:'Segera hubungi nomor layanan agar tim dapat membantu penjadwalan ulang sesi pada slot terdekat.', category:'Jadwal' }
  ] as FAQ[],
  schedules: [
    { id:'s1', day:'Senin', time:'07:30-11:00', service:'Konsultasi Onkologi Radiasi', note:'Nomor antrean dibuka pukul 07:00' },
    { id:'s2', day:'Senin', time:'11:00-15:00', service:'Radioterapi Fraksinasi', note:'Bawa kartu kontrol setiap kunjungan' },
    { id:'s3', day:'Selasa', time:'08:00-12:00', service:'Simulasi CT & Perencanaan', note:'Harap datang 30 menit lebih awal' },
    { id:'s4', day:'Rabu', time:'08:00-14:30', service:'Radioterapi Fraksinasi', note:'Waktu dapat berubah sesuai kondisi mesin' },
    { id:'s5', day:'Kamis', time:'08:00-11:30', service:'Klinik Edukasi Efek Samping', note:'Prioritas pasien dalam terapi aktif' },
    { id:'s6', day:'Kamis', time:'13:00-15:00', service:'Konseling Nutrisi Onkologi', note:'Perlu reservasi dari perawat navigator' },
    { id:'s7', day:'Jumat', time:'08:00-12:30', service:'Radioterapi & Evaluasi Mingguan', note:'Evaluasi dilakukan oleh DPJP dan tim radioterapi' },
    { id:'s8', day:'Jumat', time:'13:00-15:00', service:'Konseling Psikososial Pasien', note:'Layanan oleh psikolog klinis, kuota terbatas' },
    { id:'s9', day:'Sabtu', time:'08:00-10:30', service:'Klinik Kontrol Pasca Terapi', note:'Khusus pasien dengan jadwal kontrol terencana' }
  ] as Schedule[],
  announcements: [
    { id:'p1', title:'Pembaruan Alur Registrasi', message:'Mulai 5 Februari 2026, registrasi pasien lama menggunakan kiosk mandiri di lobby utama.', isActive:true, start:'2026-02-05' },
    { id:'p2', title:'Pemeliharaan Perangkat', message:'Layanan radioterapi dihentikan sementara pada Minggu, 16 Februari 2026 untuk kalibrasi berkala.', isActive:true, start:'2026-02-16', end:'2026-02-16' },
    { id:'p3', title:'Kelas Edukasi Keluarga', message:'Sesi edukasi keluarga pendamping dibuka setiap Kamis pukul 10:00, kuota 25 peserta.', isActive:true, start:'2026-02-01' },
    { id:'p4', title:'Pembukaan Layanan Sabtu Pagi', message:'Mulai Maret 2026, tersedia layanan kontrol pasca terapi setiap Sabtu pagi dengan reservasi online.', isActive:true, start:'2026-03-01' }
  ] as Announcement[],
  inbox: [
    { id:'i1', name:'Rina Setiawati', phone:'081290001122', email:'rina.s@example.com', message:'Apakah jadwal simulasi CT bisa dilakukan sore hari?', read:true, createdAt:'2026-02-01T08:22:00Z' },
    { id:'i2', name:'Bapak Ahmad', phone:'081377889900', email:'ahmad.k@example.com', message:'Mohon informasi dokumen rujukan untuk pasien BPJS dari luar kota.', read:false, createdAt:'2026-02-03T02:10:00Z' },
    { id:'i3', name:'Lina Kartika', email:'lina.k@example.com', message:'Apakah ada layanan konsultasi nutrisi secara online?', read:false, createdAt:'2026-02-03T11:40:00Z' },
    { id:'i4', name:'Dewi Puspita', phone:'081255443322', email:'dewi.p@example.com', message:'Mohon info apakah ada slot kontrol Sabtu untuk pasien pasca terapi?', read:false, createdAt:'2026-02-05T07:18:00Z' },
    { id:'i5', name:'Budi Santoso', email:'budi.s@example.com', message:'Apakah edukasi keluarga bisa diikuti secara hybrid?', read:true, createdAt:'2026-02-06T10:05:00Z' }
  ] as Inbox[],
  checklist: [
    'Kartu identitas asli & kartu jaminan kesehatan',
    'Surat rujukan dan ringkasan medis terbaru',
    'Hasil laboratorium/radiologi pendukung',
    'Daftar obat yang sedang dikonsumsi',
    'Gunakan pakaian nyaman tanpa aksesori logam'
  ],
  checkedItems: [] as string[],
  settings: {
    theme:'light',
    contact:{
      phone:'+62-21-7654-2211',
      email:'layanan@onkoradiasi.id',
      address:'Jl. Kesehatan No. 88, Jakarta Selatan',
      hours:'Senin-Jumat 07.30-15.00 WIB'
    }
  } as Settings,
  onboarding: {
    completed: false,
    goal: '',
    notificationPreferences: {
      whatsapp: true,
      email: false,
      push: false,
      reminderTime: 'pagi'
    },
    educationTopics: ['Efek Samping', 'Nutrisi']
  } as OnboardingData,
  isAdmin: false
}
