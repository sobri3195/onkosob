# Konsep Dynamic Form Layanan Kesehatan (React Hook Form + Zod)

Dokumen ini merangkum rancangan **form cerdas adaptif** untuk kebutuhan layanan kesehatan (misalnya pengaduan, konsultasi awal, atau permintaan jadwal). Fokus utamanya adalah:

- field kondisional,
- validasi inline dengan bahasa Indonesia yang mudah dipahami,
- autosave draft,
- halaman review sebelum submit,
- pola komponen reusable lintas halaman.

---

## 1) Arsitektur Singkat

### Tujuan desain
1. **Skema terpusat**: aturan validasi dan pesan error ada di schema.
2. **Konfigurasi field declarative**: UI dibangun dari metadata field, bukan hardcode per halaman.
3. **Visibility engine**: field tampil/sembunyi berdasarkan jawaban pengguna.
4. **Autosave aman**: draft disimpan lokal, mudah dipulihkan.
5. **Review step**: pengguna mengecek semua jawaban sebelum kirim.

### Stack yang disarankan
- `react-hook-form`
- `zod`
- `@hookform/resolvers/zod`
- `useWatch` dari RHF untuk evaluasi visibility
- Local storage (atau IndexedDB jika data lebih besar)

---

## 2) Contoh Schema (Zod)

Contoh di bawah memodelkan form **Permintaan Layanan Pasien**.

```ts
import { z } from "zod";

const tanggalLahirSchema = z
  .string()
  .min(1, "Tanggal lahir wajib diisi")
  .refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Format tanggal lahir belum sesuai",
  });

export const layananFormSchema = z
  .object({
    namaLengkap: z
      .string()
      .min(3, "Nama lengkap minimal 3 karakter")
      .max(120, "Nama lengkap terlalu panjang"),

    noHp: z
      .string()
      .regex(/^08\d{8,11}$/, "Nomor HP harus diawali 08 dan terdiri dari 10-13 digit"),

    tanggalLahir: tanggalLahirSchema,

    jenisLayanan: z.enum(["konsultasi", "kontrol", "pengaduan"], {
      errorMap: () => ({ message: "Silakan pilih jenis layanan" }),
    }),

    punyaRujukan: z.enum(["ya", "tidak"], {
      errorMap: () => ({ message: "Silakan pilih status rujukan" }),
    }),

    nomorRujukan: z.string().optional(),

    keluhanUtama: z
      .string()
      .min(10, "Keluhan utama minimal 10 karakter agar tim medis lebih mudah memahami kondisi Anda")
      .max(1000, "Keluhan utama maksimal 1000 karakter"),

    tingkatNyeri: z.coerce.number().min(0, "Nilai nyeri minimal 0").max(10, "Nilai nyeri maksimal 10").optional(),

    butuhPendamping: z.enum(["ya", "tidak"], {
      errorMap: () => ({ message: "Silakan pilih kebutuhan pendamping" }),
    }),

    namaPendamping: z.string().optional(),

    persetujuanData: z.literal(true, {
      errorMap: () => ({ message: "Anda perlu menyetujui penggunaan data untuk melanjutkan" }),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.punyaRujukan === "ya" && !data.nomorRujukan?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["nomorRujukan"],
        message: "Nomor rujukan wajib diisi jika Anda memiliki rujukan",
      });
    }

    if (data.butuhPendamping === "ya" && !data.namaPendamping?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["namaPendamping"],
        message: "Nama pendamping wajib diisi",
      });
    }
  });

export type LayananFormValues = z.infer<typeof layananFormSchema>;
```

### Catatan UX copy validasi (Bahasa Indonesia)
- Hindari jargon seperti “invalid input type”.
- Gunakan kalimat aksi: **“Silakan isi …”**, **“Minimal … karakter”**.
- Jelaskan konteks dampak jika perlu: _“agar tim medis lebih mudah memahami kondisi Anda”_.

---

## 3) Aturan Visibility (Field Kondisional)

Agar reusable lintas halaman, pisahkan aturan tampil/sembunyi dalam metadata:

```ts
type VisibilityRule = {
  dependsOn: string;
  operator: "equals" | "notEquals" | "in";
  value: string | number | Array<string | number>;
};

type FieldConfig = {
  name: keyof LayananFormValues;
  label: string;
  type: "text" | "textarea" | "radio" | "number" | "checkbox" | "date";
  placeholder?: string;
  options?: Array<{ label: string; value: string }>;
  visibility?: VisibilityRule[];
};

export const layananFieldConfig: FieldConfig[] = [
  { name: "namaLengkap", label: "Nama Lengkap", type: "text" },
  { name: "noHp", label: "Nomor HP", type: "text", placeholder: "08xxxxxxxxxx" },
  { name: "tanggalLahir", label: "Tanggal Lahir", type: "date" },
  {
    name: "jenisLayanan",
    label: "Jenis Layanan",
    type: "radio",
    options: [
      { label: "Konsultasi", value: "konsultasi" },
      { label: "Kontrol", value: "kontrol" },
      { label: "Pengaduan", value: "pengaduan" },
    ],
  },
  {
    name: "punyaRujukan",
    label: "Apakah Anda memiliki surat rujukan?",
    type: "radio",
    options: [
      { label: "Ya", value: "ya" },
      { label: "Tidak", value: "tidak" },
    ],
  },
  {
    name: "nomorRujukan",
    label: "Nomor Rujukan",
    type: "text",
    visibility: [{ dependsOn: "punyaRujukan", operator: "equals", value: "ya" }],
  },
  {
    name: "namaPendamping",
    label: "Nama Pendamping",
    type: "text",
    visibility: [{ dependsOn: "butuhPendamping", operator: "equals", value: "ya" }],
  },
];
```

Contoh evaluator sederhana:

```ts
export function isFieldVisible(
  rules: VisibilityRule[] | undefined,
  values: Record<string, unknown>,
): boolean {
  if (!rules?.length) return true;

  return rules.every((rule) => {
    const current = values[rule.dependsOn];

    if (rule.operator === "equals") return current === rule.value;
    if (rule.operator === "notEquals") return current !== rule.value;
    if (rule.operator === "in" && Array.isArray(rule.value)) {
      return rule.value.includes(current as string | number);
    }
    return true;
  });
}
```

---

## 4) Pola Komponen Reusable

### Struktur komponen yang direkomendasikan

```txt
src/components/forms/
  DynamicForm/
    DynamicFormProvider.tsx
    DynamicFieldRenderer.tsx
    fields/
      TextField.tsx
      TextAreaField.tsx
      RadioGroupField.tsx
      DateField.tsx
      CheckboxField.tsx
    FormSection.tsx
    InlineError.tsx
    ReviewPanel.tsx
    DraftStatus.tsx
```

### Pola implementasi
1. **`DynamicFormProvider`**
   - Inisialisasi RHF + resolver schema.
   - Menyediakan context untuk autosave, metadata field, dan status submit.

2. **`DynamicFieldRenderer`**
   - Loop `fieldConfig`.
   - Cek `isFieldVisible(...)` menggunakan hasil `useWatch`.
   - Render komponen field berdasarkan `type`.

3. **Komponen field atomik (`TextField`, `RadioGroupField`, dst.)**
   - Satu tanggung jawab: input + label + helper text + inline error.
   - Tidak tahu business flow per halaman.

4. **`InlineError`**
   - Menstandarkan tampilan pesan validasi.
   - Mendukung `aria-live="polite"` agar aksesibel.

5. **`ReviewPanel`**
   - Menampilkan ringkasan data yang sudah diformat.
   - Menyembunyikan field yang tidak relevan (misalnya field kondisional yang tidak aktif).

---

## 5) Autosave Draft

### Strategi
- Simpan nilai form ke local storage setiap 500–1000 ms (debounce).
- Gunakan key yang konsisten, misalnya:
  - `onkosob:draft:layanan:v1`
- Simpan metadata:
  - `updatedAt`
  - `schemaVersion`
- Saat load:
  - jika versi schema beda, lakukan migrasi sederhana atau reset aman.

Contoh hook:

```ts
import { useEffect } from "react";
import { useWatch, UseFormReturn } from "react-hook-form";

const DRAFT_KEY = "onkosob:draft:layanan:v1";

export function useAutosaveDraft(form: UseFormReturn<LayananFormValues>) {
  const values = useWatch({ control: form.control });

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          schemaVersion: 1,
          updatedAt: new Date().toISOString(),
          values,
        }),
      );
    }, 700);

    return () => clearTimeout(timer);
  }, [values]);

  const restoreDraft = () => {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      form.reset(parsed.values);
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  };

  const clearDraft = () => localStorage.removeItem(DRAFT_KEY);

  return { restoreDraft, clearDraft };
}
```

### UX yang disarankan
- Tampilkan indikator kecil: **“Draft tersimpan otomatis 10:32”**.
- Setelah submit sukses, hapus draft + tampilkan toast sukses.
- Beri opsi **“Lanjutkan draft sebelumnya”** saat halaman dibuka.

---

## 6) Review Page Sebelum Submit

### Flow multi-step yang sederhana
1. **Step 1**: Data dasar pasien.
2. **Step 2**: Detail layanan + keluhan.
3. **Step 3 (Review)**: Ringkasan jawaban + konfirmasi persetujuan.

### Komponen Review
- Tampilkan pasangan `Label: Nilai` dengan format mudah dibaca.
- Tandai jawaban kosong untuk field opsional sebagai “-”.
- Sediakan tombol **“Ubah”** per section agar user langsung kembali ke langkah terkait.

Contoh mapping review:

```ts
const reviewItems = [
  { label: "Nama Lengkap", value: values.namaLengkap },
  { label: "Nomor HP", value: values.noHp },
  { label: "Jenis Layanan", value: mapJenisLayanan(values.jenisLayanan) },
  ...(values.punyaRujukan === "ya"
    ? [{ label: "Nomor Rujukan", value: values.nomorRujukan }]
    : []),
];
```

---

## 7) Reuse Lintas Halaman

Agar tidak duplikasi saat dipakai di banyak form (pengaduan, konsultasi, pendaftaran):

1. Buat **`createFormDefinition()`** berisi:
   - schema,
   - field config,
   - section config,
   - transform untuk review,
   - default values.

2. Setiap halaman cukup memanggil definition berbeda:

```ts
const pengaduanDefinition = createFormDefinition({...});
const konsultasiDefinition = createFormDefinition({...});
```

3. Gunakan renderer yang sama:

```tsx
<DynamicFormProvider definition={pengaduanDefinition} onSubmit={handleSubmitPengaduan} />
```

4. Standarkan token UI untuk konsistensi:
- warna error,
- jarak antar field,
- gaya helper text,
- gaya status draft,
- gaya panel review.

---

## 8) Checklist Implementasi

- [ ] Semua pesan validasi menggunakan bahasa Indonesia yang jelas.
- [ ] Field kondisional teruji (muncul/hilang sesuai aturan).
- [ ] Autosave tidak menimpa data final setelah submit sukses.
- [ ] Review page menyembunyikan field yang tidak relevan.
- [ ] Komponen field dapat dipakai ulang minimal di 2 halaman berbeda.
- [ ] Aksesibilitas dasar terpenuhi (`label`, `aria-invalid`, `aria-live`, keyboard navigation).

---

## 9) Alternatif Jika Tidak Pakai Zod

Jika tim memilih alternatif selain Zod:
- **Yup** + `@hookform/resolvers/yup`
- **Valibot** (lebih ringan, performa baik)

Prinsip arsitekturnya tetap sama:
- schema terpusat,
- field metadata declarative,
- visibility engine,
- autosave hook,
- review step.

Dengan pendekatan ini, tim bisa memulai dari satu form prioritas lalu scale ke form lain tanpa rewrite besar.
