import type { PatientAppState } from '../types/patientApp'
export const PATIENT_STORAGE_KEY='lentera_patient_app_v1'
const categories=['Sebelum konsultasi','Sebelum kemoterapi','Sebelum radioterapi','Sebelum operasi','Follow-up']
export const initialPatientState:PatientAppState={profile:{displayName:''},journey:{},symptoms:[],appointments:[],medications:[],questions:[],checklists:categories.map((category,i)=>({id:`c${i}`,category,items:[]})),followUps:[],documents:[],savedItems:[],learning:{Diagnosis:0,Terapi:0,Caregiver:0,Survivorship:0},preferences:{notifications:false,interests:[],onboardingComplete:false,theme:'dark'}}
export function getPatientState(){if(typeof window==='undefined')return initialPatientState;try{return {...initialPatientState,...JSON.parse(localStorage.getItem(PATIENT_STORAGE_KEY)||'{}')} as PatientAppState}catch{return initialPatientState}}
export function savePatientState(state:PatientAppState){localStorage.setItem(PATIENT_STORAGE_KEY,JSON.stringify(state))}
export function resetPatientState(){localStorage.removeItem(PATIENT_STORAGE_KEY);return initialPatientState}
export function exportPatientState(state:PatientAppState){return JSON.stringify(state,null,2)}
