import { diagnosisArticles } from './diagnosis'
import { treatmentArticles } from './treatment'
import { supportArticles } from './support'
import { insightArticles } from './insights'
import { radiationNewsArticles } from './radiationNews'
import { categories } from '@/content/categories'
export const medicalArticles = [...radiationNewsArticles, ...insightArticles, ...diagnosisArticles, ...treatmentArticles, ...supportArticles]
categories.forEach(category => { category.articleCount = medicalArticles.filter(article => article.categoryId === category.id).length })
