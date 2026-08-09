import { BookOpenCheck } from 'lucide-react'
import { MedicalDisclaimer } from './MedicalDisclaimer'

type Props = { lastReviewed?: string; reviewer?: string; references?: string[]; showDisclaimer?: boolean }
export function MedicalArticleMeta({ lastReviewed = '—', reviewer = '—', references = [], showDisclaimer = true }: Props) {
  return <aside className='article-meta'>
    <BookOpenCheck aria-hidden='true' />
    <div><p><strong>Terakhir ditinjau:</strong> {lastReviewed}</p><p><strong>Ditinjau oleh:</strong> {reviewer}</p>{references.length > 0 && <p><strong>Referensi:</strong> {references.join(', ')}</p>}</div>
    {showDisclaimer && <MedicalDisclaimer compact />}
  </aside>
}

