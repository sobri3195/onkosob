import { isSupabaseConfigured, sessionStore } from '@/lib/supabase'
const bucket='patient-documents'; const base=import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/,''); const key=import.meta.env.VITE_SUPABASE_ANON_KEY??''
export const MAX_DOCUMENT_BYTES=Number(import.meta.env.VITE_DOCUMENT_MAX_BYTES)||10*1024*1024
const allowed:Record<string,string[]>= {'application/pdf':['pdf'],'image/jpeg':['jpg','jpeg'],'image/png':['png'],'image/webp':['webp']}
const auth=()=>({apikey:key,Authorization:`Bearer ${sessionStore.get()?.access_token??key}`})
export function safeFilename(name:string){const dot=name.lastIndexOf('.');const ext=(dot>=0?name.slice(dot+1):'').toLowerCase();const stem=(dot>=0?name.slice(0,dot):name).normalize('NFKD').replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/^-+|-+$/g,'').slice(0,100)||'document';return `${stem}.${ext}`}
export function suggestTitle(name:string){return name.replace(/\.[^.]+$/,'').replace(/[_-]+/g,' ').replace(/\s+/g,' ').trim()}
export function validateDocumentFile(file:File){if(file.size>MAX_DOCUMENT_BYTES)throw new Error('File terlalu besar.');const ext=file.name.split('.').pop()?.toLowerCase()??'';if(!allowed[file.type]?.includes(ext))throw new Error('Format file belum didukung.');return true}
export async function hashFile(file:File){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',await file.arrayBuffer()))].map(x=>x.toString(16).padStart(2,'0')).join('')}
export const documentStorageService={
 async upload(userId:string,id:string,file:File){if(!isSupabaseConfigured)throw new Error('Dokumen gagal diunggah.');validateDocumentFile(file);const path=`${userId}/${id}/${safeFilename(file.name)}`;const r=await fetch(`${base}/storage/v1/object/${bucket}/${path}`,{method:'POST',headers:{...auth(),'Content-Type':file.type,'x-upsert':'false'},body:file});if(!r.ok)throw new Error('Dokumen gagal diunggah.');return path},
 async signedUrl(path:string,download=false){const r=await fetch(`${base}/storage/v1/object/sign/${bucket}/${path}`,{method:'POST',headers:{...auth(),'Content-Type':'application/json'},body:JSON.stringify({expiresIn:300})});if(!r.ok)throw new Error('Anda tidak memiliki akses ke dokumen ini.');const x=await r.json();return `${base}/storage/v1${x.signedURL}${download?'&download=':''}`},
 async remove(path:string){const r=await fetch(`${base}/storage/v1/object/${bucket}/${path}`,{method:'DELETE',headers:auth()});if(!r.ok)throw new Error('Dokumen gagal dihapus.')}
}
