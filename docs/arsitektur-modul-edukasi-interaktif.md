# Arsitektur Frontend Modul Edukasi Interaktif Berbasis Kartu (React)

## 1) Tujuan Modul
Modul edukasi menyajikan konten berbentuk kartu artikel agar pengguna dapat:
- menemukan konten berdasarkan kategori,
- menandai artikel penting (bookmark),
- melanjutkan bacaan terakhir dengan cepat,
- melihat progres baca per artikel dan per kategori,
- tetap mendapatkan data progres yang konsisten meski offline/online dan lintas tab.

## 2) Arsitektur Tingkat Tinggi
Gunakan arsitektur berbasis fitur (feature-first):

- `features/education/cards`: listing kartu, filter kategori, bookmark dari kartu.
- `features/education/reader`: halaman detail artikel, kalkulasi read-progress, event membaca.
- `features/education/progress`: ringkasan progres per kategori + progress bar.
- `features/education/continue-reading`: panel “lanjutkan membaca”.
- `features/education/state`: state global + sinkronisasi local storage.
- `features/education/analytics`: adapter pelacakan event.

Lapisan data:
1. **UI Components**: komponen presentasional kartu/progress/panel.
2. **Hooks/UseCases**: logika bookmark, progress, continue reading.
3. **Store**: state terpusat (Context + reducer / Zustand / Redux Toolkit).
4. **Persistence**: localStorage + metadata version + timestamp.
5. **Sync Engine**: konsolidasi data antar-tab dan saat startup.
6. **Analytics Adapter**: abstraction agar mudah ganti provider (GA4, Mixpanel, PostHog).

## 3) Contoh Tipe Data (TypeScript)
```ts
export type CategoryId = string;
export type ArticleId = string;

export interface EducationCategory {
  id: CategoryId;
  name: string;
  description?: string;
  order: number;
}

export interface EducationArticle {
  id: ArticleId;
  categoryId: CategoryId;
  title: string;
  summary: string;
  coverImage?: string;
  estimatedReadMinutes: number;
  contentVersion: number; // naik saat isi artikel berubah signifikan
  publishedAt: string;
  updatedAt: string;
}

export interface ArticleProgress {
  articleId: ArticleId;
  percent: number; // 0 - 100
  lastReadAt: string; // ISO timestamp
  scrollY: number; // posisi scroll terakhir
  contentVersion: number; // untuk deteksi stale progress
  completed: boolean;
}

export interface CategoryProgress {
  categoryId: CategoryId;
  totalArticles: number;
  completedArticles: number;
  percent: number;
}

export interface BookmarkItem {
  articleId: ArticleId;
  createdAt: string;
  source: "card" | "reader";
}

export interface ContinueReadingItem {
  articleId: ArticleId;
  categoryId: CategoryId;
  lastReadAt: string;
  percent: number;
}

export interface EducationState {
  bookmarks: Record<ArticleId, BookmarkItem>;
  articleProgress: Record<ArticleId, ArticleProgress>;
  continueReading: ContinueReadingItem[];
  schemaVersion: number;
  updatedAt: string;
  deviceId: string;
}
```

## 4) Struktur Komponen UI yang Direkomendasikan
### A. Daftar Kartu Edukasi
- `<EducationCardGrid />`
  - render list kategori dan artikel.
- `<EducationCard />`
  - menampilkan judul, ringkasan, read-time, badge progres (%), tombol bookmark.
- `<BookmarkButton />`
  - stateful, optimistic update, toast feedback.

### B. Reader Artikel
- `<ArticleReaderPage />`
  - memuat konten artikel, update progres saat scroll.
- `<ReadingProgressBar />`
  - sticky top progress untuk artikel aktif.
- `<ReaderActions />`
  - bookmark toggle, share (opsional), mark as complete.

### C. Progress Kategori
- `<CategoryProgressSection />`
  - menampilkan seluruh kategori beserta progres.
- `<CategoryProgressBar />`
  - progress bar per kategori (completed/total).
- `<CategoryProgressStat />`
  - teks “3/7 artikel selesai”.

### D. Panel Lanjutkan Membaca
- `<ContinueReadingPanel />`
  - daftar artikel terakhir dibaca, urut `lastReadAt desc`.
- `<ContinueReadingCard />`
  - judul, kategori, persen progres, CTA “Lanjutkan”.

## 5) Alur State & Data
### Bookmark
1. User klik bookmark pada card/reader.
2. Dispatch `BOOKMARK_TOGGLED`.
3. Update store lokal (optimistic).
4. Persist ke localStorage (debounced 300-500ms).
5. Kirim analytics event.

### Read Progress per Artikel
1. Reader memonitor scroll dengan throttle (mis. 500ms).
2. Hitung persen baca dari viewport terhadap tinggi konten.
3. Dispatch `ARTICLE_PROGRESS_UPDATED` bila delta > 1%.
4. Jika `percent >= 95%`, set `completed = true`.
5. Recompute progress kategori + continue reading.

### Progress Bar per Kategori
- Derived state dari `articleProgress` + metadata artikel per kategori.
- Rumus:
  - `completedArticles = jumlah article.completed === true`
  - `percent = Math.round((completedArticles / totalArticles) * 100)`

### Continue Reading Panel
- Ambil artikel dengan `percent > 0 && percent < 100`.
- Urutkan `lastReadAt` terbaru.
- Batasi 3-5 item untuk panel ringkas.

## 6) Event Analytics yang Perlu Dilacak
Gunakan format event konsisten: `education_<action>`.

### Event utama
1. `education_card_impression`
   - saat card tampil di viewport.
   - props: `article_id`, `category_id`, `position`, `list_context`.
2. `education_card_click`
   - saat card dibuka.
   - props: `article_id`, `category_id`, `position`, `from_panel`.
3. `education_bookmark_toggle`
   - saat bookmark on/off.
   - props: `article_id`, `category_id`, `bookmarked`, `source`.
4. `education_read_progress`
   - interval milestone (10%, 25%, 50%, 75%, 100%).
   - props: `article_id`, `category_id`, `milestone_percent`, `read_time_sec`.
5. `education_article_complete`
   - saat artikel selesai.
   - props: `article_id`, `category_id`, `duration_sec`, `revisit_count`.
6. `education_continue_reading_click`
   - klik item di panel lanjutkan membaca.
   - props: `article_id`, `category_id`, `percent`, `index`.
7. `education_category_progress_view`
   - saat section progres kategori dilihat.
   - props: `category_count`, `avg_progress_percent`.

### Prinsip kualitas analytics
- Sertakan `session_id`, `device_id`, `user_id` (jika login), `content_version`.
- Hindari event spam: throttle + milestone-based emission.
- Definisikan event contract di satu file (`analytics/events.ts`).

## 7) Strategi Sinkronisasi Local Storage agar Konsisten
### A. Kunci Storage & Versioning
Simpan 1 object state tunggal:
- key: `education_state_v1`
- field penting: `schemaVersion`, `updatedAt`, `deviceId`

Jika schema berubah, lakukan migrasi terstruktur:
- `migrateV1toV2(state)` dan set `schemaVersion` baru.

### B. Mekanisme Write
- Gunakan debounce untuk mencegah write berlebih.
- Tulis atomik: serialize seluruh state feature sekaligus.
- Simpan `updatedAt = nowISO()` setiap commit state.

### C. Mekanisme Read saat Startup
1. Load dari localStorage.
2. Validasi schema dan shape data (zod/io-ts/superstruct).
3. Jalankan migrasi jika perlu.
4. Jika invalid/corrupt, fallback ke state default + catat error analytics.

### D. Sinkronisasi Antar Tab
- Dengarkan event `window.storage`.
- Saat key `education_state_v1` berubah:
  - parse state incoming,
  - bandingkan `updatedAt`,
  - terapkan strategi **Last Write Wins** berbasis timestamp.

Tambahan agar lebih aman:
- Untuk entity granular (bookmark/progress), bisa bandingkan `lastReadAt` atau `createdAt` per item sebelum overwrite.

### E. Konflik dengan Data Server (jika login)
Gunakan pola **local-first + background sync**:
1. Render dari local state untuk UX cepat.
2. Fetch snapshot server.
3. Merge per entitas:
   - Bookmark: union by `articleId`, pilih `createdAt` terbaru.
   - Progress: pilih record dengan `percent` lebih tinggi; jika sama pilih `lastReadAt` terbaru.
4. Simpan hasil merge ke local + kirim patch ke server.

### F. Ketahanan & Observability
- Batasi ukuran payload localStorage.
- Simpan maksimal riwayat continue reading (mis. 20 item).
- Tambahkan diagnostic flag (mis. `lastSyncStatus`) untuk debugging.

## 8) Rekomendasi Implementasi Hook
- `useEducationStore()` -> selector state + dispatch action.
- `useBookmark(articleId)` -> toggle, isBookmarked.
- `useReadingProgress(articleId, contentVersion)` -> observe scroll, update milestone.
- `useCategoryProgress()` -> compute derived progress per kategori.
- `useContinueReading()` -> list item panel.
- `useEducationSync()` -> load/migrate/persist/storage-event listener.
- `useEducationAnalytics()` -> helper track event + enrichment payload global.

## 9) Definisi Done (DoD) Minimum
- Bookmark tersimpan dan survive reload.
- Progress artikel akurat setelah scroll + reopen halaman.
- Progress kategori otomatis ter-update saat artikel selesai.
- Panel “lanjutkan membaca” menampilkan urutan terbaru dengan benar.
- Sinkronisasi antar tab konsisten tanpa kehilangan data.
- Event analytics utama terkirim dengan properti wajib.
