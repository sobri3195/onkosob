import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { ArticleCard } from '@/components/article/ArticleComponents'
import { categories } from '@/content/categories'
import { contentRepository } from '@/services/contentRepository'
import { rankArticles } from '@/utils/contentSearch'
import { useDocumentMetadata } from '@/hooks/useDocumentMetadata'
import type { MedicalArticle } from '@/types/content'

export function ArticlesPage(){
  const [articles,setArticles]=useState<MedicalArticle[]>([]),[query,setQuery]=useState(''),[category,setCategory]=useState('all'),[sort,setSort]=useState('latest')
  useDocumentMetadata('Artikel Onkologi | Lentera','Edukasi onkologi yang terstruktur, memiliki referensi, dan transparan mengenai status tinjauan medis.','/articles')
  useEffect(()=>{contentRepository.getArticles().then(setArticles)},[])
  const list=useMemo(()=>{let result=rankArticles(articles,query).filter(article=>category==='all'||article.categoryId===category);return [...result].sort((a,b)=>sort==='reviewed'?(b.lastReviewedAt??'').localeCompare(a.lastReviewedAt??''):sort==='title'?a.title.localeCompare(b.title,'id'):(b.publishedAt??'').localeCompare(a.publishedAt??''))},[articles,query,category,sort])
  const featured=articles.filter(article=>article.featured&&article.status==='published').slice(0,4)
  return <div className='content-page'><section className='content-hero'><div><span>PUSTAKA MEDIS LENTERA</span><h1>Informasi untuk memahami perjalanan kanker</h1><p>Konten edukatif dengan struktur, sumber, dan tanggung jawab pembaruan yang terlihat jelas.</p></div></section><div className='content-shell'>
    {!!featured.length&&<section aria-labelledby='featured-title'><header className='content-heading'><div><span>PILIHAN LENTERA</span><h2 id='featured-title'>Mulai dari topik penting</h2></div><p>Artikel pilihan untuk membantu membangun pemahaman dasar.</p></header><div className='article-card-grid featured-grid'>{featured.map(article=><ArticleCard key={article.id} article={article}/>)}</div></section>}
    <section className='article-library' aria-labelledby='library-title'><header className='content-heading'><div><span>SEMUA ARTIKEL</span><h2 id='library-title'>Jelajahi pustaka</h2></div><p>{list.length} artikel ditemukan</p></header><div className='article-filters'><label><Search/><span className='sr-only'>Cari artikel</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder='Cari judul, istilah, kategori, atau kata kunci…'/></label><select aria-label='Filter kategori' value={category} onChange={e=>setCategory(e.target.value)}><option value='all'>Semua kategori</option>{categories.filter(item=>articles.some(article=>article.categoryId===item.id)).map(item=><option value={item.id} key={item.id}>{item.title}</option>)}</select><select aria-label='Urutkan artikel' value={sort} onChange={e=>setSort(e.target.value)}><option value='latest'>Terbaru</option><option value='reviewed'>Baru ditinjau</option><option value='title'>Judul A–Z</option></select></div>{list.length?<div className='article-card-grid'>{list.map(article=><ArticleCard key={article.id} article={article}/>)}</div>:<div className='content-empty'><h3>Tidak ada artikel yang cocok</h3><p>Coba istilah atau kategori lain.</p></div>}</section>
  </div></div>
}
