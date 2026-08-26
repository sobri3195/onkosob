import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { consumeAuthRedirect, sessionStore, supabase, type Session, type SessionUser } from '@/lib/supabase'
export type AppRole='learner'|'patient'|'caregiver'|'survivor'|'editor'|'medical_reviewer'|'admin'
export type Profile={id:string;display_name:string|null;role:AppRole;sync_enabled:boolean;editorial_enabled:boolean}
type AuthValue={user:SessionUser|null;profile:Profile|null;role:AppRole|null;loading:boolean;signIn:(email:string,password:string)=>Promise<void>;signOut:()=>void;refreshProfile:()=>Promise<void>}
const AuthContext=createContext<AuthValue|null>(null)
export function AuthProvider({children}:{children:React.ReactNode}){const [session,setSession]=useState<Session|null>(consumeAuthRedirect),[profile,setProfile]=useState<Profile|null>(null),[loading,setLoading]=useState(true)
 const refreshProfile=useCallback(async()=>{const current=sessionStore.get();if(!current){setProfile(null);return}const rows=await supabase.rest<Profile[]>(`profiles?id=eq.${current.user.id}&select=id,display_name,role,sync_enabled,editorial_enabled`);setProfile(rows[0]??null)},[])
 useEffect(()=>{let active=true;(async()=>{try{const current=sessionStore.get();if(current){const refreshed=await supabase.auth.refresh();if(active)setSession(refreshed);if(refreshed)await refreshProfile()}}catch{sessionStore.set(null);if(active){setSession(null);setProfile(null)}}finally{if(active)setLoading(false)}})();return()=>{active=false}},[refreshProfile])
 const value=useMemo<AuthValue>(()=>({user:session?.user??null,profile,role:profile?.role??null,loading,signIn:async(e,p)=>{const s=await supabase.auth.signIn(e,p);setSession(s);await refreshProfile()},signOut:()=>{supabase.auth.signOut();setSession(null);setProfile(null)},refreshProfile}),[session,profile,loading,refreshProfile]);return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>}
export const useAuth=()=>{const value=useContext(AuthContext);if(!value)throw new Error('useAuth must be inside AuthProvider');return value}
