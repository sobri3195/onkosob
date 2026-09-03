# Audit modul Lentera — P0 sampai polish

Tanggal audit ulang: **3 September 2026**. Audit ini adalah pemeriksaan statis menyeluruh atas aplikasi React, service browser, autentikasi REST Supabase, migrasi/RLS, serta build produksi. Temuan diberi status **terbukti**, **risiko**, atau **belum terverifikasi** agar hasil inspeksi kode tidak disalahartikan sebagai hasil E2E.

## Ringkasan eksekutif

- Build TypeScript dan produksi berhasil. Tidak ada P0 terbuka yang dapat dibuktikan hanya dari build dan inspeksi statis.
- Aplikasi **layak untuk demo lokal**, tetapi fitur akun, sinkronisasi, editorial, Document Vault, dan follow-up **belum layak dinyatakan production-ready** tanpa backend disposable dan pengujian role/RLS.
- Ditemukan **2 P1 terbukti**, **6 P2 terbukti**, serta gap pengujian/operasional pada P3 dan polish.
- P1 terpenting adalah registrasi ketika konfirmasi email dimatikan: Supabase menyimpan session, tetapi `AuthContext` yang sudah mounted tidak diperbarui. Pengguna tetap melihat instruksi “periksa email” dan route terproteksi masih menganggap pengguna belum login.
- P1 kedua adalah kontrak produk follow-up yang terpecah: skema cloud dan RLS sudah dibuat, namun seluruh CRUD layar memakai `localStorage`. Data tidak muncul di perangkat lain dan tidak terhapus oleh penghapusan akun cloud.

## Cara membaca prioritas

| Level | Kriteria audit ini |
| --- | --- |
| P0 | Kebocoran/kehilangan data luas, bypass otorisasi, atau aplikasi tidak dapat dipakai sama sekali. |
| P1 | Alur utama gagal, klaim privasi/sinkronisasi menyesatkan, atau risiko data pengguna tanpa workaround yang wajar. |
| P2 | Fungsi penting tidak lengkap, hasil inkonsisten, atau error umum tidak dipulihkan dengan benar. |
| P3 | Kekurangan engineering, observability, maintainability, dan edge case. |
| Polish | Performa persepsian, aksesibilitas, bahasa, dan konsistensi UX. |

## Hasil per modul

| Modul | Yang berfungsi dari inspeksi/build | Error, kekurangan, atau yang belum terbukti | Status |
| --- | --- | --- | --- |
| Public, artikel, pencarian, edukasi | Route dan konten masuk build; validasi konten dijalankan pada mode dev. | Belum ada link checker, test pencarian, visual regression, atau a11y scan. | Layak demo |
| Personalisasi lokal | Store aktif, migrasi data, ekspor/reset, event same-tab, dan event `storage` lintas tab tersedia. | Validasi runtime belum seragam di semua repository; beberapa modul punya store/key sendiri. | Beta lokal |
| Auth/account | Login, recovery fragment, refresh bootstrap, profile guard, dan deteksi placeholder env tersedia. | Registrasi direct-session rusak; logout tidak mencabut refresh token server; aksi akun kurang busy/error state. | **Belum produksi** |
| Cloud education sync | Upsert progress dan deduplikasi saved item tersedia. | Pertanyaan tidak idempotent; CTA sync tidak reaktif; tidak ada download/round-trip merge ke store lokal. | **Belum produksi** |
| Editorial/admin | Route guard per role dan state transition SQL tersedia. | Belum ada test matriks otorisasi nyata; editor memakai REST langsung dan error loading dapat tampil seperti loading selamanya. | **Belum produksi** |
| Document Vault | Bucket privat, signed URL, filter file client, hash duplikat, metadata, tag, dan cleanup upload gagal tersedia. | Delete lintas Storage/Postgres tidak atomik; inspeksi isi file server belum ada; beberapa promise UI tidak ditangani. | **Belum produksi** |
| Companion | CRUD jadwal, gejala, obat, catatan berjalan lokal. | Tabel cloud tersedia tetapi UI tetap lokal; tidak ada strategi migrasi/sinkronisasi. | Beta lokal |
| Follow-up | CRUD lokal, reminder, checklist, visit, pertanyaan, dan sinkronisasi event appointment tersedia. | Repository cloud sama sekali tidak digunakan meski migrasi ada; reset/account lifecycle terpisah. | **Alpha lokal** |
| Care center/caregiver | Model UI dan tabel relasi/permission tersedia. | Undangan, penerimaan relasi, dan permission end-to-end belum terbukti; perlu negative RLS tests. | Prototype |
| Patient app `/apps/*` | Route dan feature suite terpisah dapat dibangun. | Store, tipe, CSS, dan lifecycle terpisah dari aplikasi utama; belum jelas eksperimen atau produk yang didukung. | Perlu keputusan produk |

## P0 — blocker kritis

### Tidak ada P0 yang terbukti dalam cakupan lokal

Build bersih dan inspeksi tidak menemukan bypass role yang jelas di frontend/SQL. Kesimpulan ini **bukan sertifikasi keamanan**. Policy RLS, Storage policy, Edge Function, JWT expiry, dan migrasi belum pernah dijalankan dalam proyek Supabase disposable pada repository ini. Sampai negative integration tests tersedia, keamanan backend tetap berstatus **belum terverifikasi**.

## P1 — harus selesai sebelum rilis terautentikasi

### P1.1 — registrasi direct-session tidak mengubah state autentikasi (**terbukti**)

`supabase.auth.signUp()` sudah menyimpan response yang memiliki `access_token`. Namun `RegisterPage` meneruskan response ke `sessionStoreCompat()`, dan fungsi tersebut sengaja tidak melakukan apa pun. `AuthProvider` tidak berlangganan perubahan session. Dampaknya ketika email confirmation dimatikan:

1. token ada di `localStorage`;
2. context tetap memiliki `session=null`;
3. layar selalu menyuruh pengguna memeriksa email;
4. route terproteksi tetap mengarahkan ke login hingga refresh penuh.

**Perbaikan:** expose `signUp`/`adoptSession` dari `AuthContext`, set session dan profile dari satu jalur, lalu arahkan direct-session ke onboarding/account. Tambahkan E2E untuk confirmation on dan off.

### P1.2 — follow-up cloud hanya skema mati; UI selalu lokal (**terbukti**)

Migrasi membuat lima tabel follow-up beserta RLS, tetapi `followUpRepository` hanya membaca/menulis `lentera.follow-up.v1` dan companion events di browser. Tidak ada pemilihan repository berdasarkan session, upload, download, merge, atau conflict strategy.

**Dampak:** pengguna login dapat mengira data akun ikut lintas perangkat; penghapusan akun cloud tidak menghapus salinan browser; backup/restore cloud tidak mencakup follow-up. Ini juga membuat permission caregiver pada migrasi tidak pernah dapat digunakan dari produk.

**Perbaikan:** pilih salah satu kontrak eksplisit: (a) labeli seluruh fitur “hanya perangkat ini” dan masukkan dalam reset/ekspor lokal, atau (b) implementasikan adapter local/cloud, migration prompt, conflict resolution, offline queue, dan deletion semantics.

## P2 — fungsi penting rusak atau belum lengkap

### P2.1 — sinkronisasi pertanyaan tidak idempotent (**terbukti**)

Progress dan saved item memakai upsert/conflict key, tetapi `consultation_questions` selalu di-`POST` sebagai row baru dan tabel tidak memiliki natural/unique key. Retry, klik dua kali, atau sync perangkat kedua menggandakan pertanyaan.

**Perbaikan:** gunakan ID stabil dari lokal atau unique hash `(user_id, normalized_question, category)`, lalu upsert. Tambahkan test retry dan concurrent sync.

### P2.2 — kartu penawaran sync tidak berubah setelah berhasil atau dilewati (**terbukti**)

`needsSync` membaca `localStorage` langsung saat render. `sync()` dan tombol “Lewati” mengubah key tanpa mengubah React state, sehingga kartu tetap terlihat sampai ada render lain/reload. Tombol sync dapat ditekan lagi dan memperparah duplikasi pertanyaan.

**Perbaikan:** jadikan status sync state/hook tervalidasi, tambahkan busy/disabled, dan render success/error yang berasal dari hasil persistence.

### P2.3 — operasi akun dapat menghasilkan unhandled rejection (**terbukti**)

Update profil, sync, dan ekspor tidak dibungkus error handling dan tidak memiliki busy state. Gangguan jaringan/RLS rejection dapat berhenti tanpa feedback yang dapat dipulihkan. Tombol juga bisa diklik berulang.

**Perbaikan:** satu pola async action (`idle/loading/success/error`), disable selama request, pesan error aman, retry, dan telemetry tanpa data kesehatan.

### P2.4 — penghapusan dokumen tidak atomik (**terbukti**)

UI menghapus object Storage lebih dahulu lalu row Postgres. Jika delete row gagal, metadata tersisa tetapi file hilang. Upload sudah melakukan compensating cleanup pada kegagalan metadata, tetapi cleanup itu sendiri juga dapat gagal dan menutupi error awal.

**Perbaikan:** pindahkan delete ke Edge Function/RPC terotorisasi yang idempotent, rekam cleanup job, dan perlakukan “object sudah tidak ada” sebagai sukses. Tambahkan test fault injection pada tiap langkah.

### P2.5 — validasi upload hanya mempercayai browser (**terbukti**)

Client memeriksa ukuran, MIME, dan ekstensi; bucket membatasi MIME/ukuran. Keduanya belum memeriksa magic bytes, file rusak, polyglot, atau malware. Header `Content-Type` dikendalikan client.

**Perbaikan:** quarantine upload, sniff signature server-side, scan malware, baru tandai metadata siap. Jangan preview file sebelum lolos pemeriksaan.

### P2.6 — logout hanya lokal dan tidak merevoke session server (**terbukti**)

`signOut()` hanya menghapus key browser dan tidak memanggil endpoint logout Supabase. Token/refresh token yang sudah tersalin tetap berlaku sampai expiry/revocation lain.

**Perbaikan:** panggil endpoint logout dengan access token, selalu bersihkan state lokal di `finally`, dan dokumentasikan perilaku logout offline/all-device.

## P3 — hardening engineering

1. **Tidak ada test runner.** `package.json` hanya menyediakan dev, build, preview, dan brand generation. Tambahkan Vitest + Testing Library dan coverage minimum untuk migrasi store, auth redirect, date boundaries, sync merge, editor state machine, serta filename/file validation.
2. **Tidak ada E2E.** Tambahkan Playwright untuk confirmation on/off, recovery expired/reused token, role guards, account deletion, offline mode, follow-up CRUD, upload/download/delete, dan cross-tab reset.
3. **Tidak ada lint/format/CI.** Banyak file besar berisi beberapa komponen dalam satu baris. Tambahkan ESLint, Prettier, `typecheck`, unit, E2E smoke, migration lint/test, dependency audit, dan secret scan sebagai gate.
4. **Tidak ada route error boundary.** Rejection render/lazy chunk atau data berbentuk salah dapat menjatuhkan tree tanpa recovery terarah.
5. **Runtime schema tidak konsisten.** `useLocalStorage` mendukung validator, tetapi repository follow-up hanya memastikan item adalah object lalu melakukan cast. Field/tanggal/status rusak dapat menyebar ke sorting dan rendering.
6. **Observability belum ada.** Analytics lokal tidak menggantikan crash/error reporting. Definisikan allow-list event yang tidak memuat diagnosis, nama file, catatan, pertanyaan, atau isi kesehatan.
7. **Migrasi belum idempotent secara konsisten.** Migrasi awal banyak memakai `create type/table/policy` tanpa `if not exists`; ini wajar untuk migration runner satu kali, tetapi restore parsial dan developer reset harus diuji.
8. **SQL follow-up perlu uji korelasi policy.** Policy memakai nama kolom luar yang tidak selalu dikualifikasi (`plan_id`, `user_id`, `id`). Walau dapat valid secara SQL, semantik caregiver harus dibuktikan dengan fixtures dua owner dan dua caregiver untuk mencegah cross-owner match.

## Polish — kualitas produk

1. **Bundle utama terlalu besar:** hasil build saat audit menghasilkan entry JS 568,17 kB minified (167,46 kB gzip), melewati warning Vite 500 kB. Companion, auth, editorial, dan admin masih eager-loaded; lazy-load per area dan pisahkan vendor chunk.
2. **CSS global besar:** CSS produksi 138,69 kB. Audit selector mati dan pisahkan CSS per route bila mengurangi render-blocking.
3. **Aksesibilitas:** audit manual dan otomatis untuk focus trap/restore pada dialog custom, `alertdialog`, menu mobile, iframe preview, toast announcement, target sentuh, contrast, serta reduced motion.
4. **Bahasa:** masih bercampur “Download”, “Delete”, “Add to Visit Pack”, “Submit for Review”, “Approve”, “Publish”, dan istilah Indonesia. Buat kamus copy/status terpusat.
5. **Navigasi SPA:** beberapa dashboard memakai `<a href>` internal dan penghapusan follow-up memakai `location.href`; gunakan `Link`/`navigate` agar state dan error boundary konsisten.
6. **Loading/empty/error:** beberapa `.then()` tidak punya `.catch()` dan beberapa error dialihkan sebagai empty state. Pisahkan “belum ada data”, “tidak punya akses”, “offline”, dan “server gagal”.
7. **Tanggal:** service reminder bergantung pada parsing tanggal lokal. Tetapkan kontrak tanggal kalender vs instant dan uji timezone, DST, akhir bulan, serta tanggal lampau.

## Temuan audit lama yang sudah ditutup

- Recovery password kini mengadopsi token dari fragment URL sebelum render dan membersihkan fragment dari address bar.
- Bootstrap auth kini memakai `try/finally`, fail-closed, dan menyelesaikan loading ketika refresh/profile gagal.
- Pembaca sync kini memakai key aktif `lentera_user_v1` melalui `USER_STORAGE_KEY` dan mempertahankan fallback legacy.
- Placeholder `.env.example` tidak lagi dianggap konfigurasi Supabase valid.
- `useLocalStorage` kini mendengar event lintas tab dan reset global.
- Follow-up kini membersihkan event companion ketika task/plan dihapus, memperbarui event saat task berubah, dan menyalin `nextFollowUpDate` visit ke plan.
- Upload dokumen kini melakukan compensating delete jika pembuatan metadata gagal.

## Urutan pengerjaan yang direkomendasikan

### Sprint 0 — bukti keamanan dan P1

1. Perbaiki direct-session registration.
2. Putuskan kontrak local-only vs cloud untuk companion/follow-up dan tampilkan label yang benar sekarang.
3. Siapkan Supabase disposable; jalankan seluruh migrasi dan seed dari nol.
4. Buat test matrix anon/owner/other-owner/caregiver/editor/reviewer/admin untuk setiap tabel, RPC, bucket, dan Edge Function.

### Sprint 1 — integritas data P2

1. Buat sync idempotent dan UI sync reaktif.
2. Satukan pola error/busy/retry operasi akun.
3. Implementasikan deletion workflow dokumen yang idempotent dan server-side file inspection.
4. Implementasikan logout server dengan cleanup lokal yang tetap andal saat offline.

### Sprint 2 — P3 release gate

1. Unit/component tests, Playwright smoke, migration tests, lint/format, dependency/secret scan.
2. Error boundary dan privacy-safe observability.
3. Runtime schema + versioned migration untuk seluruh key browser.
4. Backup/restore, retention, incident response, dan data deletion verification.

### Sprint 3 — polish

1. Route-level code splitting sampai tidak ada warning chunk.
2. WCAG 2.2 AA automated + keyboard/screen-reader manual pass.
3. Konsistensi copy Indonesia, status, feedback, dan state kosong/error.
4. Responsive/browser matrix dan visual regression.

## Gate “siap produksi” yang dapat diukur

- `npm ci`, typecheck, lint, unit, dan build hijau di CI.
- Migration up dari database kosong dan seluruh negative RLS matrix hijau.
- E2E auth untuk confirmation on/off, recovery, logout, dan delete account hijau.
- E2E Document Vault dengan fault injection upload/delete dan pemeriksaan file server hijau.
- Sync retry dua kali menghasilkan state identik tanpa duplikat.
- Reset/ekspor/penghapusan akun mencakup setiap store sesuai kontrak yang ditampilkan ke pengguna.
- Tidak ada error console pada smoke test route; tidak ada critical/high dependency advisory.
- Keyboard, focus, contrast, dan screen reader pass terdokumentasi; bundle budget diberlakukan.

## Pemeriksaan yang dilakukan dan batasannya

- Inventaris source, routes, hooks, services, localStorage keys, fetch, clipboard/share, migration, RLS policy, marker TODO, dan handler UI dengan `find`, `rg`, serta pembacaan sumber terarah.
- `npm run build` berhasil: 1.748 modul ditransformasi; warning chunk utama 568,17 kB tetap ada.
- `npm audit --omit=dev` **tidak dapat memberi hasil** karena registry menjawab HTTP 403; ini bukan bukti dependency aman maupun bukti ada vulnerability.
- Tidak ada script lint/test/E2E/migration test di `package.json`, sehingga area tersebut dinilai belum terverifikasi.
- Audit tidak memakai kredensial/proyek Supabase nyata dan tidak mengunggah data pasien.
