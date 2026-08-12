import {getState} from './storage'
import {isSafeWebUrl} from '../config'
export async function openLentera(path='/apps'){const {preferences}=await getState();const base=isSafeWebUrl(preferences.baseUrl)?preferences.baseUrl:'https://onkosob.vercel.app';await chrome.tabs.create({url:new URL(path,base).toString()})}
export const syncToPatientApp=async()=>({available:false,message:'Sinkronisasi belum diaktifkan. Data tetap tersimpan di perangkat ini.'})
