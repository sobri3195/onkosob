import { useLocalStorage } from './useLocalStorage'
import type { CareEvent, DailyNote, MedicationLog, MedicationSchedule, SymptomEntry } from '@/types/companion'

export const companionKeys = { events:'lentera.companion.events', symptoms:'lentera.companion.symptoms', medications:'lentera.companion.medications', logs:'lentera.companion.medication-logs', daily:'lentera.companion.daily' } as const
export function useCompanionData(){
  const [events,setEvents]=useLocalStorage<CareEvent[]>(companionKeys.events,[])
  const [symptoms,setSymptoms]=useLocalStorage<SymptomEntry[]>(companionKeys.symptoms,[])
  const [medications,setMedications]=useLocalStorage<MedicationSchedule[]>(companionKeys.medications,[])
  const [logs,setLogs]=useLocalStorage<MedicationLog[]>(companionKeys.logs,[])
  const [daily,setDaily]=useLocalStorage<DailyNote[]>(companionKeys.daily,[])
  return {events,setEvents,symptoms,setSymptoms,medications,setMedications,logs,setLogs,daily,setDaily}
}
export function localDate(date=new Date()){const offset=date.getTimezoneOffset();return new Date(date.getTime()-offset*60000).toISOString().slice(0,10)}
export function clearCompanionData(keys:(keyof typeof companionKeys)[] = Object.keys(companionKeys) as (keyof typeof companionKeys)[]){keys.forEach(key=>localStorage.removeItem(companionKeys[key]));window.dispatchEvent(new Event('lentera-companion-reset'))}
