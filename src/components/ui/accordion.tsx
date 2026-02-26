import { useState } from 'react'
export function AccordionItem({title, content}:{title:string;content:string}) {
  const [open, setOpen] = useState(false)
  return <div className='border-b py-2'><button className='w-full text-left font-medium' onClick={()=>setOpen(!open)}>{title}</button>{open && <p className='pt-2 text-sm'>{content}</p>}</div>
}
