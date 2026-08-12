import { useEffect, useState } from 'react'
import { followUpRepository } from '@/services/followUpRepository'
export function useFollowUpData(){const [data,setData]=useState(followUpRepository.read);useEffect(()=>followUpRepository.subscribe(setData),[]);return data}
