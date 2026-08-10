import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { HomePage } from '@/pages/public/HomePage'
import { EdukasiPage } from '@/pages/public/EdukasiPage'
import { EdukasiDetailPage } from '@/pages/public/EdukasiDetailPage'
import { JadwalPage } from '@/pages/public/JadwalPage'
import { PanduanPage } from '@/pages/public/PanduanPage'
import { FAQPage } from '@/pages/public/FAQPage'
import { KontakPage } from '@/pages/public/KontakPage'
import { PemantauanPage } from '@/pages/public/PemantauanPage'
import { PasienPage } from '@/pages/public/PasienPage'
import { DisclaimerPage } from '@/pages/public/DisclaimerPage'
import { NotFoundPage } from '@/pages/public/NotFoundPage'
import { DashboardPage } from '@/pages/admin/DashboardPage'
import { EdukasiAdminPage } from '@/pages/admin/EdukasiAdminPage'
import { FAQAdminPage } from '@/pages/admin/FAQAdminPage'
import { JadwalAdminPage } from '@/pages/admin/JadwalAdminPage'
import { PengumumanAdminPage } from '@/pages/admin/PengumumanAdminPage'
import { InboxAdminPage } from '@/pages/admin/InboxAdminPage'
import { PengaturanAdminPage } from '@/pages/admin/PengaturanAdminPage'
import { PasienAdminPage } from '@/pages/admin/PasienAdminPage'
import { useLocalStore } from '@/store/useLocalStore'
import { toast } from '@/components/ui/use-toast'
import type { Announcement, Article, FAQ, PatientCase, Schedule } from '@/data/seed'
import { CaregiverPage, DecodePage, GlossaryPage, JourneyPage, LearningPage, MythFactPage, PreparePage, QuestionsPage, QuizPage, RedFlagsPage, SavedPage, SearchPage, StartPage } from '@/pages/features/FeaturePages'
const PersonalDashboardPage = lazy(() => import('@/pages/personal/DashboardPage'))
const ProfilePage = lazy(() => import('@/pages/personal/ProfilePage'))
const PrivacyCenterPage = lazy(() => import('@/pages/personal/PrivacyCenterPage'))

export function AppRoutes() {
  const { store, update, loginAdmin, logoutAdmin } = useLocalStore()
  const loc = useLocation(); const nav = useNavigate()
  if (loc.pathname.startsWith('/admin') && !store.isAdmin) { toast.error('Akses admin demo belum aktif'); return <Navigate to='/' replace /> }

  const upsert = <T extends {id:string}>(items:T[], item:T)=> items.some(i=>i.id===item.id) ? items.map(i=>i.id===item.id?item:i) : [item, ...items]

  return <Routes>
    <Route element={<PublicLayout onAdmin={()=>{loginAdmin(); toast.success('Admin demo aktif'); nav('/admin/dashboard')}}/>}>
      <Route path='/' element={<HomePage store={store} onCompleteOnboarding={(payload)=>update(s=>({...s,onboarding:payload}))} />} />
      <Route path='/edukasi' element={<EdukasiPage store={store} />} />
      <Route path='/edukasi/:slug' element={<EdukasiDetailPage store={store} />} />
      <Route path='/jadwal' element={<JadwalPage store={store} />} />
      <Route path='/panduan' element={<PanduanPage store={store} onCheck={(item)=>update(s=>({...s,checkedItems:s.checkedItems.includes(item)?s.checkedItems.filter(i=>i!==item):[...s.checkedItems,item]}))} />} />
      <Route path='/faq' element={<FAQPage store={store} />} />
      <Route path='/kontak' element={<KontakPage store={store} onSubmit={(m)=>{update(s=>({...s,inbox:[{...m,id:crypto.randomUUID(),read:false,createdAt:new Date().toISOString()},...s.inbox]}));toast.success('Pesan tersimpan ke inbox demo')}} />} />
      <Route path='/pasien' element={<PasienPage store={store} />} />
      <Route path='/pemantauan' element={<PemantauanPage store={store} />} />
      <Route path='/disclaimer' element={<DisclaimerPage />} />
      <Route path='/start' element={<StartPage />} />
      <Route path='/journey' element={<JourneyPage />} />
      <Route path='/glossary' element={<GlossaryPage />} />
      <Route path='/decode' element={<DecodePage />} />
      <Route path='/questions' element={<QuestionsPage />} />
      <Route path='/prepare' element={<PreparePage />} />
      <Route path='/learning' element={<LearningPage />} />
      <Route path='/quiz' element={<QuizPage />} />
      <Route path='/myth-fact' element={<MythFactPage />} />
      <Route path='/red-flags' element={<RedFlagsPage />} />
      <Route path='/caregiver' element={<CaregiverPage />} />
      <Route path='/saved' element={<SavedPage />} />
      <Route path='/search' element={<SearchPage />} />
      <Route path='/dashboard' element={<Suspense fallback={<p className='route-loading'>Menyiapkan ruang Anda…</p>}><PersonalDashboardPage/></Suspense>} />
      <Route path='/profile' element={<Suspense fallback={<p className='route-loading'>Memuat profil…</p>}><ProfilePage/></Suspense>} />
      <Route path='/privacy-center' element={<Suspense fallback={<p className='route-loading'>Memuat pusat privasi…</p>}><PrivacyCenterPage/></Suspense>} />
      <Route path='*' element={<NotFoundPage />} />
    </Route>
    <Route path='/admin' element={<AdminLayout onLogout={()=>{logoutAdmin();toast.success('Logout admin');nav('/')}}/>}>
      <Route path='dashboard' element={<DashboardPage store={store} />} />
      <Route path='edukasi' element={<EdukasiAdminPage store={store} onSave={(a:Article)=>update(s=>({...s,articles:upsert(s.articles,a)}))} onDelete={(id)=>update(s=>({...s,articles:s.articles.filter(a=>a.id!==id)}))} />} />
      <Route path='faq' element={<FAQAdminPage store={store} onSave={(f:FAQ)=>update(s=>({...s,faqs:upsert(s.faqs,f)}))} onDelete={(id)=>update(s=>({...s,faqs:s.faqs.filter(f=>f.id!==id)}))} onMove={(id,d)=>update(s=>{const i=s.faqs.findIndex(f=>f.id===id); const j=i+d; if(i<0||j<0||j>=s.faqs.length) return s; const arr=[...s.faqs]; [arr[i],arr[j]]=[arr[j],arr[i]]; return {...s,faqs:arr}})} />} />
      <Route path='jadwal' element={<JadwalAdminPage store={store} onSave={(j:Schedule)=>update(s=>({...s,schedules:upsert(s.schedules,j)}))} onDelete={(id)=>update(s=>({...s,schedules:s.schedules.filter(x=>x.id!==id)}))} />} />
      <Route path='pengumuman' element={<PengumumanAdminPage store={store} onSave={(p:Announcement)=>update(s=>({...s,announcements:upsert(s.announcements,p)}))} onDelete={(id)=>update(s=>({...s,announcements:s.announcements.filter(x=>x.id!==id)}))} />} />
      <Route path='inbox' element={<InboxAdminPage store={store} onRead={(id)=>update(s=>({...s,inbox:s.inbox.map(i=>i.id===id?{...i,read:true}:i)}))} />} />
      <Route path='pasien' element={<PasienAdminPage store={store} onSave={(patient:PatientCase)=>update(s=>({...s,patientCases:upsert(s.patientCases,patient)}))} onDelete={(id)=>update(s=>({...s,patientCases:s.patientCases.filter(item=>item.id!==id)}))} />} />
      <Route path='pengaturan' element={<PengaturanAdminPage store={store} onTheme={()=>update(s=>{const t=s.settings.theme==='light'?'dark':'light';document.documentElement.classList.toggle('dark', t==='dark');return {...s,settings:{...s.settings,theme:t}}})} onContact={(k,v)=>update(s=>({...s,settings:{...s.settings,contact:{...s.settings.contact,[k]:v}}}))} />} />
    </Route>
  </Routes>
}
