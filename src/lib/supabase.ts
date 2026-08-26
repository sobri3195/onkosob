const url = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const placeholder = (value?: string) => !value || /your-(project|public)|example/i.test(value)
export const isSupabaseConfigured = !placeholder(url) && !placeholder(anonKey)
export type SessionUser = { id:string; email?:string; user_metadata?:Record<string,unknown> }
export type Session = { access_token:string; refresh_token:string; expires_in:number; user:SessionUser }
const SESSION_KEY='lentera.supabase.session'
const headers=(session?:Session)=>({apikey:anonKey??'',Authorization:`Bearer ${session?.access_token??anonKey??''}`,'Content-Type':'application/json'})
const safeJson=async(r:Response)=>{const body=await r.json().catch(()=>({}));if(!r.ok)throw new Error(typeof body?.message==='string'?body.message:'request_failed');return body}
export const sessionStore={get:():Session|null=>{try{return JSON.parse(localStorage.getItem(SESSION_KEY)??'null')}catch{return null}},set:(s:Session|null)=>s?localStorage.setItem(SESSION_KEY,JSON.stringify(s)):localStorage.removeItem(SESSION_KEY)}
const requireConfiguration=()=>{if(!isSupabaseConfigured)throw new Error('not_configured')}
const decodeUser=(token:string):SessionUser|null=>{try{const part=token.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'),payload=JSON.parse(atob(part.padEnd(Math.ceil(part.length/4)*4,'='))) as {sub?:string;email?:string;user_metadata?:Record<string,unknown>};return payload.sub?{id:payload.sub,email:payload.email,user_metadata:payload.user_metadata}:null}catch{return null}}
export function consumeAuthRedirect():Session|null {
 if(typeof window==='undefined'||!location.hash.includes('access_token='))return sessionStore.get()
 const params=new URLSearchParams(location.hash.slice(1)),access_token=params.get('access_token'),refresh_token=params.get('refresh_token'),user=access_token?decodeUser(access_token):null
 if(!access_token||!refresh_token||!user)return sessionStore.get()
 const session={access_token,refresh_token,expires_in:Number(params.get('expires_in'))||3600,user};sessionStore.set(session)
 history.replaceState(history.state,'',`${location.pathname}${location.search}`)
 return session
}
export const supabase={
 auth:{
  async signIn(email:string,password:string){requireConfiguration();const data=await safeJson(await fetch(`${url}/auth/v1/token?grant_type=password`,{method:'POST',headers:headers(),body:JSON.stringify({email,password})})) as Session;sessionStore.set(data);return data},
  async signUp(email:string,password:string,metadata:Record<string,string>){requireConfiguration();const data=await safeJson(await fetch(`${url}/auth/v1/signup`,{method:'POST',headers:headers(),body:JSON.stringify({email,password,data:metadata})})) as Session;if(data.access_token)sessionStore.set(data);return data},
  async resetPassword(email:string,redirectTo:string){requireConfiguration();return safeJson(await fetch(`${url}/auth/v1/recover`,{method:'POST',headers:headers(),body:JSON.stringify({email,redirect_to:redirectTo})}))},
  async updatePassword(password:string){requireConfiguration();return safeJson(await fetch(`${url}/auth/v1/user`,{method:'PUT',headers:headers(sessionStore.get()??undefined),body:JSON.stringify({password})}))},
  async refresh(){const old=sessionStore.get();if(!old)return null;try{const next=await safeJson(await fetch(`${url}/auth/v1/token?grant_type=refresh_token`,{method:'POST',headers:headers(),body:JSON.stringify({refresh_token:old.refresh_token})})) as Session;sessionStore.set(next);return next}catch{sessionStore.set(null);return null}},
  signOut(){sessionStore.set(null)},
 },
 async rest<T>(path:string,init:RequestInit={}){if(!isSupabaseConfigured)throw new Error('not_configured');return safeJson(await fetch(`${url}/rest/v1/${path}`,{...init,headers:{...headers(sessionStore.get()??undefined),Prefer:'return=representation',...(init.headers??{})}})) as Promise<T>},
 async invoke<T>(name:string,body:unknown){requireConfiguration();return safeJson(await fetch(`${url}/functions/v1/${name}`,{method:'POST',headers:headers(sessionStore.get()??undefined),body:JSON.stringify(body)})) as Promise<T>}
}
