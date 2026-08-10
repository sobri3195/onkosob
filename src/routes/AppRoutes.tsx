import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { PublicLayout } from '@/layouts/PublicLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { HomePage } from '@/pages/public/HomePage'
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
import { ArticlesPage } from '@/pages/public/ArticlesPage'
import { ArticleDetailPage } from '@/pages/public/ArticleDetailPage'
import { EditorialPolicyPage } from '@/pages/public/EditorialPolicyPage'
import { EditorialDashboardPage } from '@/pages/editorial/EditorialDashboardPage'
import { ArticleEditorPage } from '@/pages/editorial/ArticleEditorPage'
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage } from '@/pages/auth/AuthPages'
import { AccountPage } from '@/pages/account/AccountPage'
import { ProtectedRoute, RoleProtectedRoute } from '@/auth/RouteGuards'
import { AuditLogPage, EditorialUsersPage } from '@/pages/admin/SecurityAdminPages'
const PersonalDashboardPage = lazy(() => import('@/pages/personal/DashboardPage'))
const ProfilePage = lazy(() => import('@/pages/personal/ProfilePage'))
const PrivacyCenterPage = lazy(() => import('@/pages/personal/PrivacyCenterPage'))
const DocumentsPage = lazy(() => import('@/pages/documents/DocumentsPages').then(m=>({default:m.DocumentsPage})))
const DocumentsTimelinePage = lazy(() => import('@/pages/documents/DocumentsPages').then(m=>({default:m.DocumentsTimelinePage})))
const DocumentDetailPage = lazy(() => import('@/pages/documents/DocumentsPages').then(m=>({default:m.DocumentDetailPage})))

export function AppRoutes() {
  const { store, update, loginAdmin, logoutAdmin } = useLocalStore()
  const loc = useLocation(); const nav = useNavigate()

  const upsert = <T extends {id:string}>(items:T[], item:T)=> items.some(i=>i.id===item.id) ? items.map(i=>i.id===item.id?item:i) : [item, ...items]

  return <Routes>
    <Route element={<PublicLayout onAdmin={()=>{loginAdmin(); toast.success('Admin demo aktif'); nav('/admin/dashboard')}}/>}>
      <Route path='/' element={<HomePage store={store} onCompleteOnboarding={(payload)=>update(s=>({...s,onboarding:payload}))} />} />
      <Route path='/articles' element={<ArticlesPage />} />
      <Route path='/articles/:slug' element={<ArticleDetailPage />} />
      <Route path='/preview/article/:slug' element={<ArticleDetailPage preview />} />
      <Route path='/editorial-policy' element={<EditorialPolicyPage />} />
      <Route path='/edukasi' element={<Navigate to='/articles' replace />} />
      <Route path='/edukasi/:slug' element={<LegacyArticleRedirect />} />
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
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/forgot-password' element={<ForgotPasswordPage />} />
      <Route path='/reset-password' element={<ResetPasswordPage />} />
      <Route path='/account' element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
      <Route path='/privacy-center' element={<Suspense fallback={<p className='route-loading'>Memuat pusat privasi…</p>}><PrivacyCenterPage/></Suspense>} />
      <Route path='/documents' element={<ProtectedRoute><Suspense fallback={<p className='route-loading'>Membuka vault…</p>}><DocumentsPage/></Suspense></ProtectedRoute>} />
      <Route path='/documents/timeline' element={<ProtectedRoute><Suspense fallback={<p className='route-loading'>Membuka timeline…</p>}><DocumentsTimelinePage/></Suspense></ProtectedRoute>} />
      <Route path='/documents/:id' element={<ProtectedRoute><Suspense fallback={<p className='route-loading'>Membuka dokumen…</p>}><DocumentDetailPage/></Suspense></ProtectedRoute>} />
      <Route path='*' element={<NotFoundPage />} />
    </Route>
    <Route path='/editorial' element={<ProtectedRoute><RoleProtectedRoute roles={['editor','medical_reviewer','admin']}><EditorialDashboardPage /></RoleProtectedRoute></ProtectedRoute>} />
    <Route path='/editorial/articles/:id/edit' element={<ProtectedRoute><RoleProtectedRoute roles={['editor','medical_reviewer','admin']}><ArticleEditorPage /></RoleProtectedRoute></ProtectedRoute>} />
    <Route path='/editorial/articles/new' element={<ProtectedRoute><RoleProtectedRoute roles={['editor','admin']}><ArticleEditorPage /></RoleProtectedRoute></ProtectedRoute>} />
    <Route path='/review' element={<Navigate to='/editorial' replace />} />
    <Route path='/review/:id' element={<ProtectedRoute><RoleProtectedRoute roles={['medical_reviewer','admin']}><ArticleEditorPage /></RoleProtectedRoute></ProtectedRoute>} />
    <Route path='/admin/audit' element={<ProtectedRoute><RoleProtectedRoute roles={['admin']}><AuditLogPage /></RoleProtectedRoute></ProtectedRoute>} />
    <Route path='/admin/users' element={<ProtectedRoute><RoleProtectedRoute roles={['admin']}><EditorialUsersPage /></RoleProtectedRoute></ProtectedRoute>} />
    <Route path='/admin' element={<ProtectedRoute><RoleProtectedRoute roles={['admin']}><AdminLayout onLogout={()=>{signOutCompat(logoutAdmin);toast.success('Logout admin');nav('/')}}/></RoleProtectedRoute></ProtectedRoute>}>
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

function LegacyArticleRedirect(){const {pathname}=useLocation();return <Navigate to={pathname.replace('/edukasi/','/articles/')} replace/>}

function signOutCompat(localLogout:()=>void){ localLogout() }
