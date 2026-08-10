import type { ArticleBlock, MedicalArticle, MedicalReference } from '@/types/content'

export const blocks = (takeaways: string[], section: string, paragraphs: string[], warning?: string): ArticleBlock[] => [
  { id:'takeaways', type:'key_takeaway', items:takeaways.slice(0,5) },
  { id:'understanding', type:'heading', level:2, text:section },
  ...paragraphs.map((text,index): ArticleBlock => ({ id:`p-${index+1}`, type:'paragraph', text })),
  ...(warning ? [{ id:'warning', type:'medical_warning' as const, text:warning }] : []),
  { id:'evidence', type:'evidence_note', text:'Artikel ini merangkum informasi dari sumber kesehatan tepercaya yang tercantum pada bagian referensi.' },
  { id:'references', type:'references' },
  { id:'disclaimer', type:'disclaimer', text:'Informasi ini bersifat edukatif dan tidak menggantikan diagnosis, pemeriksaan, atau rencana terapi dari tenaga kesehatan yang merawat Anda.' },
]

type ArticleInput = Omit<MedicalArticle,'createdAt'|'updatedAt'|'revisionHistory'|'seo'|'authorId'|'featured'> & { featured?: boolean }
export const article = (input: ArticleInput): MedicalArticle => ({
  ...input, featured: input.featured ?? false, authorId:'editorial-team', createdAt:'2026-01-15', updatedAt:'2026-07-20',
  revisionHistory:[{ version:1, date:'2026-01-15', summary:'Publikasi awal konten edukasi terstruktur.', editor:'Tim Editorial Lentera' },{ version:1.1, date:'2026-07-20', summary:'Bahasa keselamatan dan referensi diperbarui.', editor:'Tim Editorial Lentera' }],
  seo:{ title:`${input.title} | Lentera`, description:input.excerpt, canonicalSlug:`/articles/${input.slug}`, medicalWebPage:true },
})

export const common = (reference: MedicalReference) => ({ references:[reference], lastReviewedAt:'2026-07-20', nextReviewAt:'2027-01-20', publishedAt:'2026-01-15' })
