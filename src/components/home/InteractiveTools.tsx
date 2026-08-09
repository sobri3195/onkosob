import { useEffect, useMemo, useState } from 'react'
import { Check, ClipboardCheck, Copy, Printer, RotateCcw, Search } from 'lucide-react'
import { toast } from 'sonner'
import { AnimatedSection } from '@/components/shared/AnimatedSection'

const glossary = [
  ['TNM', 'Sistem yang menggambarkan ukuran tumor, keterlibatan kelenjar getah bening, dan penyebaran.', 'Membantu tim menjelaskan luas penyakit.', 'Bagaimana TNM saya memengaruhi rencana perawatan?'],
  ['HER2', 'Protein yang dapat ditemukan lebih banyak pada beberapa sel kanker tertentu.', 'Dapat menjadi salah satu biomarker yang dipertimbangkan tim.', 'Apakah HER2 saya sudah diperiksa?'],
  ['ER', 'Reseptor estrogen yang dapat diperiksa pada kanker tertentu.', 'Hasilnya dapat membantu tim memahami karakter penyakit.', 'Apa arti hasil ER bagi kondisi saya?'],
  ['PR', 'Reseptor progesteron yang dinilai pada jaringan kanker tertentu.', 'Biasanya dibaca bersama hasil lain, bukan secara terpisah.', 'Bagaimana PR dibaca bersama hasil lainnya?'],
  ['Ki-67', 'Penanda yang memberi gambaran aktivitas pembelahan sel.', 'Interpretasinya bergantung pada konteks dan jenis kanker.', 'Apakah nilai Ki-67 relevan bagi saya?'],
  ['Grade', 'Gambaran seberapa berbeda sel kanker dibandingkan sel normal.', 'Memberi informasi tentang karakter biologis penyakit.', 'Apa grade penyakit saya dan apa artinya?'],
  ['Stage', 'Ringkasan luas penyakit berdasarkan informasi klinis yang tersedia.', 'Membantu mendiskusikan tujuan dan pilihan perawatan.', 'Apa stadium saya dan bagaimana ditentukan?'],
  ['Metastasis', 'Penyebaran sel kanker dari lokasi asal ke bagian tubuh lain.', 'Mempengaruhi tujuan serta pendekatan perawatan.', 'Pemeriksaan apa yang menilai adanya penyebaran?'],
  ['Lymph Node', 'Kelenjar getah bening, bagian dari sistem kekebalan tubuh.', 'Kondisinya dapat menjadi bagian dari penentuan stadium.', 'Apakah kelenjar getah bening saya terlibat?'],
  ['Margins', 'Tepi jaringan yang diangkat saat operasi.', 'Dinilai untuk melihat apakah sel penyakit ditemukan dekat tepi.', 'Apa arti hasil margin pada laporan saya?'],
  ['ECOG', 'Skala yang menggambarkan kemampuan menjalankan aktivitas sehari-hari.', 'Membantu tim memahami kondisi fungsi secara umum.', 'Berapa nilai ECOG saya dan mengapa dinilai?']
]

const checklists: Record<string, string[]> = {
  'Sebelum Kemoterapi': ['Konfirmasi jadwal dan lokasi', 'Catat obat dan suplemen yang digunakan', 'Siapkan kontak tim perawatan', 'Atur transportasi dan pendamping bila perlu'],
  'Sebelum Radioterapi': ['Ikuti instruksi persiapan dari unit terapi', 'Gunakan pakaian yang nyaman', 'Catat perubahan kulit atau keluhan', 'Bawa jadwal dan kartu pasien'],
  'Sebelum Operasi': ['Ikuti petunjuk puasa dari tim medis', 'Konfirmasi obat yang perlu dihentikan atau dilanjutkan', 'Siapkan dokumen dan hasil pemeriksaan', 'Rencanakan dukungan setelah pulang'],
  'Sebelum Konsultasi': ['Bawa hasil pemeriksaan', 'Tuliskan gejala dan waktunya', 'Susun tiga pertanyaan terpenting', 'Catat daftar obat dan alergi']
}

const questionGroups: Record<string, string[]> = {
  Diagnosis: ['Apa stadium penyakit saya?', 'Pemeriksaan apa lagi yang diperlukan?'],
  Treatment: ['Apa tujuan terapi saya?', 'Apa manfaat, risiko, dan alternatif terapi ini?'],
  'Efek Samping': ['Efek samping apa yang harus segera dilaporkan?', 'Siapa yang dapat saya hubungi di luar jam layanan?'],
  Prognosis: ['Faktor apa yang digunakan untuk menjelaskan kemungkinan perjalanan penyakit?'],
  Lifestyle: ['Aktivitas dan pola makan apa yang aman selama terapi?'],
  'Tindak Lanjut': ['Apa jadwal kontrol saya?', 'Gejala apa yang perlu dicatat setelah terapi?']
}

export function GlossaryExplorer() {
  const [query, setQuery] = useState(''); const [selected, setSelected] = useState(0)
  const filtered = useMemo(() => glossary.filter(term => term[0].toLowerCase().includes(query.toLowerCase())), [query])
  const item = filtered[selected] ?? filtered[0]
  useEffect(() => setSelected(0), [query])
  return <AnimatedSection id='glosarium' className='glossary section-shell'>
    <div className='glossary-intro'><span className='eyebrow'>BINGUNG MEMBACA HASIL PEMERIKSAAN?</span><h2>Decode My Report</h2><p>Kenali istilah onkologi dalam bahasa yang lebih sederhana—tanpa mengklaim menafsirkan hasil medis Anda.</p><label className='search-field'><Search /><span className='sr-only'>Cari istilah</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder='Cari TNM, HER2, Stage…' /></label><div className='term-list'>{filtered.map((term, i) => <button key={term[0]} className={item?.[0] === term[0] ? 'active' : ''} onClick={() => setSelected(i)}>{term[0]}</button>)}</div></div>
    <div className='term-card'>{item ? <><span>ISTILAH ONKOLOGI</span><h3>{item[0]}</h3><h4>Bahasa sederhana</h4><p>{item[1]}</p><h4>Mengapa penting?</h4><p>{item[2]}</p><div className='doctor-question'><div><span>Pertanyaan untuk dokter</span><p>{item[3]}</p></div></div></> : <p>Istilah belum ditemukan. Coba kata kunci lain.</p>}</div>
  </AnimatedSection>
}

export function TreatmentChecklist() {
  const [tab, setTab] = useState(Object.keys(checklists)[0]); const [done, setDone] = useState<string[]>(() => { try { return JSON.parse(localStorage.getItem('lentera-checklist') || '[]') } catch { return [] } })
  useEffect(() => localStorage.setItem('lentera-checklist', JSON.stringify(done)), [done])
  return <AnimatedSection id='checklist' className='tools-block'><div className='section-heading compact'><span className='eyebrow'>CHECKLIST PRIBADI</span><h2>Persiapkan diri sebelum terapi.</h2><p>Centang hal yang sudah disiapkan. Progres tersimpan hanya di perangkat ini.</p></div><div className='tab-row' role='tablist'>{Object.keys(checklists).map(x => <button role='tab' aria-selected={tab === x} className={tab === x ? 'active' : ''} onClick={() => setTab(x)} key={x}>{x.replace('Sebelum ', '')}</button>)}</div><div className='checklist-card'><div className='progress-line'><span>{done.filter(x => x.startsWith(tab)).length} dari {checklists[tab].length} selesai</span><button onClick={() => setDone(done.filter(x => !x.startsWith(tab)))}><RotateCcw /> Reset</button></div>{checklists[tab].map(item => { const id = `${tab}:${item}`; const checked = done.includes(id); return <label key={item} className={checked ? 'checked' : ''}><input type='checkbox' checked={checked} onChange={() => setDone(checked ? done.filter(x => x !== id) : [...done, id])} /><span className='check-box'>{checked && <Check />}</span><span>{item}</span></label> })}</div></AnimatedSection>
}

export function QuestionBuilder() {
  const [category, setCategory] = useState(Object.keys(questionGroups)[0]); const [selected, setSelected] = useState<string[]>([])
  const toggle = (q: string) => setSelected(selected.includes(q) ? selected.filter(x => x !== q) : [...selected, q])
  const copy = async () => { if (!selected.length) return toast.info('Pilih setidaknya satu pertanyaan.'); await navigator.clipboard.writeText(selected.map((q, i) => `${i + 1}. ${q}`).join('\n')); toast.success('Pertanyaan disalin') }
  return <AnimatedSection id='pertanyaan' className='tools-block question-builder'><div className='section-heading compact'><span className='eyebrow'>PERSIAPAN KONSULTASI</span><h2>Pertanyaan untuk konsultasi berikutnya.</h2><p>Pilih pertanyaan yang relevan agar percakapan dengan tim kesehatan lebih terarah.</p></div><div className='question-grid'><div><div className='category-list'>{Object.keys(questionGroups).map(x => <button className={category === x ? 'active' : ''} onClick={() => setCategory(x)} key={x}>{x}<span>{questionGroups[x].length}</span></button>)}</div></div><div className='question-options'>{questionGroups[category].map(q => <button className={selected.includes(q) ? 'selected' : ''} onClick={() => toggle(q)} key={q}><span>{selected.includes(q) && <Check />}</span>{q}</button>)}</div><div className='print-list'><ClipboardCheck /><h3>Daftar saya</h3>{selected.length ? <ol>{selected.map(q => <li key={q}>{q}</li>)}</ol> : <p>Pertanyaan yang Anda pilih akan muncul di sini.</p>}<div><button onClick={copy}><Copy /> Salin Pertanyaan</button><button onClick={() => window.print()}><Printer /> Cetak</button></div></div></div></AnimatedSection>
}
