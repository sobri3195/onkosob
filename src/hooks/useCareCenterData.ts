import { useLocalStorage } from './useLocalStorage'
import type { CareEpisode, CaregiverAccess, ServiceTicket, VerifiedQuestion, WellbeingCheckin } from '@/types/careCenter'

const keys={episodes:'lentera.care-center.episodes',caregivers:'lentera.care-center.caregivers',tickets:'lentera.care-center.tickets',questions:'lentera.care-center.verified-questions',checkins:'lentera.care-center.checkins'}
export function useCareCenterData(){
  const [episodes,setEpisodes]=useLocalStorage<CareEpisode[]>(keys.episodes,[])
  const [caregivers,setCaregivers]=useLocalStorage<CaregiverAccess[]>(keys.caregivers,[])
  const [tickets,setTickets]=useLocalStorage<ServiceTicket[]>(keys.tickets,[])
  const [questions,setQuestions]=useLocalStorage<VerifiedQuestion[]>(keys.questions,[])
  const [checkins,setCheckins]=useLocalStorage<WellbeingCheckin[]>(keys.checkins,[])
  return {episodes,setEpisodes,caregivers,setCaregivers,tickets,setTickets,questions,setQuestions,checkins,setCheckins}
}
