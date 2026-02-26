import { AccordionItem } from '@/components/ui/accordion'
import type { Store } from '@/store/useLocalStore'

export function FAQPage({store}:{store:Store}) {
 return <div><h1 className='mb-4 text-2xl font-semibold'>FAQ</h1>{store.faqs.map(f=><AccordionItem key={f.id} title={f.question} content={f.answer}/>)}</div>
}
