import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AppRoutes } from '@/routes/AppRoutes'
import './index.css'
import { UserProvider } from '@/context/UserContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider><AppRoutes /></UserProvider>
      <Toaster richColors position='top-right' />
    </BrowserRouter>
  </React.StrictMode>
)
