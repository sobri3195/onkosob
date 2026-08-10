import { ARTICLE_STATUSES, type MedicalArticle, type ValidationIssue, type ValidationResult } from '@/types/content'

const issue = (code:string,message:string,severity:'error'|'warning'):ValidationIssue => ({code,message,severity})
export function validateArticle(article: MedicalArticle, allArticles: MedicalArticle[] = [article]): ValidationResult {
  const errors:ValidationIssue[]=[]; const warnings:ValidationIssue[]=[]
  if(!article.id) errors.push(issue('missing_id','ID artikel wajib diisi.','error'))
  if(!article.slug) errors.push(issue('missing_slug','Slug artikel wajib diisi.','error'))
  if(!article.title) errors.push(issue('missing_title','Judul artikel wajib diisi.','error'))
  if(!ARTICLE_STATUSES.includes(article.status)) errors.push(issue('invalid_status','Status editorial tidak valid.','error'))
  if(article.slug && allArticles.filter(item=>item.slug===article.slug).length>1) errors.push(issue('duplicate_slug',`Slug “${article.slug}” digunakan lebih dari sekali.`,'error'))
  if(!article.excerpt) warnings.push(issue('missing_excerpt','Ringkasan belum tersedia.','warning'))
  if(!article.references.length) warnings.push(issue('missing_references','Referensi belum tersedia.','warning'))
  if(!article.medicalReviewerId) warnings.push(issue('missing_reviewer','Reviewer medis belum ditetapkan.','warning'))
  if(!article.lastReviewedAt) warnings.push(issue('missing_review_date','Tanggal tinjauan medis belum tersedia.','warning'))
  if(!article.seo.title) warnings.push(issue('missing_seo_title','Judul SEO belum tersedia.','warning'))
  if(!article.seo.description) warnings.push(issue('missing_seo_description','Deskripsi SEO belum tersedia.','warning'))
  if(!article.relatedArticleIds.length) warnings.push(issue('missing_related','Artikel terkait belum ditetapkan.','warning'))
  if(!article.categoryId) warnings.push(issue('missing_category','Kategori belum ditetapkan.','warning'))
  if(article.title.length>70) warnings.push(issue('long_title','Judul lebih dari 70 karakter.','warning'))
  if(!article.body.length) warnings.push(issue('empty_body','Isi artikel kosong.','warning'))
  if(article.nextReviewAt && new Date(article.nextReviewAt).getTime()<Date.now()) warnings.push(issue('overdue_review','Tinjauan artikel telah melewati jadwal.','warning'))
  return {errors,warnings}
}
export const validateContent = (articles:MedicalArticle[]) => articles.map(article=>({article,result:validateArticle(article,articles)}))
export const isReviewOverdue = (article:MedicalArticle, today=new Date()) => !!article.nextReviewAt && new Date(`${article.nextReviewAt}T23:59:59`).getTime()<today.getTime()
