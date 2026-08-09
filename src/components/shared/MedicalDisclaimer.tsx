import { ShieldCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export function MedicalDisclaimer({ className, compact = false }: { className?: string; compact?: boolean }) {
  return <aside className={cn('medical-disclaimer', compact && 'medical-disclaimer--compact', className)} aria-label='Pernyataan medis'>
    <ShieldCheck aria-hidden='true' />
    <p>Informasi di Lentera Onko Vision ditujukan untuk edukasi dan tidak menggantikan konsultasi, diagnosis, maupun terapi dari dokter atau tenaga kesehatan yang menangani Anda.</p>
  </aside>
}

