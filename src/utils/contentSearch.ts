import { categoryById } from '@/content/categories'
import type { MedicalArticle } from '@/types/content'

const normalize = (value:string) => value.toLocaleLowerCase('id-ID').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
export function rankArticles(articles: MedicalArticle[], query: string): MedicalArticle[] {
  const terms = normalize(query).split(/\s+/).filter(Boolean)
  if (!terms.length) return articles
  return articles.map(article => {
    const category = categoryById(article.categoryId)?.title ?? ''
    const fields = { title:normalize(article.title), excerpt:normalize(article.excerpt), tags:normalize(article.tags.join(' ')), glossary:normalize(article.glossaryTerms?.join(' ') ?? ''), category:normalize(category), keywords:normalize(article.keywords?.join(' ') ?? '') }
    const score = terms.reduce((total,term) => total + (fields.title.includes(term)?10:0) + (fields.excerpt.includes(term)?4:0) + (fields.tags.includes(term)?7:0) + (fields.glossary.includes(term)?6:0) + (fields.category.includes(term)?5:0) + (fields.keywords.includes(term)?5:0),0)
    return { article, score }
  }).filter(item => item.score > 0).sort((a,b)=>b.score-a.score || a.article.title.localeCompare(b.article.title,'id')).map(item=>item.article)
}
