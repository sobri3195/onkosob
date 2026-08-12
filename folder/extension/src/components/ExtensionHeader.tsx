import {Flame} from 'lucide-react'
export function ExtensionHeader(){return <header className="brand-header"><span className="logo"><Flame/></span><div><strong>Lentera Companion</strong><small>Tersimpan di perangkat ini</small></div><button className="icon-button" aria-label="Buka pengaturan" onClick={()=>chrome.runtime.openOptionsPage()}>⚙</button></header>}
