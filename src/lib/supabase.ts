const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const isSupabaseConfigured = Boolean(url && anonKey)
export type SessionUser = { id:string; email?:string; user_metadata?:Record<string,unknown> }
export type Session = { access_token:string; refresh_token:string; expires_in:number; user:SessionUser }
const SESSION_KEY='lentera.supabase.session'
const headers=(session?:Session)=>({apikey:anonKey??'',Authorization:`Bearer ${session?.access_token??anonKey??''}`,'Content-Type':'application/json'})
const safeJson=async(r:Response)=>{const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error(typeof body?.message==='string'?body.message:'request_failed');return body}
export const sessionStore={get:():Session|null=>{try{return JSON.parse(localStorage.getItem(SESSION_KEY)??'null')}catch{return null}},set:(s:Session|null)=>s?localStorage.setItem(SESSION_KEY,JSON.stringify(s)):localStorage.removeItem(SESSION_KEY)}
export const supabase={
 auth:{
  async signIn(email:string,password:string){if(!isSupabaseConfigured)throw new Error('not_configured');const data=await safeJson(await fetch(`${url}/auth/v1/token?grant_type=password`,{method:'POST',headers:headers(),body:JSON.stringify({email,password})})) as Session;sessionStore.set(data);return data},
  async signUp(email:string,password:string,metadata:Record<string,string>){if(!isSupabaseConfigured)throw new Error('not_configured');return safeJson(await fetch(`${url}/auth/v1/signup`,{method:'POST',headers:headers(),body:JSON.stringify({email,password,data:metadata})})) as Promise<Session>},
  async resetPassword(email:string,redirectTo:string){return safeJson(await fetch(`${url}/auth/v1/recover`,{method:'POST',headers:headers(),body:JSON.stringify({email,redirect_to:redirectTo})}))},
  async updatePassword(password:string){return safeJson(await fetch(`${url}/auth/v1/user`,{method:'PUT',headers:headers(sessionStore.get()??undefined),body:JSON.stringify({password})}))},
  async refresh(){const old=sessionStore.get();if(!old)return null;try{const next=await safeJson(await fetch(`${url}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:headers(),body:JSON.stringify({refresh_token:old.refresh_token})})) as Session;sessionStore.set(next);return next}catch{sessionStore.set(null);return null}},
  signOut(){sessionStore.set(null)},
 },
 async rest<T>(path:string,init:RequestInit={}){if(!isSupabaseConfigured)throw new Error('not_configured');return safeJson(await fetch(`${url}/rest/v1/${path}`,{...init,headers:{...headers(sessionStore.get()??undefined),Prefer:'return=representation',...(init.headers??{})}})) as Promise<T>},
 async invoke<T>(name:string,body:unknown){return safeJson(await fetch(`${url}/functions/v1/${name}`,{method:'POST',headers:headers(sessionStore.get()??undefined),body:JSON.stringify(body)})) as Promise<T>}
}
