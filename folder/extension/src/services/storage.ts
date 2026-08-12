import {LENTERA_BASE_URL,STORAGE_KEY,isSafeWebUrl} from '../config'
import type {LenteraExtensionState,SavedKind} from '../types/extension'
export const defaultState: LenteraExtensionState={version:1,pages:[],selections:[],questions:[],savedTerms:[],preferences:{baseUrl:LENTERA_BASE_URL,appearance:'system'}}
const id=()=>crypto.randomUUID()
export {id}
export async function getState():Promise<LenteraExtensionState>{const value=(await chrome.storage.local.get(STORAGE_KEY))[STORAGE_KEY];return validateState(value)??structuredClone(defaultState)}
export async function setState(state:LenteraExtensionState){await chrome.storage.local.set({[STORAGE_KEY]:state})}
export async function updateState(change:(state:LenteraExtensionState)=>LenteraExtensionState){const next=change(await getState());await setState(next);return next}
export async function removeItem(kind:SavedKind,itemId:string){return updateState(s=>({...s,[kind]:s[kind].filter(x=>x.id!==itemId)}))}
export function validateState(v:unknown):LenteraExtensionState|null{if(!v||typeof v!=='object')return null;const x=v as Record<string,unknown>;if(x.version!==1||!['pages','selections','questions','savedTerms'].every(k=>Array.isArray(x[k])))return null;const p=x.preferences as Record<string,unknown>|undefined;const base=typeof p?.baseUrl==='string'&&isSafeWebUrl(p.baseUrl)?p.baseUrl:LENTERA_BASE_URL;const appearance=['dark','light','system'].includes(String(p?.appearance))?p?.appearance as 'dark'|'light'|'system':'system';const clean=(arr:unknown[])=>arr.filter(i=>i&&typeof i==='object'&&typeof (i as {id?:unknown}).id==='string');return {...defaultState,pages:clean(x.pages as unknown[]) as LenteraExtensionState['pages'],selections:clean(x.selections as unknown[]) as LenteraExtensionState['selections'],questions:clean(x.questions as unknown[]) as LenteraExtensionState['questions'],savedTerms:clean(x.savedTerms as unknown[]) as LenteraExtensionState['savedTerms'],preferences:{baseUrl:base,appearance}}}
