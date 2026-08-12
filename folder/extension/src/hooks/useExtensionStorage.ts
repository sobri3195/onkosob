import {useCallback,useEffect,useState} from 'react'
import {defaultState,getState} from '../services/storage'
import type {LenteraExtensionState} from '../types/extension'
export function useExtensionStorage(){const [state,setState]=useState<LenteraExtensionState>(defaultState);const refresh=useCallback(()=>getState().then(setState),[]);useEffect(()=>{refresh();const listener=()=>refresh();chrome.storage.onChanged.addListener(listener);return()=>chrome.storage.onChanged.removeListener(listener)},[refresh]);return {state,refresh}}
