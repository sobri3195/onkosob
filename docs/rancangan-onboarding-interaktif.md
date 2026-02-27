# Rancangan Flow Onboarding Interaktif (React + Tailwind)

## Tujuan
Mengarahkan pasien baru mengisi preferensi dalam 4 langkah singkat agar beranda otomatis menampilkan konten yang relevan.

## 4 Langkah Onboarding + UX Copy (Bahasa Indonesia)
1. **Tujuan pengguna**
   - Judul: **"Apa tujuan utama Anda saat ini?"**
   - Copy bantuan: **"Pilih fokus utama agar kami bisa menampilkan panduan yang paling relevan."**
   - Opsi: Memahami alur terapi, Mengatur jadwal & pengingat, Dukungan keluarga.
2. **Preferensi notifikasi**
   - Judul: **"Pilih kanal pengingat yang paling nyaman"**
   - Copy bantuan: **"Anda bisa memilih lebih dari satu kanal."**
   - Opsi kanal: WhatsApp, Email, Notifikasi browser.
   - Opsi waktu: pagi/siang/malam.
3. **Minat topik edukasi**
   - Judul: **"Topik edukasi yang ingin diprioritaskan"**
   - Copy bantuan: **"Pilih minimal 2 topik agar rekomendasi lebih personal."**
   - Opsi: Efek Samping, Nutrisi, Persiapan Terapi, Kesehatan Mental, Hak & Administrasi BPJS, Latihan Ringan.
4. **Ringkasan konfirmasi**
   - Judul: **"Konfirmasi ringkasan"**
   - Copy bantuan: **"Periksa kembali preferensi Anda sebelum menyelesaikan onboarding."**
   - Aksi final: **"Selesai & Personalisasi Beranda"**.

## Struktur Komponen
- `src/components/onboarding/OnboardingWizard.tsx`
  - Menangani stepper 4 langkah.
  - Menangani validasi per langkah.
  - Mengirim hasil onboarding melalui callback `onComplete`.
- `src/pages/public/HomePage.tsx`
  - Menampilkan wizard jika `store.onboarding.completed === false`.
  - Menampilkan kartu personalisasi beranda jika onboarding selesai.
- `src/routes/AppRoutes.tsx`
  - Menyimpan hasil onboarding ke store lokal dengan `update(...)`.
- `src/data/seed.ts`
  - Menambahkan tipe `OnboardingData` dan state awal onboarding.

## Contoh Data State
```ts
onboarding: {
  completed: true,
  completedAt: '2026-02-10T09:15:00.000Z',
  goal: 'atur-jadwal',
  notificationPreferences: {
    whatsapp: true,
    email: false,
    push: true,
    reminderTime: 'pagi'
  },
  educationTopics: ['Nutrisi', 'Efek Samping', 'Kesehatan Mental']
}
```

## Validasi Input (ringan)
- Langkah 1: `goal` wajib dipilih.
- Langkah 2: minimal 1 kanal notifikasi + `reminderTime` wajib dipilih.
- Langkah 3: minimal 2 topik edukasi.
- Langkah 4: checkbox konfirmasi wajib dicentang sebelum submit.

## Personalisasi Komponen Beranda
Setelah onboarding selesai, beranda menampilkan:
- Header fokus pasien berdasarkan `goal`.
- Narasi waktu pengingat berdasarkan `notificationPreferences.reminderTime`.
- Badge topik personal dari `educationTopics`.

## Acceptance Criteria (Terukur)
1. Wizard onboarding muncul otomatis di beranda untuk pengguna dengan `completed = false`.
2. Pengguna tidak bisa lanjut ke langkah berikutnya bila validasi langkah saat ini gagal.
3. Pesan error validasi tampil dalam bahasa Indonesia dan spesifik per kegagalan.
4. Tombol **Selesai & Personalisasi Beranda** hanya berhasil bila checkbox konfirmasi dicentang.
5. Setelah submit sukses, `onboarding.completed` tersimpan `true` di local storage.
6. Reload halaman tetap mempertahankan hasil onboarding (persisten).
7. Beranda menampilkan minimal 1 elemen personalisasi (judul fokus) dan daftar topik terpilih.
8. Durasi alur onboarding dapat diselesaikan ≤ 2 menit pada penggunaan normal.
