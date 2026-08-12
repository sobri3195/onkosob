import { createContext,useContext,useEffect,useState,type ReactNode } from 'react'
import { getPatientState,savePatientState,initialPatientState } from './services/patientStorage'
import type { PatientAppState } from './types/patientApp'
type Ctx={state:PatientAppState; update:(fn:(s:PatientAppState)=>PatientAppState)=>void; reset:()=>void}
const Context=createContext<Ctx|null>(null)
export function PatientAppProvider({children}:{children:ReactNode}){const [state,setState]=useState(getPatientState);useEffect(()=>savePatientState(state),[state]);return <Context.Provider value={{state,update:setState,reset:()=>setState(structuredClone(initialPatientState))}}>{children}</Context.Provider>}
export function usePatientApp(){const value=useContext(Context);if(!value)throw Error('usePatientApp requires PatientAppProvider');return value}
