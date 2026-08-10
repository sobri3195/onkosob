import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppRoutes } from '@/routes/AppRoutes'
import './index.css'
import { UserProvider } from '@/context/UserContext'
import { medicalArticles } from '@/content/articles'
import { validateContent } from '@/utils/contentValidation'

if (import.meta.env.DEV) {
  const diagnostics = validateContent(medicalArticles).filter(({ result }) => result.errors.length || result.warnings.length)
  diagnostics.forEach(({ article, result }) => {
    if (result.errors.length) console.error(`[content:${article.slug}]`, result.errors)
    if (result.warnings.length) console.warn(`[content:${article.slug}]`, result.warnings)
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider><AppRoutes /></UserProvider>
      <Toaster richColors position='top-right' />
    </BrowserRouter>
  </React.StrictMode>
)
