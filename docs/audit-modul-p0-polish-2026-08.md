# Audit modul Lentera — P0 sampai polish

Tanggal audit: 26 Agustus 2026. Cakupan: aplikasi React, penyimpanan lokal, autentikasi REST Supabase, sinkronisasi progres, Document Vault, Follow-up, companion, editorial, migrasi/RLS, dan build produksi.

## Ringkasan eksekutif

Build produksi berhasil, tetapi sebelum audit ada tiga jalur inti yang secara fungsional rusak: callback pemulihan kata sandi tidak mengadopsi token URL, bootstrap autentikasi dapat berhenti selamanya saat profil gagal dimuat, dan sinkronisasi lokal membaca key yang bukan key aplikasi aktif. Ketiganya diperbaiki dalam perubahan yang menyertai audit ini. Placeholder `.env.example` sekarang juga tidak lagi dianggap sebagai konfigurasi backend yang valid.

Tidak ditemukan P0 terbuka yang dapat direproduksi hanya melalui inspeksi statis dan build. Namun status ini **bukan** sertifikasi produksi: pengujian dengan proyek Supabase nyata, pengujian migrasi, browser/E2E, aksesibilitas otomatis, dan dependency/security scan belum tersedia sebagai script proyek.

## Definisi prioritas

| Level | Makna |
| --- | --- |
| P0 | Kebocoran/kehilangan data, bypass otorisasi, atau aplikasi inti tidak dapat dipakai. |
| P1 | Alur utama gagal atau hasilnya salah tanpa workaround yang layak. |
| P2 | Fungsi penting tidak lengkap, inkonsisten, atau rapuh pada kondisi umum. |
| P3 | Kualitas, maintainability, observability, dan edge case. |
| Polish | Performa persepsian, konsistensi UX/copy, dan penyempurnaan aksesibilitas. |

## Temuan yang sudah diperbaiki

### P1 — callback reset password sebelumnya tidak berfungsi

Supabase mengembalikan token recovery melalui fragment URL. Aplikasi sebelumnya langsung memanggil endpoint perubahan password menggunakan session lama/kosong dan tidak pernah membaca fragment tersebut. Kini fragment diurai, payload JWT dipakai untuk membentuk user session, session disimpan sebelum route dirender, dan token dihapus dari address bar untuk mengurangi paparan melalui screenshot/history.

**Verifikasi lanjutan yang wajib:** uji email recovery nyata dengan konfigurasi `SITE_URL` dan redirect allow-list Supabase, termasuk token kedaluwarsa dan link yang digunakan dua kali.

### P1 — route guard dapat terus menampilkan “Memulihkan sesi aman”

Bootstrap auth sebelumnya tidak mempunyai `try/finally`. Kegagalan jaringan saat mengambil profil membuat `loading` tidak pernah menjadi `false`. Bootstrap sekarang selalu menyelesaikan loading dan membersihkan session gagal secara fail-closed.

### P1 — sinkronisasi perangkat mengirim payload kosong

Data personal aktif disimpan di `lentera_user_v1`, sedangkan pembaca sinkronisasi hanya memeriksa dua key legacy lain. Pembaca sekarang memigrasikan schema aktif dan memetakan artikel, perjalanan, glosarium, kuis, checklist, dan pertanyaan ke kontrak cloud; fallback legacy tetap dipertahankan.

### P2 — placeholder environment dianggap backend aktif

Menyalin `.env.example` sebelumnya membuat `isSupabaseConfigured=true`, sehingga UI menawarkan akun tetapi setiap request menuju host contoh. Deteksi konfigurasi kini menolak placeholder dan seluruh method auth/function mempunyai guard yang konsisten.

## Backlog terbuka

### P1 — harus selesai sebelum produksi terautentikasi

1. **Belum ada integration test Supabase/RLS.** SQL terlihat menerapkan RLS pada tabel domain dan storage, tetapi policy harus diuji sebagai anon, pemilik, caregiver, editor, reviewer, dan admin. Fokuskan negative tests pada perubahan role profil, akses draft, signed URL dokumen, permission kedaluwarsa, dan transisi editorial.
2. **Alur registrasi session langsung belum utuh di UI.** Jika email confirmation dimatikan, API dapat mengembalikan session langsung. Session kini tersimpan, tetapi `AuthContext` yang sudah mounted tidak menerima event perubahan dan layar tetap menyuruh pengguna memeriksa email. Tambahkan event/session subscription atau arahkan berdasarkan bentuk respons.
3. **Follow-up backend belum dipakai oleh repository UI.** Migrasi menyediakan tabel cloud, tetapi `followUpRepository` hanya memakai `localStorage`. Pengguna login dapat salah mengira follow-up tersinkron karena fitur akun menjanjikan lintas perangkat. Tampilkan label “hanya perangkat ini” secara konsisten atau implementasikan repository cloud + conflict strategy.
4. **Operasi akun tidak menangani error secara konsisten.** Update profil, sinkronisasi, dan ekspor cloud tidak mempunyai busy state/`catch`; rejection dapat menjadi unhandled promise dan pengguna tidak mendapat pemulihan yang jelas.

### P2 — fungsi penting yang kurang/rapuh

1. **Sinkronisasi pertanyaan tidak idempotent.** Setiap sync melakukan insert ulang pertanyaan tanpa conflict key/deduplikasi; retry dapat menghasilkan duplikat.
2. **Data lokal tidak sinkron antar-tab.** Hook `useLocalStorage` menulis perubahan tetapi tidak mendengar event `storage`; dua tab dapat saling menimpa state lama. Tambahkan listener dan schema validation per key.
3. **Relasi task follow-up ↔ appointment tidak dibersihkan.** Menghapus task atau plan meninggalkan event companion `follow-up-*`; mengubah tanggal task juga tidak memperbarui event yang sudah ditautkan.
4. **Tanggal kontrol dari catatan kunjungan tidak memperbarui plan.** Form menyimpan `nextFollowUpDate` pada visit, sementara kartu/reminder membaca field plan. Pengguna mengisi tanggal tetapi dashboard tetap menyatakan belum ada jadwal.
5. **Clipboard/share tidak mempunyai fallback error.** Beberapa tombol hanya menangani fulfilled promise. Permission denial, insecure context, atau pembatalan native share dapat menghasilkan rejection tanpa feedback.
6. **Validasi dokumen hanya berdasarkan MIME dan ekstensi dari browser.** Ini baik sebagai filter UX, bukan kontrol keamanan. Tambahkan validasi magic bytes/malware scanning server-side, batas server, dan cleanup object ketika insert metadata gagal setelah upload.
7. **Reset data tidak mengabarkan semua store mounted.** Penghapusan localStorage tidak otomatis mereset state React yang sudah hidup. Standarkan satu event reset global atau satu data store.

### P3 — engineering hardening

1. Tambahkan test runner dan coverage minimum untuk migrasi data, reminder/date boundary, editorial state machine, content validation, filename validation, dan merge cloud.
2. Tambahkan Playwright untuk login, recovery, role guards, upload/delete document, offline/local mode, follow-up CRUD, export, dan account deletion.
3. Pecah file yang berisi banyak komponen satu-baris (khususnya companion, follow-up, auth, dan account). Bentuk sekarang menyulitkan review, instrumentasi error, dan targeted tests.
4. Tambahkan error boundary route-level dan observability yang tidak merekam data kesehatan/isi catatan. Saat ini kegagalan render dapat menjatuhkan seluruh tree.
5. Terapkan schema runtime untuk semua data localStorage. Spread terhadap JSON yang bentuknya valid tetapi salah tipe dapat memicu error jauh dari sumber kerusakan.
6. Tambahkan CI untuk `npm ci`, typecheck/build, lint, unit, E2E smoke, migration lint/test, dan secret scan. Proyek saat ini hanya mempunyai script dev/build/preview/asset generation.

### Polish

1. Entry chunk produksi sekitar 513 kB minified dan melewati ambang Vite 500 kB. Lazy-load halaman companion/editorial/admin dan pertimbangkan chunk vendor eksplisit.
2. Gunakan formatter/linter agar JSX dan service tidak menjadi satu baris; ini juga membuat citation, review diff, dan debugging lebih tepat.
3. Audit keyboard/focus untuk dialog buatan sendiri, onboarding panel, menu mobile, dan konfirmasi hapus; gunakan primitive dialog yang sudah tersedia secara konsisten.
4. Seragamkan bahasa tombol (`Copy`/`Salin`, `Print`/`Cetak`, “Follow-up”/“tindak lanjut”) dan status Indonesia untuk data enum.
5. Tambahkan skeleton yang mempertahankan layout, empty state dengan tindakan berikutnya, serta feedback “tersimpan” yang benar-benar mengikuti hasil persistence.

## Matriks kesiapan modul

| Modul | Status | Catatan utama |
| --- | --- | --- |
| Publik/artikel/tools | Layak demo | Konten tervalidasi saat dev; butuh E2E, link check, dan a11y scan. |
| Personalisasi lokal | Layak dengan hardening | Persisten, export/reset tersedia; perlu cross-tab dan runtime schema. |
| Auth/account | Belum production-ready | Fix bootstrap/recovery masuk; perlu integration test dan error UX. |
| Cloud education sync | Belum production-ready | Key aktif sudah benar; idempotensi dan round-trip test belum ada. |
| Editorial/admin | Belum production-ready | Guard UI + RLS tersedia; matrix authorization belum diuji nyata. |
| Document Vault | Belum production-ready | Private storage/RLS dirancang; perlu atomic cleanup dan server file inspection. |
| Companion | Layak local beta | CRUD lokal tersedia; belum cloud sync dan cross-tab safe. |
| Follow-up | Layak local alpha | Banyak UI tersedia, tetapi ada inkonsistensi plan/visit/event dan cloud belum tersambung. |
| Patient app `/apps/*` | Perlu product QA | Store terpisah dari personalisasi utama; perlu keputusan apakah ini eksperimen atau produk yang didukung. |

## Gate rilis yang disarankan

1. **Gate P0/P1:** jalankan migration test pada proyek disposable; buktikan seluruh negative authorization cases; E2E recovery dan delete-account; pastikan cleanup upload gagal.
2. **Gate P2:** selesaikan konsistensi follow-up, idempotensi sync, cross-tab, dan error states.
3. **Gate P3:** CI wajib hijau dengan unit + E2E smoke + lint + build; dokumentasikan backup/restore dan incident response.
4. **Gate polish:** chunking, a11y WCAG 2.2 AA scan/manual pass, responsive/browser matrix, dan konsistensi copy.

## Pemeriksaan yang dilakukan

- Inventaris route, hook, service, migration, marker TODO/error, akses localStorage, fetch, clipboard/share, dan policy RLS melalui `find`, `rg`, dan pembacaan sumber terarah.
- `npm run build` berhasil (TypeScript project build + Vite production build); tersisa warning ukuran chunk.
- `git diff --check` berhasil.

