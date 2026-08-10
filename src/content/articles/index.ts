import { diagnosisArticles } from './diagnosis'
import { treatmentArticles } from './treatment'
import { supportArticles } from './support'
import { categories } from '@/content/categories'
export const medicalArticles = [...diagnosisArticles, ...treatmentArticles, ...supportArticles]
categories.forEach(category => { category.articleCount = medicalArticles.filter(article => article.categoryId === category.id).length })
