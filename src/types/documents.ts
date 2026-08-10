export const DOCUMENT_CATEGORIES = ['Patologi Anatomi','Laboratorium','Radiologi / Imaging','Surat Rujukan','Ringkasan Medis','Jadwal Terapi','Resep / Daftar Obat','Surat Kontrol','Discharge Summary','Hasil Konsultasi','Administrasi','Lainnya'] as const
export type DocumentCategory = typeof DOCUMENT_CATEGORIES[number]
export const JOURNEY_STAGES = ['diagnosis','biopsy','pathology','staging','treatment','monitoring','survivorship'] as const
export interface OncologyDocument { id:string; userId:string; title:string; category:DocumentCategory; documentDate?:string; journeyStage?:string; facility?:string; clinician?:string; storagePath:string; originalFilename:string; mimeType:string; fileSize:number; fileHash:string; tags:string[]; notes?:string; important:boolean; createdAt:string; updatedAt:string }
export type DocumentDraft = Pick<OncologyDocument,'title'|'category'|'documentDate'|'journeyStage'|'facility'|'clinician'|'tags'|'notes'>
export type DocumentFiltersState = { query:string; category:string; stage:string; fileType:string; tag:string; from:string; to:string; sort:'newest'|'oldest'|'uploaded'|'title' }
