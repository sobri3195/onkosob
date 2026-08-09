import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Activity, ArrowRight, BookOpen, Brain, CheckCircle2, ClipboardList, Dna, HeartHandshake, Leaf, Radiation, ScanLine, ShieldCheck, Sparkles, Stethoscope, Syringe, Users, Utensils, Waves } from 'lucide-react'
import type { Store } from '@/store/useLocalStore'
import type { OnboardingData } from '@/data/seed'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { MedicalDisclaimer } from '@/components/shared/MedicalDisclaimer'
import { JourneyNavigator } from '@/components/home/JourneyNavigator'
import { GlossaryExplorer, QuestionBuilder, TreatmentChecklist } from '@/components/home/InteractiveTools'

const entryCards = [
  [ClipboardList, 'Saya baru mendapat diagnosis', 'Mulai dari memahami hasil pemeriksaan dan langkah berikutnya.', '#perjalanan'],
  [Syringe, 'Saya sedang menjalani terapi', 'Pelajari persiapan, efek samping, dan apa yang perlu dipantau.', '#checklist'],
  [HeartHandshake, 'Saya sedang mendampingi keluarga', 'Panduan praktis untuk caregiver selama perjalanan kanker.', '#caregiver'],
  [Sparkles, 'Terapi saya sudah selesai', 'Pelajari kontrol, pemulihan, dan survivorship.', '#survivorship'],
  [BookOpen, 'Saya ingin belajar tentang kanker', 'Pahami kanker melalui informasi yang lebih sederhana dan terpercaya.', '/edukasi']
] as const
const knowledge = [[Dna,'Kenali Kanker'],[ScanLine,'Diagnosis'],[Stethoscope,'Operasi'],[Syringe,'Kemoterapi'],[Radiation,'Radioterapi'],[ShieldCheck,'Imunoterapi'],[Activity,'Targeted Therapy'],[Waves,'Hormonal Therapy'],[Utensils,'Nutrisi'],[Leaf,'Aktivitas Fisik'],[Brain,'Mental Health'],[Users,'Caregiver'],[HeartHandshake,'Palliative Care'],[Sparkles,'Survivorship']] as const
const myths = [
  ['“Biopsi membuat kanker menyebar.”','Biopsi merupakan bagian penting untuk memastikan diagnosis dan karakteristik penyakit. Keputusan pemeriksaan ditentukan tenaga kesehatan berdasarkan kondisi pasien.'],
  ['“Semua benjolan berarti kanker.”','Benjolan memiliki beragam penyebab. Evaluasi tenaga kesehatan diperlukan untuk mengetahui penyebabnya dengan tepat.'],
  ['“Terapi kanker selalu sama untuk setiap orang.”','Rencana perawatan dapat berbeda berdasarkan jenis penyakit, kondisi klinis, tujuan terapi, dan preferensi pasien.']
]

function LanternVisual() { return <div className='lantern-map' aria-label='Ilustrasi jalur dari diagnosis menuju survivorship'><div className='orbit orbit-one'/><div className='orbit orbit-two'/><div className='lantern-glow'/><div className='lantern'><span/><LampIcon /></div>{['Diagnosis','Staging','Treatment','Recovery','Survivorship'].map((x,i)=><div className={`map-node node-${i+1}`} key={x}><span>0{i+1}</span><strong>{x}</strong></div>)}<p>YOU ARE NOT LOST.<br/><strong>THERE IS A PATH.</strong></p></div> }
function LampIcon(){return <svg viewBox='0 0 100 140' role='img' aria-label='Lentera menyala'><path d='M31 38h38l10 78H21zM38 38V22h24v16M25 116h50M17 124h66' fill='none' stroke='currentColor' strokeWidth='3'/><path d='M37 51h26l5 50H32z' fill='#F2C56B' fillOpacity='.3'/><path d='M50 59c11 15 9 28 0 34-9-6-11-19 0-34Z' fill='#F2C56B'/></svg>}

export function HomePage({ store }: { store: Store; onCompleteOnboarding: (payload: OnboardingData) => void }) {
  const [revealed, setRevealed] = useState<number[]>([])
  const articles = store.articles.slice(0,3)
  return <div className='home-page'>
    <section className='hero'><div className='hero-dust'/><div className='hero-inner'><div className='hero-copy'><span className='eyebrow'><i/> LENTERA ONKO VISION</span><h1><span>Saat perjalanan terasa gelap,</span><em>kami membantu menyalakan arah.</em></h1><p>Edukasi dan navigasi perjalanan kanker untuk membantu pasien dan keluarga memahami diagnosis, terapi, pemulihan, dan langkah berikutnya.</p><div className='hero-actions'><a className='button button-primary' href='#perjalanan'>Mulai Perjalanan Saya <ArrowRight /></a><Link className='button button-secondary' to='/edukasi'>Pelajari Tentang Kanker</Link></div><small><ShieldCheck/> Informasi kesehatan berbasis bukti <i/> Bahasa yang lebih mudah dipahami</small></div><LanternVisual /></div><div className='scroll-cue'><span/> GULIR UNTUK MENJELAJAHI</div></section>

    <AnimatedSection className='entry-section section-shell'><div className='section-heading centered'><span className='eyebrow'>MULAI DARI SINI</span><h2>Di mana Anda berada<br/>dalam perjalanan ini?</h2><p>Pilih situasi yang paling sesuai. Kami akan membantu mengarahkan Anda ke informasi yang relevan.</p></div><div className='entry-grid'>{entryCards.map(([Icon,title,desc,to],i)=><a href={to} key={title} className='entry-card'><span className='entry-number'>0{i+1}</span><Icon/><h3>{title}</h3><p>{desc}</p><span className='card-link'>Jelajahi langkah ini <ArrowRight/></span></a>)}</div></AnimatedSection>
    <JourneyNavigator />
    <GlossaryExplorer />

    <AnimatedSection className='knowledge section-shell'><div className='section-heading'><span className='eyebrow'>PUSAT PENGETAHUAN ONKOLOGI</span><h2>Pengetahuan memberi<br/>ruang untuk bernapas.</h2><p>Temukan penjelasan yang bertanggung jawab, terstruktur, dan lebih mudah dipahami.</p></div><div className='knowledge-grid'>{knowledge.map(([Icon,label],i)=><Link to='/edukasi' key={label}><span>{String(i+1).padStart(2,'0')}</span><Icon/><strong>{label}</strong><ArrowRight/></Link>)}</div></AnimatedSection>

    <AnimatedSection className='myth-section'><div className='section-shell'><div className='section-heading light'><span className='eyebrow'>MITOS VS FAKTA</span><h2>Mitos kanker masih<br/>banyak beredar.</h2><p>Sentuh kartu untuk melihat penjelasan berbasis informasi kesehatan yang bertanggung jawab.</p></div><div className='myth-grid'>{myths.map(([myth,fact],i)=><button key={myth} onClick={()=>setRevealed(revealed.includes(i)?revealed.filter(x=>x!==i):[...revealed,i])} aria-pressed={revealed.includes(i)} className={revealed.includes(i)?'revealed':''}><span>{revealed.includes(i)?'FAKTA':'MITOS'}</span><h3>{revealed.includes(i)?fact:myth}</h3><small>{revealed.includes(i)?'Klik untuk melihat mitos':'Klik untuk ungkap fakta'} <ArrowRight/></small></button>)}</div></div></AnimatedSection>

    <div className='interactive-suite section-shell'><TreatmentChecklist/><QuestionBuilder/></div>

    <AnimatedSection className='red-flags section-shell'><div><span className='eyebrow'>KENALI TANDA PENTING</span><h2>Jangan menunggu<br/>bila ini terjadi.</h2><p>Hubungi tim kesehatan yang menangani Anda atau cari pertolongan medis segera sesuai tingkat kegawatan.</p></div><ul>{['Demam setelah kemoterapi','Sesak berat','Perdarahan tidak terkendali','Penurunan kesadaran','Muntah terus-menerus','Dehidrasi berat','Nyeri berat yang memburuk'].map(x=><li key={x}><span>!</span>{x}</li>)}</ul><MedicalDisclaimer/></AnimatedSection>

    <AnimatedSection id='caregiver' className='caregiver'><div className='caregiver-art'><div/><HeartHandshake/></div><div><span className='eyebrow'>UNTUK CAREGIVER</span><h2>Menjadi pendamping<br/>juga sebuah perjalanan.</h2><p>Kehadiran Anda bermakna. Namun, mendampingi bukan berarti harus melakukannya sendirian.</p><ul>{['Menemani dan mencatat saat konsultasi','Membantu mengelola jadwal dan nutrisi','Mendukung tanpa memaksa','Menjaga kesehatan diri sebagai caregiver'].map(x=><li key={x}><CheckCircle2/>{x}</li>)}</ul><Link to='/pasien' className='text-link'>Panduan untuk caregiver <ArrowRight/></Link></div></AnimatedSection>

    <AnimatedSection id='survivorship' className='survivorship'><div className='section-shell'><span className='eyebrow'>SURVIVORSHIP</span><h2>Terapi selesai bukan berarti<br/>perjalanan selesai.</h2><p>Fase berikutnya adalah tentang memulihkan ritme, memahami tindak lanjut, dan menjalani hari dengan dukungan yang tepat.</p><div className='survivor-topics'>{['Follow-up','Rehabilitasi','Nutrisi','Aktivitas fisik','Kesehatan emosional','Kesadaran kekambuhan','Kembali bekerja','Kehidupan keluarga'].map((x,i)=><span key={x}>{String(i+1).padStart(2,'0')} {x}</span>)}</div><Link to='/pemantauan' className='button button-dark'>Jelajahi Survivorship <ArrowRight/></Link></div></AnimatedSection>

    <AnimatedSection className='articles section-shell'><div className='section-heading split'><div><span className='eyebrow'>EDUKASI TERPILIH</span><h2>Bacaan untuk langkah<br/>yang sedang Anda jalani.</h2></div><Link to='/edukasi' className='text-link'>Lihat Semua Artikel <ArrowRight/></Link></div><div className='article-grid'>{articles.map((a,i)=><Link to={`/edukasi/${a.slug}`} key={a.id} className='article-card'><div className={`article-visual visual-${i}`}><span>0{i+1}</span><BookOpen/></div><div><span>{a.category} · 5 MENIT BACA</span><h3>{a.title}</h3><p>{a.excerpt}</p><small><ShieldCheck/> Informasi edukasi</small></div></Link>)}</div></AnimatedSection>

    <AnimatedSection className='trust section-shell'><div className='section-heading'><span className='eyebrow'>PRINSIP EDITORIAL</span><h2>Informasi yang bisa dipahami,<br/>tanpa kehilangan akurasinya.</h2></div><div className='trust-grid'>{[['01','Evidence-informed','Informasi disusun berdasarkan sumber medis yang kredibel.'],['02','Reviewed','Konten kesehatan melalui proses telaah sebelum dipublikasikan.'],['03','Patient-centered','Bahasa dibuat untuk membantu memahami, bukan menambah kecemasan.'],['04','Transparent','Sumber dan tanggal pembaruan konten ditampilkan.']].map(([n,t,d])=><div key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></div>)}</div><MedicalDisclaimer/></AnimatedSection>
  </div>
}
