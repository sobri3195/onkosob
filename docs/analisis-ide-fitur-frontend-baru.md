# Analisis Mendalam: Tambahan Ide Fitur Baru Khusus Frontend

Dokumen ini berfokus pada ide fitur **khusus sisi frontend** untuk meningkatkan pengalaman pengguna (pasien/masyarakat) dan efisiensi interaksi pada aplikasi OnkoSob. Setiap ide dirancang agar bisa diimplementasikan tanpa bergantung penuh pada perubahan backend besar di tahap awal (dapat dimulai dengan mock/local state).

---

## Prompt 1 — Smart Onboarding & Personalisasi Berbasis Tujuan Pengguna

### Latar belakang masalah
Pengguna baru sering kebingungan dengan alur aplikasi kesehatan karena informasi cukup banyak (jadwal, edukasi, FAQ, kontak). Tanpa pengarahan awal, pengguna cenderung langsung keluar sebelum menemukan nilai utama aplikasi.

### Ide fitur frontend
Buat modul **onboarding interaktif** 3–5 langkah yang menanyakan:
- tujuan utama pengguna (cari jadwal, baca edukasi, tanya layanan),
- preferensi notifikasi,
- topik edukasi yang diminati.

Setelah selesai, beranda menampilkan blok yang dipersonalisasi (quick action + konten prioritas).

### Nilai produk
- Menurunkan bounce rate pengguna baru.
- Mempercepat time-to-value (pengguna cepat menemukan fitur relevan).
- Meningkatkan engagement karena konten terasa personal.

### Implementasi frontend yang disarankan
- Gunakan komponen stepper/modal onboarding di halaman awal.
- Simpan preferensi di local storage (misalnya lewat store global yang sudah ada).
- Render section beranda secara condition-based berdasarkan preferensi.
- Sediakan tombol “atur ulang personalisasi” di pengaturan.

### KPI yang bisa dipantau
- Completion rate onboarding.
- CTR quick action hasil personalisasi.
- Rasio kunjungan ulang dalam 7 hari.

### Prompt siap pakai
> Rancang flow onboarding interaktif untuk aplikasi layanan kesehatan berbasis React + Tailwind. Buat 4 langkah: tujuan pengguna, preferensi notifikasi, minat topik edukasi, dan ringkasan konfirmasi. Sertakan UX copy berbahasa Indonesia, state management ringan, validasi input, dan personalisasi komponen beranda berdasarkan hasil onboarding. Berikan struktur komponen, contoh data state, dan acceptance criteria yang terukur.

---

## Prompt 2 — Pusat Navigasi Cepat (Command Palette + Global Search)

### Latar belakang masalah
Navigasi menu tradisional kurang efisien ketika pengguna ingin langsung ke halaman spesifik (misal “FAQ”, “jadwal hari ini”, atau “kontak darurat”).

### Ide fitur frontend
Tambahkan **command palette** (shortcut seperti `Ctrl/Cmd + K`) untuk:
- mencari halaman,
- menjalankan aksi cepat (buka kontak, salin nomor, buka jadwal),
- menampilkan rekomendasi berdasarkan histori klik.

### Nilai produk
- Mengurangi friksi navigasi terutama di desktop.
- Mempercepat akses informasi penting.
- Memberi kesan aplikasi modern dan responsif.

### Implementasi frontend yang disarankan
- Dialog overlay reusable dengan input fokus otomatis.
- Index statis dari route + aksi cepat + tag sinonim.
- Keyboard navigation (arrow up/down, enter, esc).
- Fallback mobile: tombol floating “Aksi Cepat”.

### KPI yang bisa dipantau
- Rata-rata waktu menuju halaman target.
- Penggunaan shortcut per sesi.
- Penurunan klik bertingkat dari menu utama.

### Prompt siap pakai
> Buat desain dan implementasi command palette frontend untuk aplikasi React Router. Fitur harus mendukung pencarian halaman, aksi cepat, keyboard accessibility penuh, highlight kata kunci, dan fallback mobile berbentuk bottom-sheet. Sertakan data schema item pencarian, strategi ranking hasil, serta contoh integrasi ke layout utama.

---

## Prompt 3 — Kartu Edukasi Interaktif dengan Progress Belajar

### Latar belakang masalah
Konten edukasi sering hanya dibaca sekilas. Tanpa indikator progres, pengguna sulit melanjutkan materi dan retensi pengetahuan menjadi rendah.

### Ide fitur frontend
Ubah daftar edukasi menjadi **learning cards** dengan:
- indikator “sudah dibaca/belum”,
- progress topik per kategori,
- bookmark dan “lanjutkan membaca”.

### Nilai produk
- Mendorong konsumsi konten edukasi yang berkelanjutan.
- Membentuk kebiasaan belajar mikro (micro-learning).
- Meningkatkan discovery artikel terkait.

### Implementasi frontend yang disarankan
- Tambahkan state progres berbasis local storage.
- Komponen badge status (`baru`, `dalam proses`, `selesai`).
- Section “Lanjutkan dari terakhir” di halaman edukasi.
- Skeleton loading + empty state yang komunikatif.

### KPI yang bisa dipantau
- Jumlah artikel yang diselesaikan per pengguna.
- Rasio pengguna yang kembali ke konten tersimpan.
- Waktu baca rata-rata per sesi edukasi.

### Prompt siap pakai
> Susun arsitektur frontend modul edukasi interaktif berbasis kartu untuk React. Wajib ada fitur bookmark, read-progress per artikel, progress bar per kategori, dan panel “lanjutkan membaca”. Berikan contoh tipe data, komponen UI, event analytics yang perlu dilacak, serta strategi sinkronisasi local storage agar tetap konsisten.

---

## Prompt 4 — Form Cerdas Adaptif (Dynamic Form + Inline Guidance)

### Latar belakang masalah
Form layanan/keluhan sering ditinggalkan karena terasa panjang, ambigu, dan kurang panduan saat pengguna mengisi data.

### Ide fitur frontend
Bangun **dynamic form** yang berubah sesuai jawaban pengguna:
- field kondisional,
- estimasi waktu pengisian,
- validasi real-time dengan bahasa non-teknis,
- tooltip bantuan kontekstual.

### Nilai produk
- Menurunkan abandonment rate pada form.
- Memperbaiki kualitas data yang masuk.
- Mengurangi kebutuhan klarifikasi ulang dari admin.

### Implementasi frontend yang disarankan
- Schema-driven form (field metadata + aturan tampil).
- Progress indicator per langkah.
- Autosave draft lokal saat pengguna belum submit.
- Ringkasan jawaban sebelum kirim.

### KPI yang bisa dipantau
- Form completion rate.
- Error rate per field.
- Waktu rata-rata hingga submit.

### Prompt siap pakai
> Buat konsep dynamic form frontend untuk layanan kesehatan dengan React Hook Form + Zod (atau alternatif sejenis). Form harus mendukung field kondisional, inline validation message berbahasa Indonesia yang mudah dipahami, autosave draft, dan review page sebelum submit. Sertakan contoh schema, aturan visibility, dan pola komponen reusable agar bisa dipakai lintas halaman.

---

## Prompt 5 — Dashboard Status Layanan Pribadi (Timeline & Notifikasi Visual)

### Latar belakang masalah
Pengguna sulit memantau status permintaan/keluhan setelah mengirim form. Ketidakjelasan ini dapat menurunkan trust terhadap layanan.

### Ide fitur frontend
Tambahkan **dashboard status personal** dengan:
- timeline status (dikirim → diproses → ditindaklanjuti → selesai),
- warna/status chip yang konsisten,
- notifikasi in-app untuk perubahan terbaru,
- filter berdasarkan jenis layanan.

### Nilai produk
- Transparansi proses layanan meningkat.
- Mengurangi pertanyaan berulang “sudah sampai mana?”.
- Meningkatkan persepsi profesionalitas platform.

### Implementasi frontend yang disarankan
- Komponen timeline reusable dan responsif.
- Mapping status ke visual token (ikon, warna, label).
- Empty state yang mengarahkan pengguna membuat permintaan baru.
- Polling ringan/manual refresh jika belum ada realtime channel.

### KPI yang bisa dipantau
- Jumlah kunjungan ke halaman status.
- Penurunan inquiry status via kontak manual.
- Rasio notifikasi yang diklik.

### Prompt siap pakai
> Rancang halaman dashboard status layanan pribadi pada frontend React yang menampilkan timeline progres tiket secara visual, status chip yang konsisten, filter jenis layanan, dan notifikasi in-app. Berikan rekomendasi struktur komponen, skema data UI, desain state (loading/empty/error), serta checklist aksesibilitas agar mudah dipakai di mobile dan desktop.

---

## Rekomendasi Prioritas Implementasi
1. **Smart Onboarding** (impact cepat ke aktivasi pengguna baru).
2. **Dynamic Form Cerdas** (langsung berpengaruh ke konversi submit).
3. **Dashboard Status Layanan** (meningkatkan trust dan transparansi).
4. **Kartu Edukasi Interaktif** (menguatkan retensi konten).
5. **Command Palette** (optimalisasi experience pengguna aktif).

Urutan ini memaksimalkan dampak bisnis lebih dulu (aktivasi, konversi, trust), lalu diikuti peningkatan efisiensi navigasi dan engagement jangka panjang.
