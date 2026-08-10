import { ShieldAlert } from 'lucide-react'
export function MedicalSafetyNotice({ emergency = false }: { emergency?: boolean }) {
  return <aside className='feature-notice' role='note'><ShieldAlert aria-hidden='true'/><div><strong>{emergency ? 'Pada kondisi gawat darurat, segera cari pertolongan medis.' : 'Informasi edukatif'}</strong><p>Informasi ini bersifat edukatif dan tidak menggantikan penilaian dokter atau tenaga kesehatan yang menangani Anda.</p></div></aside>
}
