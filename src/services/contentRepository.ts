import { medicalArticles } from '@/content/articles'
import { rankArticles } from '@/utils/contentSearch'
import type { MedicalArticle } from '@/types/content'

export interface ContentRepository {
  getArticles(options?:{ includeUnpublished?:boolean }):Promise<MedicalArticle[]>
  getArticleBySlug(slug:string, options?:{ includeUnpublished?:boolean }):Promise<MedicalArticle|null>
  getArticleById(id:string):Promise<MedicalArticle|null>
  getFeaturedArticles():Promise<MedicalArticle[]>
  searchArticles(query:string):Promise<MedicalArticle[]>
  getRelatedArticles(article:MedicalArticle):Promise<MedicalArticle[]>
}
const publicArticle = (article:MedicalArticle) => article.status==='published' || article.status==='archived'
class LocalContentRepository implements ContentRepository {
  async getArticles(options:{includeUnpublished?:boolean}={}) { return medicalArticles.filter(article=>options.includeUnpublished || publicArticle(article)) }
  async getArticleBySlug(slug:string,options:{includeUnpublished?:boolean}={}) { return medicalArticles.find(article=>article.slug===slug && (options.includeUnpublished || publicArticle(article))) ?? null }
  async getArticleById(id:string) { return medicalArticles.find(article=>article.id===id) ?? null }
  async getFeaturedArticles() { return medicalArticles.filter(article=>article.status==='published' && article.featured).slice(0,4) }
  async searchArticles(query:string) { return rankArticles(medicalArticles.filter(article=>article.status==='published'),query) }
  async getRelatedArticles(article:MedicalArticle) { return article.relatedArticleIds.map(id=>medicalArticles.find(item=>item.id===id)).filter((item):item is MedicalArticle=>!!item && publicArticle(item)) }
}
export const contentRepository:ContentRepository = new LocalContentRepository()
export const publishedArticleSlugs = medicalArticles.filter(article=>article.status==='published').map(article=>article.slug)
