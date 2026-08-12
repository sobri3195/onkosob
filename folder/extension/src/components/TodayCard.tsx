import {CalendarDays,ChevronRight} from 'lucide-react'
export function TodayCard({open}:{open:()=>void}){return <section className="card today"><div><span className="eyebrow"><CalendarDays/> HARI INI</span><h2>Tidak ada jadwal yang tersimpan.</h2><p>Lihat pendamping pasien untuk agenda dan tindak lanjut.</p></div><button onClick={open}>Buka Hari Ini <ChevronRight/></button></section>}
