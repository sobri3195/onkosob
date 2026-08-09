import { useState } from 'react'
import { ArrowRight, CircleAlert, MessageCircleQuestion } from 'lucide-react'
import { AnimatedSection } from '@/components/shared/AnimatedSection'
import { MedicalDisclaimer } from '@/components/shared/MedicalDisclaimer'

const stages = [
  { name: 'Temuan / Gejala', happening: 'Perubahan tubuh mulai dikenali dan perlu dicatat dengan tenang.', why: 'Catatan yang jelas membantu konsultasi menjadi lebih terarah.', action: 'Catat kapan keluhan muncul, perubahan, serta hal yang memperberat atau meredakan.', prepare: 'Riwayat kesehatan, obat yang digunakan, dan pertanyaan utama.', question: 'Pemeriksaan awal apa yang mungkin diperlukan?' },
  { name: 'Konsultasi', happening: 'Tenaga kesehatan mendengarkan keluhan dan menilai riwayat kesehatan.', why: 'Evaluasi awal menentukan pemeriksaan yang sesuai, bukan memastikan diagnosis sendiri.', action: 'Wawancara medis dan pemeriksaan fisik sesuai kebutuhan.', prepare: 'Ajak pendamping bila membantu dan bawa dokumen sebelumnya.', question: 'Apa kemungkinan langkah berikutnya dan mengapa?' },
  { name: 'Pemeriksaan', happening: 'Pemeriksaan laboratorium atau pencitraan dapat membantu melihat kondisi lebih lengkap.', why: 'Setiap pemeriksaan menjawab pertanyaan klinis yang berbeda.', action: 'Jenis pemeriksaan dipilih dokter berdasarkan kondisi klinis.', prepare: 'Tanyakan persiapan, durasi, hasil, serta risiko pemeriksaan.', question: 'Apa tujuan pemeriksaan ini?' },
  { name: 'Biopsi', happening: 'Sampel jaringan diambil untuk diperiksa lebih lanjut.', why: 'Biopsi membantu memastikan jenis dan karakteristik penyakit.', action: 'Metode pengambilan sampel disesuaikan dengan lokasi dan kondisi pasien.', prepare: 'Diskusikan obat rutin, alergi, dan perawatan setelah tindakan.', question: 'Bagaimana prosedur dan kapan hasil tersedia?' },
  { name: 'Patologi', happening: 'Dokter patologi menilai jaringan dan penanda yang relevan.', why: 'Hasil patologi menjadi dasar penting dalam perencanaan berikutnya.', action: 'Laporan dapat mencakup jenis, grade, dan biomarker tertentu.', prepare: 'Simpan salinan laporan untuk diskusi dengan tim yang menangani.', question: 'Bagian mana dari laporan yang paling relevan bagi saya?' },
  { name: 'Staging', happening: 'Tim menilai sejauh mana penyakit berada di dalam tubuh.', why: 'Stadium membantu menjelaskan situasi dan menyusun tujuan perawatan.', action: 'Informasi dari patologi, pencitraan, dan pemeriksaan klinis digabungkan.', prepare: 'Bawa semua hasil agar informasi dapat dilihat secara utuh.', question: 'Apa stadium penyakit saya dan apa artinya?' },
  { name: 'Perencanaan Multidisiplin', happening: 'Berbagai disiplin dapat mempertimbangkan pilihan perawatan bersama.', why: 'Keputusan mempertimbangkan karakter penyakit, kondisi, dan preferensi pasien.', action: 'Manfaat, risiko, urutan, serta tujuan pilihan terapi dibahas.', prepare: 'Tuliskan prioritas dan hal yang penting bagi kualitas hidup Anda.', question: 'Apa tujuan, manfaat, risiko, dan alternatifnya?' },
  { name: 'Terapi', happening: 'Rencana terapi dijalankan dengan pemantauan berkala.', why: 'Pemantauan membantu menjaga keamanan serta menangani efek samping.', action: 'Terapi dapat berbeda pada setiap pasien sesuai keputusan klinis.', prepare: 'Simpan kontak tim, jadwal, obat, dan gejala yang perlu dilaporkan.', question: 'Efek samping apa yang perlu segera dilaporkan?' },
  { name: 'Monitoring', happening: 'Respons, efek samping, dan kondisi umum dipantau.', why: 'Tim dapat menilai kemajuan dan kebutuhan dukungan.', action: 'Kontrol, pemeriksaan fisik, atau tes tambahan sesuai rencana.', prepare: 'Bawa catatan gejala dan daftar obat pada setiap kunjungan.', question: 'Bagaimana kita menilai respons perawatan?' },
  { name: 'Survivorship / Paliatif', happening: 'Fokus dapat mencakup pemulihan, kontrol, kualitas hidup, atau kenyamanan.', why: 'Dukungan tetap penting setelah terapi aktif maupun sepanjang perawatan.', action: 'Rencana tindak lanjut disesuaikan dengan tujuan dan kebutuhan pasien.', prepare: 'Diskusikan fungsi sehari-hari, emosi, pekerjaan, dan dukungan keluarga.', question: 'Dukungan apa yang tersedia untuk kualitas hidup saya?' }
]

export function JourneyNavigator() {
  const [active, setActive] = useState(0)
  const stage = stages[active]
  return <AnimatedSection id='perjalanan' className='journey-section section-shell'>
    <div className='section-heading'><span className='eyebrow'>NAVIGATOR PERJALANAN</span><h2>Pahami di mana Anda berada,<br />satu tahap pada satu waktu.</h2><p>Jelajahi gambaran umum perjalanan kanker. Setiap perjalanan berbeda dan tahapan dapat berlangsung dalam urutan yang berbeda.</p></div>
    <div className='journey-layout'>
      <ol className='journey-rail' aria-label='Tahapan perjalanan kanker'>{stages.map((item, index) => <li key={item.name}>
        <button className={active === index ? 'active' : ''} onClick={() => setActive(index)} aria-current={active === index ? 'step' : undefined}>
          <span>{String(index + 1).padStart(2, '0')}</span><strong>{item.name}</strong><ArrowRight aria-hidden='true' />
        </button>
      </li>)}</ol>
      <div className='journey-panel' aria-live='polite'>
        <p className='panel-count'>TAHAP {String(active + 1).padStart(2, '0')}</p><h3>{stage.name}</h3>
        <dl><div><dt>Apa yang sedang terjadi?</dt><dd>{stage.happening}</dd></div><div><dt>Mengapa tahap ini diperlukan?</dt><dd>{stage.why}</dd></div><div><dt>Apa yang biasanya dilakukan?</dt><dd>{stage.action}</dd></div><div><dt>Apa yang perlu dipersiapkan?</dt><dd>{stage.prepare}</dd></div></dl>
        <div className='doctor-question'><MessageCircleQuestion /><div><span>Pertanyaan untuk dokter</span><p>{stage.question}</p></div></div>
        <div className='safety-note'><CircleAlert /><p>Laporkan perubahan yang mengkhawatirkan kepada tim kesehatan. Pada kondisi gawat darurat, segera cari pertolongan medis.</p></div>
        <MedicalDisclaimer compact />
      </div>
    </div>
  </AnimatedSection>
}

