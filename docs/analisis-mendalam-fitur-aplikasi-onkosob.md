# Analisis Mendalam Fitur Aplikasi OnkoSob

Dokumen ini merangkum hasil analisis menyeluruh terhadap aplikasi **OnkoSob / Onko Radiasi Indonesia** berdasarkan implementasi yang ada di repository. Fokus analisis mencakup arsitektur produk, struktur navigasi, pengalaman pengguna publik, kapabilitas panel admin, model data, pola state management, serta evaluasi kekuatan dan ruang pengembangan.

---

## 1. Ringkasan Eksekutif

OnkoSob adalah aplikasi frontend berbasis **React + TypeScript + Vite + Tailwind CSS** yang dirancang sebagai **platform edukasi, navigasi layanan, pemantauan pasien, dan administrasi demo** untuk layanan onkologi radiasi. Aplikasi ini belum bergantung pada backend aktif; hampir seluruh fitur bekerja dengan **seed data** dan **persistensi localStorage**, sehingga sangat cocok untuk:

- proof of concept produk,
- validasi UX alur pasien,
- demo stakeholder internal rumah sakit/klinik,
- eksplorasi modul digital layanan pasien kanker.

Secara produk, aplikasi ini dibagi menjadi dua domain utama:

1. **Area publik/pasien**, untuk edukasi, jadwal, panduan, FAQ, kontak, pemantauan, dan modul pasien.
2. **Area admin demo**, untuk mengelola artikel, FAQ, jadwal, pengumuman, inbox, data pasien anonim, dan pengaturan tampilan/kontak.

Nilai utama aplikasi ini terletak pada kemampuannya menggabungkan **edukasi pasien**, **akses informasi layanan**, **personalisasi onboarding**, dan **simulasi dashboard operasional** dalam satu pengalaman yang konsisten.

---

## 2. Gambaran Produk Secara Umum

### 2.1 Tujuan produk
Aplikasi ini secara implisit dibangun untuk menjawab kebutuhan berikut:

- membantu pasien memahami alur radioterapi,
- menyederhanakan akses informasi layanan,
- menyediakan kanal komunikasi awal dengan fasilitas,
- memberi gambaran status dan sebaran pasien secara aman (anonim),
- memberi panel admin sederhana untuk mengelola konten dan data operasional.

### 2.2 Karakter produk
Produk ini memiliki karakter:

- **informasional**, karena kuat di artikel, FAQ, jadwal, dan panduan;
- **operasional**, karena ada inbox, pengumuman, dan data pasien;
- **personalized-lite**, karena ada onboarding dan progres belajar;
- **demo-ready**, karena akses admin dapat diaktifkan langsung tanpa autentikasi backend;
- **offline-friendly secara lokal**, karena state disimpan di localStorage.

---

## 3. Stack Teknologi dan Fondasi Teknis

### 3.1 Teknologi inti
Aplikasi menggunakan:

- **React 18** untuk UI berbasis komponen,
- **TypeScript** untuk type safety,
- **React Router DOM** untuk routing publik dan admin,
- **Tailwind CSS** untuk styling utility-first,
- **Vite** sebagai tooling development/build,
- **Sonner** untuk toast notification,
- **Lucide React** untuk ikon,
- beberapa dependensi Radix tersedia, walau komponen UI aktual banyak dibuat custom ringan.

### 3.2 Karakter arsitektur frontend
Arsitekturnya cenderung sederhana dan efektif:

- routing terpusat di `AppRoutes`,
- data awal berasal dari `seed.ts`,
- store utama memakai custom hook `useLocalStore`,
- progres pembelajaran memakai hook terpisah `useLearningProgress`,
- halaman dibagi jelas antara `public`, `admin`, `layouts`, dan `components`.

### 3.3 Implikasi teknis
Konsekuensi dari pendekatan ini:

**Kelebihan**
- implementasi cepat,
- mudah dipahami tim kecil,
- mudah dipakai untuk demo dan workshop,
- tidak tergantung API.

**Keterbatasan**
- tidak cocok untuk multi-user real-time,
- tidak ada otorisasi sungguhan,
- data hanya persisten per browser/perangkat,
- tidak ada sinkronisasi lintas device.

---

## 4. Struktur Informasi dan Navigasi Produk

### 4.1 Dua mode utama aplikasi
Aplikasi dibagi menjadi:

#### A. Mode publik
Berisi halaman:
- Beranda
- Edukasi
- Detail Edukasi
- Jadwal
- Panduan
- FAQ
- Kontak
- Pemantauan
- Pasien
- Disclaimer

#### B. Mode admin demo
Berisi halaman:
- Dashboard
- Kelola Edukasi
- Kelola FAQ
- Kelola Jadwal
- Pengumuman
- Inbox
- Modul Pasien
- Pengaturan

### 4.2 Navigasi publik
Navigasi publik cukup matang karena mendukung:

- navbar desktop,
- menu mobile,
- bottom navigation mobile,
- command palette / pencarian cepat (`Ctrl/Cmd + K`).

Artinya, produk sudah memperhatikan kebutuhan **discoverability** dan **kecepatan akses informasi** baik di desktop maupun mobile.

### 4.3 Navigasi admin
Panel admin memakai sidebar collapse/expand. Ini membuat area admin terasa seperti dashboard internal, terpisah secara mental model dari area publik.

---

## 5. Fitur Inti Area Publik: Jabaran Lengkap

## 5.1 Beranda: pusat orientasi pasien
Beranda adalah halaman terpenting dan paling kaya fitur. Fungsinya bukan sekadar landing page, tetapi **hub orientasi pasien dan keluarga**.

### Fitur yang tersedia
1. **Onboarding interaktif 4 langkah** untuk personalisasi awal.
2. **Kartu personalisasi** setelah onboarding selesai.
3. **Hero section** dengan CTA menuju kontak.
4. **Quick links** ke modul-modul inti.
5. **Marquee trust signal** berisi nilai layanan.
6. **Summary stats** jumlah artikel, FAQ, jadwal, pasien, pengumuman.
7. **Pengumuman aktif**.
8. **Sorotan fitur utama layanan**.
9. **Journey pasien** dari awal hingga pasca terapi.
10. **Daftar modul digital baru**.
11. **CTA konsultasi awal**.

### Nilai bisnis/UX
Beranda bekerja sangat baik sebagai:
- alat aktivasi pengguna baru,
- alat orientasi keluarga pasien,
- etalase kapabilitas layanan,
- jembatan ke fitur transaksional ringan seperti kontak dan jadwal.

### Analisis mendalam
Beranda ini menunjukkan pola produk yang matang:
- ada **edukasi**,
- ada **navigasi**,
- ada **social proof/credibility**,
- ada **personalization**,
- ada **next-step guidance**.

Untuk aplikasi kesehatan, kombinasi ini penting karena pengguna sering datang dalam kondisi cemas dan membutuhkan arah yang jelas.

---

## 5.2 Onboarding interaktif: personalisasi awal pasien
Onboarding muncul sebagai modal full-screen overlay jika pengguna belum menyelesaikan preferensi awal.

### Langkah onboarding
1. **Tujuan utama pengguna**
   - memahami alur terapi,
   - mengatur jadwal & pengingat,
   - dukungan keluarga.
2. **Preferensi notifikasi**
   - WhatsApp,
   - email,
   - notifikasi browser,
   - waktu pengingat: pagi/siang/malam.
3. **Topik edukasi prioritas**
   - efek samping,
   - nutrisi,
   - persiapan terapi,
   - kesehatan mental,
   - hak & administrasi BPJS,
   - latihan ringan.
4. **Konfirmasi ringkasan**.

### Fitur validasi
Onboarding sudah memiliki validasi cukup baik:
- tujuan wajib dipilih,
- minimal satu kanal notifikasi,
- waktu pengingat wajib dipilih,
- minimal dua topik edukasi,
- checkbox konfirmasi wajib dicentang.

### Nilai produk
Onboarding ini sangat strategis karena:
- mengurangi kebingungan pengguna pertama,
- membuka peluang personalisasi konten,
- memberi konteks preferensi tanpa backend kompleks,
- menciptakan rasa aplikasi “memahami kebutuhan pasien”.

### Implikasi ke beranda
Setelah selesai, beranda menampilkan:
- fokus pengguna berdasarkan goal,
- narasi pengingat sesuai waktu pilihan,
- badge topik edukasi terpilih.

Dengan demikian, onboarding bukan sekadar form, melainkan mesin sederhana untuk **adaptasi pengalaman pengguna**.

---

## 5.3 Edukasi: pusat pembelajaran pasien
Modul edukasi merupakan salah satu fitur paling kuat di aplikasi.

### Fitur utama
1. **Daftar artikel publish**.
2. **Pencarian artikel berdasarkan judul**.
3. **Filter kategori**.
4. **Progress belajar pengguna**.
5. **Panel “lanjutkan membaca”**.
6. **Bookmark artikel**.
7. **Status baca per artikel**.
8. **Halaman detail artikel**.
9. **Daftar artikel terkait**.

### Elemen UX yang sudah bagus
- ada hero section khusus edukasi,
- ada metrik progres belajar,
- ada CTA untuk melanjutkan artikel terakhir,
- ada pembeda antara artikel dibaca dan belum,
- ada bookmark untuk retensi konten.

### Mekanisme teknis
Progress edukasi disimpan di localStorage terpisah dari store utama. Sistem melacak:
- `readMap`,
- `bookmarks`,
- `lastReadId`.

### Nilai produk
Modul ini sudah bergerak dari “daftar artikel statis” menjadi **learning experience ringan**. Ini penting karena edukasi pasien di dunia nyata sering gagal bukan karena kontennya tidak ada, tapi karena tidak ada mekanisme retensi.

### Potensi peningkatan
- progress per kategori,
- estimasi waktu baca,
- rekomendasi berbasis hasil onboarding,
- analytics event untuk engagement konten,
- sinkronisasi progres lintas perangkat.

---

## 5.4 Detail edukasi: pengalaman membaca yang kontekstual
Halaman detail artikel mendukung alur belajar lanjutan.

### Fitur
- load artikel berdasarkan `slug`,
- otomatis menandai artikel sebagai sudah dibaca,
- tombol simpan/hapus bookmark,
- menampilkan tanggal artikel,
- menampilkan artikel terkait berdasarkan kategori,
- fallback jika artikel tidak ditemukan.

### Kekuatan desain
Pendekatan ini membuat detail page tidak berdiri sendiri. Ia tetap terhubung ke ekosistem edukasi melalui:
- bookmark,
- related content,
- progress learning.

### Dampak UX
User tidak “terjebak” di satu halaman. Setelah membaca, ada jalur alami untuk lanjut ke artikel lain.

---

## 5.5 Jadwal layanan: transparansi operasional
Modul jadwal menyajikan informasi layanan klinik/radioterapi dengan format ringkas dan mudah dipindai.

### Fitur
1. daftar jadwal layanan mingguan,
2. filter berdasarkan hari,
3. tampilan tabel desktop,
4. tampilan kartu mobile,
5. insight otomatis seperti:
   - total sesi,
   - hari terpadat,
   - prioritas layanan,
6. disclaimer perubahan jadwal.

### Nilai produk
Halaman ini bukan hanya menampilkan data mentah, tetapi juga membantu interpretasi. Misalnya, fitur “hari terpadat” memberi nilai tambah karena pasien dapat menyesuaikan perilaku kunjungan.

### Potensi pengembangan
- status slot penuh/tersedia,
- sinkronisasi dengan reservasi,
- filter jenis layanan,
- kalender bulanan,
- ekspor/ingatkan ke kalender pribadi.

---

## 5.6 Panduan terapi: langkah dan checklist
Halaman panduan berfungsi sebagai kombinasi antara **alur layanan** dan **persiapan pasien**.

### Fitur
- daftar langkah terapi sederhana (sebelum, saat, sesudah terapi),
- checklist pasien,
- toggle centang per item,
- persistensi checklist melalui store lokal.

### Manfaat
Ini membantu pasien yang sering lupa membawa dokumen atau tidak yakin harus menyiapkan apa sebelum kunjungan.

### Catatan analitis
Saat ini tampilannya masih sederhana, tetapi konsepnya kuat. Jika dikembangkan, modul ini bisa menjadi “navigator kunjungan” yang sangat berguna untuk pasien baru.

---

## 5.7 FAQ: akses cepat ke pertanyaan umum
Modul FAQ memakai accordion sederhana.

### Fitur
- daftar pertanyaan umum,
- expand/collapse jawaban,
- konten berasal dari store yang dapat dikelola admin.

### Nilai produk
FAQ adalah kanal defleksi beban komunikasi. Ia membantu mengurangi pertanyaan berulang yang sebenarnya bisa dijawab otomatis.

### Potensi peningkatan
- pencarian FAQ,
- filter kategori FAQ,
- FAQ populer,
- rekomendasi otomatis dari halaman kontak.

---

## 5.8 Kontak: kanal komunikasi masuk
Halaman kontak menyediakan dua fungsi sekaligus:

1. **informasi kontak fasilitas**, dan
2. **form kirim pesan**.

### Fitur
- menampilkan telepon, email, alamat, jam layanan,
- form nama, nomor HP, email, pesan,
- submit pesan ke inbox demo,
- reset form setelah submit,
- toast notifikasi sukses.

### Nilai produk
Halaman ini menjadi jembatan dari mode baca menjadi mode aksi. Pengguna yang telah memahami informasi dapat langsung mengirim pertanyaan.

### Catatan teknis
Data pesan belum dikirim ke server, tetapi disimpan ke inbox lokal dan dapat dibaca di panel admin demo. Ini sangat efektif untuk simulasi end-to-end tanpa backend.

---

## 5.9 Modul Pasien: dasbor personal simulatif
Halaman `Pasien` adalah modul yang sangat menarik karena mulai bergerak ke area **patient companion dashboard**.

### Fitur utama
1. **summary card** total profil pasien, jadwal aktif, topik edukasi.
2. **pemilihan profil pasien demo**.
3. **ringkasan terapi personal**:
   - alias,
   - kota/provinsi,
   - diagnosis,
   - stadium,
   - status,
   - kontrol terakhir.
4. **agenda 3 layanan terdekat**.
5. **tips pemantauan gejala harian**.
6. **rekomendasi modul lanjutan**.

### Nilai produk
Ini adalah embrio dari portal pasien yang lebih canggih. Walaupun saat ini datanya masih demo/anonim, struktur UX-nya sudah mengarah ke:
- longitudinal care support,
- therapy adherence,
- patient self-management,
- cross-link antara jadwal, edukasi, dan monitoring.

### Analisis strategis
Jika suatu saat aplikasi berkembang menjadi platform nyata, halaman ini berpotensi menjadi area dengan nilai tertinggi karena paling dekat ke kebutuhan harian pasien.

---

## 5.10 Pemantauan: monitoring sebaran pasien anonim
Halaman `Pemantauan` mengangkat fitur yang lebih analitis dan semi-operasional.

### Fitur utama
1. filter berdasarkan:
   - provinsi,
   - tipe kanker,
   - status terapi.
2. metrik ringkas:
   - total pasien terpantau,
   - jumlah terapi aktif,
   - provinsi dengan kasus terbanyak.
3. simulasi peta sebaran berbasis wilayah,
4. komposisi tipe kanker dengan bar progress,
5. tabel pasien anonim untuk monitoring.

### Kekuatan produk
Modul ini sangat baik untuk menunjukkan value pada stakeholder internal seperti:
- kepala layanan,
- manajer kasus,
- tim operasional,
- unit pengembangan layanan digital.

### Karakter data
Karena data anonim, fitur ini relatif aman untuk demo namun tetap mampu menyampaikan insight yang “terasa nyata”.

### Potensi pengembangan
- heatmap geospasial sungguhan,
- tren mingguan/bulanan,
- drill-down per fasilitas rujukan,
- alert untuk pasien terapi aktif yang lama tidak kontrol.

---

## 5.11 Disclaimer & privasi
Halaman ini masih sederhana, tetapi penting secara komunikasi produk.

### Fungsi
- menegaskan bahwa informasi bersifat edukatif,
- menekankan bahwa aplikasi bukan pengganti konsultasi medis.

### Catatan
Karena domain aplikasi adalah kesehatan, halaman ini seharusnya berkembang menjadi kebijakan privasi dan batas tanggung jawab yang lebih lengkap.

---

## 6. Fitur Navigasi dan Experience Layer

## 6.1 Command palette / pencarian cepat
Salah satu fitur paling modern dalam aplikasi ini adalah **command palette**.

### Fitur
- dibuka dengan `Ctrl/Cmd + K`,
- bisa ditutup dengan `Escape`,
- pencarian berbasis label dan keyword halaman,
- hasil cepat menuju route terkait,
- tersedia juga entry point manual lewat tombol “Cari cepat” dan “Aksi Cepat”.

### Kenapa fitur ini penting?
Pada aplikasi layanan kesehatan, user sering ingin langsung ke tujuan tertentu seperti:
- jadwal,
- FAQ,
- kontak,
- modul pasien.

Command palette mengurangi friksi navigasi secara signifikan.

### Catatan pengembangan
Saat ini belum ada:
- keyboard arrow navigation,
- enter select,
- ranking hasil lebih cerdas,
- aksi non-routing seperti salin nomor telepon.

Namun fondasinya sudah sangat baik.

---

## 6.2 Responsivitas mobile
Produk sudah cukup sadar mobile dengan adanya:
- menu hamburger di navbar,
- bottom navigation tetap di bawah pada mobile,
- fallback daftar jadwal menjadi kartu,
- quick actions yang tetap bisa dibuka di mobile.

Ini relevan karena banyak pengguna layanan kesehatan mengakses via ponsel.

---

## 6.3 Feedback antarmuka
Aplikasi memakai toast notification untuk beberapa interaksi penting, misalnya:
- admin demo aktif,
- logout admin,
- pesan kontak tersimpan,
- akses admin belum aktif.

Ini meningkatkan kejelasan sistem terhadap aksi user.

---

## 7. Fitur Panel Admin: Jabaran Lengkap

Panel admin adalah simulasi CMS + dashboard operasional ringan.

## 7.1 Akses admin demo
### Cara kerja
- jika user menekan “Masuk Admin (Demo)”, state `isAdmin` diaktifkan,
- route `/admin/*` hanya bisa diakses jika `store.isAdmin` bernilai true,
- jika belum aktif, user diarahkan kembali ke beranda dan muncul toast error.

### Analisis
Ini bukan keamanan sungguhan, tetapi cukup untuk kebutuhan demo dan validasi alur internal.

---

## 7.2 Dashboard admin
### Fitur
Menampilkan ringkasan angka:
- jumlah artikel,
- jumlah FAQ,
- jumlah jadwal,
- jumlah pengumuman,
- jumlah pasien,
- jumlah inbox belum dibaca.

### Nilai
Memberi overview cepat kondisi konten dan operasional layanan.

---

## 7.3 Kelola Edukasi
Ini adalah modul CRUD artikel.

### Fitur
- cari artikel berdasarkan judul,
- filter status `draft/publish`,
- tambah artikel,
- edit artikel,
- hapus artikel,
- preview artikel di route publik,
- slug otomatis unik berdasarkan judul,
- update tanggal perubahan.

### Field artikel
- title,
- slug,
- category,
- tags,
- excerpt,
- content,
- status,
- createdAt,
- updatedAt.

### Nilai produk
Modul ini sudah cukup menyerupai mini CMS edukasi.

### Catatan penting
Karena slug dibuat otomatis dan unik, user admin mendapat pengalaman yang lebih aman saat membuat artikel baru.

---

## 7.4 Kelola FAQ
### Fitur
- tambah FAQ,
- edit FAQ,
- hapus FAQ,
- ubah urutan FAQ naik/turun,
- pengelompokan sederhana lewat kategori.

### Nilai
Kemampuan reordering FAQ penting karena pertanyaan paling sering harus muncul di atas.

---

## 7.5 Kelola Jadwal
### Fitur
- tambah jadwal layanan,
- edit jadwal,
- hapus jadwal,
- field hari/jam/layanan/catatan.

### Nilai
Memberi kemampuan admin memperbarui informasi operasional dengan cepat tanpa menyentuh kode sumber data manual.

---

## 7.6 Kelola Pengumuman
### Fitur
- tambah pengumuman,
- edit pengumuman,
- hapus pengumuman,
- set aktif/nonaktif,
- tanggal mulai dan berakhir.

### Nilai
Pengumuman aktif langsung memengaruhi beranda publik, sehingga modul ini menjadi jembatan utama komunikasi perubahan operasional ke pasien.

---

## 7.7 Inbox admin
### Fitur
- melihat semua pesan masuk,
- menghitung jumlah pesan belum dibaca,
- menandai pesan sebagai sudah dibaca,
- badge “baru” untuk pesan yang belum dibaca.

### Nilai produk
Ini adalah simulasi end-to-end paling penting dari alur kontak publik ke tindak lanjut admin.

### Potensi pengembangan
- filter pesan,
- status tindak lanjut,
- assignment ke petugas,
- SLA response tracking.

---

## 7.8 Modul pasien admin
Ini adalah salah satu modul admin paling kuat.

### Fitur
1. summary total pasien, terapi aktif, dan provinsi aktif.
2. form pasien anonim.
3. field terstruktur:
   - alias,
   - kota,
   - provinsi,
   - tanggal kunjungan terakhir,
   - tipe kanker,
   - stadium,
   - status.
4. edit dan hapus data.
5. pencarian pasien berdasarkan banyak atribut.
6. tabel daftar pasien anonim.

### Nilai produk
Modul ini membuat aplikasi tidak sekadar content platform, tetapi mulai masuk ke **service operations support**.

### Kekuatan desain data
Pilihan enum untuk kanker, stadium, dan status membantu konsistensi data, walau tetap bisa diperluas di masa depan.

---

## 7.9 Pengaturan admin
### Fitur
- toggle tema light/dark,
- ubah informasi kontak publik:
  - telepon,
  - email,
  - alamat,
  - jam layanan.

### Nilai
Menarik karena perubahan di panel admin langsung tercermin pada halaman kontak publik. Ini memperlihatkan hubungan nyata antara area admin dan area pasien.

---

## 8. Model Data: Semua Entitas yang Didukung

Aplikasi memiliki model data yang cukup kaya untuk ukuran demo frontend.

### 8.1 Artikel
Dipakai untuk modul edukasi dan detail edukasi.

### 8.2 FAQ
Dipakai pada halaman FAQ publik dan pengelolaan admin.

### 8.3 Jadwal
Dipakai pada halaman jadwal publik, agenda pasien, dan pengelolaan admin.

### 8.4 Pengumuman
Dipakai pada beranda publik dan manajemen admin.

### 8.5 Inbox
Dipakai untuk form kontak dan inbox admin.

### 8.6 Settings
Dipakai untuk tema dan informasi kontak publik.

### 8.7 OnboardingData
Dipakai untuk personalisasi beranda.

### 8.8 PatientCase
Dipakai di modul pasien publik, pemantauan, dan admin pasien.

### 8.9 ServiceModule
Dipakai untuk menampilkan modul digital baru/rekomendasi.

### 8.10 Checklist & checkedItems
Dipakai untuk panduan pasien.

### Analisis struktur data
Struktur ini menunjukkan aplikasi sudah dirancang dengan paradigma domain yang jelas:
- domain edukasi,
- domain layanan,
- domain komunikasi,
- domain pasien,
- domain konfigurasi.

Ini fondasi yang bagus untuk transisi ke backend/API di tahap berikutnya.

---

## 9. Persistensi dan State Management

## 9.1 Store utama lokal
Hook `useLocalStore` menyimpan hampir seluruh state produk ke localStorage.

### Hal yang dicakup
- artikel,
- FAQ,
- jadwal,
- pengumuman,
- inbox,
- data pasien,
- checklist,
- settings,
- onboarding,
- status admin login demo.

### Kelebihan
- cepat,
- tidak perlu backend,
- semua perubahan admin langsung persisten lokal.

### Kekurangan
- tidak ada recovery pusat,
- data hanya lokal browser,
- tidak ada collaborative editing.

---

## 9.2 Store progres belajar
Hook `useLearningProgress` terpisah dari store utama.

### Kenapa ini bagus?
Karena progres membaca adalah concern berbeda dari data operasional. Pemisahan ini membuat kode lebih rapi dan lebih mudah dikembangkan, misalnya bila nanti progres dibawa ke backend user profile.

---

## 9.3 Sinkronisasi tema
Tema dark/light diterapkan dengan toggle class pada root `document.documentElement`. Ini pendekatan standar dan cukup efisien.

---

## 10. Desain UI, Komponen, dan Reusability

## 10.1 Komponen UI reusable
Aplikasi memiliki komponen dasar seperti:
- `Button`,
- `Card`,
- `Input`,
- `Dialog`,
- `Table`,
- `AccordionItem`.

### Analisis
Komponen ini sederhana namun cukup untuk menciptakan konsistensi visual. Cocok untuk tahap awal produk.

## 10.2 Sistem visual
Ciri visual utama:
- dominasi warna biru/cyan sebagai asosiasi medis dan kepercayaan,
- card-based interface,
- banyak gradient untuk penekanan hero dan modul utama,
- ikon kuat untuk membantu scanning cepat,
- animasi mikro seperti shimmer, float, fade-in, rise-in, pulse.

### Dampak UX
UI terasa modern, ramah, dan tidak terlalu “klinis dingin”. Ini penting untuk konteks pasien.

## 10.3 Accessibility consideration
Ada beberapa perhatian aksesibilitas yang sudah muncul:
- shortcut keyboard command palette,
- reduced motion handling via CSS media query,
- button dan link relatif jelas.

Namun masih ada ruang perbaikan seperti:
- focus state lebih eksplisit,
- semantik dialog yang lebih lengkap,
- navigasi keyboard penuh di command palette,
- label form yang lebih kuat.

---

## 11. Kekuatan Produk yang Paling Menonjol

### 11.1 Integrasi lintas domain
Produk berhasil menggabungkan:
- edukasi,
- jadwal,
- kontak,
- monitoring,
- panel admin.

Banyak demo aplikasi kesehatan hanya fokus pada satu aspek; aplikasi ini sudah menunjukkan ekosistem layanan yang lebih lengkap.

### 11.2 Personalisasi yang realistis namun ringan
Onboarding dan progres belajar memberi rasa personal tanpa perlu autentikasi kompleks.

### 11.3 End-to-end simulation yang kuat
Alur publik → kirim pesan → muncul di inbox admin adalah contoh simulasi yang sangat efektif untuk demo stakeholder.

### 11.4 Fondasi data pasien anonim yang matang
Modul pasien dan pemantauan membuka jalan ke use case yang lebih strategis daripada sekadar portal informasi.

### 11.5 Mobile-aware navigation
Adanya mobile bottom nav dan pola responsive menunjukkan produk dipikirkan untuk penggunaan lapangan.

---

## 12. Keterbatasan dan Risiko Saat Ini

### 12.1 Tidak ada backend nyata
Semua data hidup di localStorage. Artinya:
- tidak ada multi-user,
- tidak ada audit trail,
- tidak ada data source of truth terpusat.

### 12.2 Keamanan admin hanya simulasi
Akses admin demo sangat cocok untuk prototyping, tetapi tidak bisa dipakai sebagai sistem produksi.

### 12.3 Belum ada validasi data yang lebih ketat
Sebagian besar form cukup longgar. Untuk sistem nyata, diperlukan validasi lebih dalam, misalnya:
- format telepon,
- email valid,
- required fields yang lebih lengkap,
- sanitasi input.

### 12.4 Belum ada mekanisme error state menyeluruh
Karena tidak ada API, memang belum terlihat kebutuhan retry/loading/error. Namun saat dihubungkan ke backend, lapisan ini akan sangat penting.

### 12.5 Aksesibilitas dialog dan form masih bisa ditingkatkan
Komponen dialog saat ini custom minimalis, belum memiliki affordance aksesibilitas setingkat library dialog production-ready.

---

## 13. Peluang Pengembangan Produk Berikutnya

Berikut prioritas pengembangan yang paling masuk akal bila aplikasi ingin naik kelas.

### Prioritas 1 — Backend & autentikasi nyata
- login admin sungguhan,
- role/permission,
- API untuk artikel, FAQ, jadwal, pengumuman, inbox, pasien.

### Prioritas 2 — Portal pasien yang lebih personal
- akun pasien,
- riwayat jadwal individual,
- reminder terapi personal,
- sinkronisasi progres edukasi lintas perangkat.

### Prioritas 3 — Operasional layanan
- tiket follow-up inbox,
- status penanganan pesan,
- assignment petugas,
- SLA dashboard.

### Prioritas 4 — Analitik dan pelaporan
- event analytics edukasi,
- funnel onboarding,
- halaman dengan engagement tertinggi,
- ringkasan tren pasien per wilayah.

### Prioritas 5 — UX refinement
- pencarian global lintas konten,
- FAQ searchable,
- command palette lebih cerdas,
- onboarding reset/edit preference,
- empty/loading/error states yang lebih lengkap.

---

## 14. Kesimpulan Akhir

Secara keseluruhan, OnkoSob adalah **prototype frontend yang sangat kaya fitur** dan sudah melampaui level “website informasi biasa”. Ia telah memiliki DNA sebagai:

- **platform edukasi pasien**,
- **navigator layanan klinis**,
- **simulasi patient support dashboard**,
- **mini CMS admin**,
- **pondasi operasi layanan digital onkologi**.

Jika dilihat dari implementasi yang ada, fitur yang paling kuat saat ini adalah:

1. **Beranda personal dengan onboarding**,
2. **Modul edukasi dengan progres belajar dan bookmark**,
3. **Jadwal layanan yang informatif dan adaptif mobile**,
4. **Inbox admin hasil integrasi form kontak publik**,
5. **Modul pasien + pemantauan sebaran pasien anonim**.

Dengan kata lain, aplikasi ini bukan hanya “cantik”, tetapi sudah memiliki logika produk yang cukup matang untuk:
- demo manajemen,
- uji coba UX pengguna,
- eksplorasi kebutuhan layanan digital rumah sakit,
- dasar pengembangan MVP yang lebih serius.

---

## 15. Ringkasan Semua Fitur dalam Satu Daftar

Agar mudah dipakai sebagai referensi cepat, berikut daftar seluruh fitur yang ditemukan:

### Area publik
- onboarding 4 langkah,
- personalisasi beranda,
- hero + CTA konsultasi,
- quick links,
- marquee trust signal,
- summary stats,
- pengumuman aktif,
- feature highlight,
- patient journey,
- showcase modul digital baru,
- command palette / quick navigation,
- navbar desktop,
- menu mobile,
- bottom navigation mobile,
- daftar artikel edukasi,
- cari artikel,
- filter kategori artikel,
- progres belajar,
- lanjutkan membaca,
- bookmark artikel,
- status baca artikel,
- detail artikel,
- artikel terkait,
- daftar jadwal layanan,
- filter hari jadwal,
- insight hari terpadat,
- tampilan tabel desktop dan kartu mobile,
- panduan terapi 3 tahap,
- checklist pasien,
- FAQ accordion,
- informasi kontak layanan,
- form kirim pesan,
- modul pasien demo,
- profil pasien anonim,
- ringkasan terapi personal,
- agenda layanan terdekat,
- tips pemantauan gejala,
- rekomendasi modul lanjutan,
- dashboard pemantauan sebaran pasien,
- filter provinsi/tipe/status,
- komposisi tipe kanker,
- daftar pasien anonim,
- disclaimer edukatif.

### Area admin
- login admin demo,
- proteksi route admin demo,
- sidebar dashboard,
- dashboard statistik admin,
- CRUD artikel edukasi,
- slug artikel unik otomatis,
- preview artikel,
- filter artikel berdasarkan status,
- CRUD FAQ,
- reordering FAQ,
- CRUD jadwal,
- CRUD pengumuman,
- aktivasi/nonaktif pengumuman,
- inbox pesan masuk,
- tandai pesan dibaca,
- CRUD pasien anonim,
- pencarian pasien,
- statistik terapi aktif/provinsi aktif,
- toggle tema,
- edit kontak publik.

### Fitur sistem/fondasi
- persistensi localStorage,
- hook store lokal,
- hook progres belajar,
- toast notification,
- dark mode,
- komponen UI reusable,
- animasi mikro,
- reduced motion fallback,
- struktur data domain yang cukup lengkap.

