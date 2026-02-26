import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '@/components/admin/Sidebar'

export function AdminLayout({onLogout}:{onLogout:()=>void}) {
  const [collapsed, setCollapsed] = useState(false)
  return <div className='flex min-h-screen'><Sidebar collapsed={collapsed} toggle={()=>setCollapsed(!collapsed)} onLogout={onLogout} /><div className='flex-1'><header className='border-b p-4 font-semibold'>Panel Admin Demo</header><main className='p-4'><Outlet/></main></div></div>
}
