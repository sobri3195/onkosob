import type {LucideIcon} from 'lucide-react'
export function QuickAction({icon:Icon,label,onClick,accent}:{icon:LucideIcon;label:string;onClick:()=>void;accent?:boolean}){return <button className={`quick ${accent?'accent':''}`} onClick={onClick}><Icon/><span>{label}</span></button>}
