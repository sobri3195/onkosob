# Arsitektur Frontend Modul Edukasi Interaktif Berbasis Kartu (React)

## 1) Tujuan & prinsip arsitektur
- **Cepat dibuka**: daftar kartu dan progress kategori harus bisa tampil dari cache lokal terlebih dahulu.
- **Konsisten antar sesi**: bookmark dan read-progress disimpan lokal lalu disinkronkan ke server.
- **Event-driven**: semua interaksi penting mengirim event analytics dengan skema konsisten.
- **Composable UI**: komponen kecil, reusable, dan mudah dites.

---

## 2) Arsitektur layer

```txt
[Page/Route]
  └─ [Feature Components]
      └─ [Hooks + State Store]
          ├─ [Local Cache Adapter (localStorage)]
          ├─ [Sync Queue + Conflict Resolver]
          └─ [API Client]

[Analytics Tracker] <- dipanggil dari hooks/event handlers
```

### Rekomendasi stack
- **React + TypeScript**
- **TanStack Query** untuk data fetching + cache server state
- **Zustand / Redux Toolkit** untuk UI state lokal (panel lanjutkan, filter, sorting)
- **localStorage adapter** versi skema (schema versioning)

---

## 3) Domain model & tipe data (contoh)

```ts
export type CategoryId = string;
export type ArticleId = string;

export interface EducationCategory {
  id: CategoryId;
  name: string;
  description?: string;
  totalArticles: number;
  completedArticles: number; // derived, bisa dihitung dari progress map
}

export interface EducationArticle {
  id: ArticleId;
  categoryId: CategoryId;
  title: string;
  summary: string;
  coverImage?: string;
  estimatedReadMinutes: number;
  updatedAt: string; // ISO
}

export interface Bookmark {
  articleId: ArticleId;
  createdAt: string; // ISO
  source: "card" | "reader";
}

export interface ArticleReadProgress {
  articleId: ArticleId;
  progressPct: number; // 0..100
  scrollY: number;     // opsional untuk resume posisi
  lastReadAt: string;  // ISO
  completedAt?: string;
}

export interface ContinueReadingItem {
  articleId: ArticleId;
  categoryId: CategoryId;
  title: string;
  progressPct: number;
  lastReadAt: string;
}

export interface EducationLocalState {
  schemaVersion: 1;
  bookmarks: Record<ArticleId, Bookmark>;
  progressByArticle: Record<ArticleId, ArticleReadProgress>;
  lastSyncedAt?: string;
  pendingOps: SyncOperation[];
}

export type SyncOperation =
  | { id: string; op: "BOOKMARK_ADD"; articleId: ArticleId; ts: string }
  | { id: string; op: "BOOKMARK_REMOVE"; articleId: ArticleId; ts: string }
  | { id: string; op: "PROGRESS_SET"; articleId: ArticleId; progressPct: number; scrollY: number; ts: string };
```

---

## 4) Struktur komponen UI

## A. Halaman utama modul edukasi
1. **`EducationHubPage`**
   - container utama.
   - memuat kategori, kartu artikel, dan panel lanjutkan membaca.
2. **`CategoryProgressBar`**
   - menampilkan progress per kategori.
   - formula: `completedArticles / totalArticles * 100`.
3. **`ArticleCardGrid`**
   - daftar kartu artikel.
4. **`ArticleCard`**
   - menampilkan judul, ringkasan, estimasi baca, progress mini, bookmark toggle.
5. **`ContinueReadingPanel`**
   - urut berdasarkan `lastReadAt` desc.
   - maksimal 3–5 item agar fokus.

## B. Halaman pembaca artikel
6. **`ArticleReaderPage`**
   - konten artikel.
   - membaca progress (scroll/depth/time) dan menyimpan berkala.
7. **`ReaderProgressIndicator`**
   - progress bar baca artikel saat scroll.
8. **`BookmarkButton`**
   - reusable (dipakai di card dan reader).

## C. Hooks (feature-specific)
- `useEducationData()` -> fetch kategori + artikel.
- `useBookmarkActions()` -> toggle bookmark + enqueue sync op.
- `useArticleProgress(articleId)` -> hitung & persist progress.
- `useContinueReading()` -> derive list dari progress map.
- `useCategoryProgress()` -> derive progress per kategori.
- `useSyncEducationState()` -> flush pending operations.

---

## 5) State management: pembagian tanggung jawab

### Server state (TanStack Query)
- `categories`
- `articles`
- `serverBookmarks` (opsional jika server simpan)
- `serverProgress` (opsional)

### Client state (Zustand/Redux)
- status panel UI: open/close, filter, sort
- cache hasil derivasi cepat
- local mutation status (optimistic state)

### Persistent local state (localStorage)
- `bookmarks`
- `progressByArticle`
- `pendingOps`
- `lastSyncedAt`

---

## 6) Analytics events yang wajib dilacak

Gunakan format event konsisten, misalnya:
`event_name`, `user_id`, `article_id`, `category_id`, `screen`, `ts`, `properties`.

1. `education_card_impression`
   - trigger: kartu tampil di viewport (intersection observer).
   - properti: `article_id`, `position`, `category_id`.

2. `education_card_click`
   - trigger: user klik kartu.
   - properti: `article_id`, `category_id`, `from_section`.

3. `education_bookmark_toggled`
   - trigger: bookmark on/off.
   - properti: `article_id`, `new_state`, `source`.

4. `education_article_read_started`
   - trigger: reader terbuka > N detik (mis. 3 detik).
   - properti: `article_id`, `category_id`.

5. `education_article_read_progress`
   - trigger: milestone 25/50/75/100.
   - properti: `article_id`, `progress_pct`, `time_spent_sec`.

6. `education_article_completed`
   - trigger: progress mencapai 100%.
   - properti: `article_id`, `total_time_spent_sec`.

7. `education_continue_reading_click`
   - trigger: klik item di panel lanjutkan membaca.
   - properti: `article_id`, `progress_pct`.

8. `education_category_progress_viewed`
   - trigger: section progress kategori terlihat.
   - properti: `category_id`, `progress_pct`.

---

## 7) Strategi sinkronisasi localStorage yang konsisten

## A. Pola utama: **Optimistic update + durable queue**
1. Saat user bookmark/progress:
   - update state lokal dulu (respons cepat).
   - simpan operation ke `pendingOps`.
2. Worker sinkronisasi mengirim `pendingOps` ke API secara batch.
3. Jika sukses:
   - hapus operasi dari queue.
   - update `lastSyncedAt`.
4. Jika gagal:
   - retry dengan exponential backoff.

## B. Aturan conflict resolution
- Gunakan `lastWriteWins` berbasis `ts` untuk event sama pada artikel sama.
- Untuk progress: pilih nilai dengan `ts` terbaru, tetapi **jangan turunkan progress** kecuali reset eksplisit.
  - contoh: lokal 80%, server 60% -> simpan 80%.
  - lokal 40%, server 70% -> gunakan 70%.

## C. Multi-tab consistency
- Dengarkan event `window.storage`.
- Jika tab lain mengubah key edukasi:
  - merge state in-memory.
  - refresh derived selectors (`continueReading`, `categoryProgress`).

## D. Schema versioning & migration
- Simpan key: `education_state_v1`.
- Jika versi berubah:
  - jalankan migrasi (`v1 -> v2`) saat bootstrap.
  - jika gagal migrasi, fallback aman: backup + reset terkontrol.

## E. Flush trigger
- `onAppStart`
- `onNetworkReconnect`
- `onVisibilityChange(visible)`
- interval ringan (mis. 30–60 detik)

---

## 8) Kontrak API minimal (saran)
- `GET /education/articles`
- `GET /education/categories`
- `POST /education/bookmarks:batchUpsert`
- `POST /education/progress:batchUpsert`
- `GET /education/me/state` (opsional bootstrap sinkron server)

Payload upsert idealnya membawa:
- `client_op_id` (idempotency)
- `client_ts`
- `article_id`
- `value`

---

## 9) Alur data ringkas (end-to-end)
1. App load -> hydrate local state dari `localStorage`.
2. Render cepat kartu + panel lanjutkan membaca dari local cache.
3. Fetch data server (artikel/kategori) -> reconcile.
4. User interaksi (bookmark/progress) -> optimistic update + enqueue op.
5. Background sync kirim batch -> ack -> queue dibersihkan.
6. Analytics event dikirim non-blocking.

---

## 10) Checklist implementasi
- [ ] Bookmark toggle tersedia di `ArticleCard` dan `ArticleReaderPage`.
- [ ] Read-progress per artikel tersimpan dan dipulihkan saat reopen.
- [ ] Progress bar per kategori update real-time dari progress artikel.
- [ ] Panel “Lanjutkan Membaca” tersusun berdasarkan aktivitas terakhir.
- [ ] Sync queue tahan offline dan aman terhadap duplicate submit.
- [ ] Event analytics terpasang untuk impression, click, bookmark, progress milestone.

