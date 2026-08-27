import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react'

export const LOCAL_STORAGE_CHANGE_EVENT = 'lentera-local-storage-change'
export const LOCAL_STORAGE_RESET_EVENT = 'lentera-local-storage-reset'
type StorageChangeDetail = { key: string; value: unknown }

function parseStored<T>(key: string, initial: T, validate?: (value: unknown) => value is T): T {
  if (typeof window === 'undefined') return initial
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return initial
    const parsed: unknown = JSON.parse(raw)
    return !validate || validate(parsed) ? parsed as T : initial
  } catch { return initial }
}

/** localStorage state that remains consistent across components, tabs, and global resets. */
export function useLocalStorage<T>(key: string, initial: T, validate?: (value: unknown) => value is T) {
  const initialRef = useRef(initial)
  const [value, setState] = useState<T>(() => parseStored(key, initialRef.current, validate))
  const setValue: Dispatch<SetStateAction<T>> = useCallback((nextValue) => {
    setState(current => {
      const next = typeof nextValue === 'function' ? (nextValue as (value: T) => T)(current) : nextValue
      window.localStorage.setItem(key, JSON.stringify(next))
      window.dispatchEvent(new CustomEvent<StorageChangeDetail>(LOCAL_STORAGE_CHANGE_EVENT, { detail: { key, value: next } }))
      return next
    })
  }, [key])
  useEffect(() => {
    setState(parseStored(key, initialRef.current, validate))
    const onStorage = (event: StorageEvent) => { if (event.key === key || event.key === null) setState(parseStored(key, initialRef.current, validate)) }
    const onLocalChange = (event: Event) => {
      const detail = (event as CustomEvent<StorageChangeDetail>).detail
      if (detail?.key === key && (!validate || validate(detail.value))) setState(detail.value as T)
    }
    const onReset = () => setState(parseStored(key, initialRef.current, validate))
    window.addEventListener('storage', onStorage); window.addEventListener(LOCAL_STORAGE_CHANGE_EVENT, onLocalChange); window.addEventListener(LOCAL_STORAGE_RESET_EVENT, onReset)
    return () => { window.removeEventListener('storage', onStorage); window.removeEventListener(LOCAL_STORAGE_CHANGE_EVENT, onLocalChange); window.removeEventListener(LOCAL_STORAGE_RESET_EVENT, onReset) }
  }, [key, validate])
  const reset = useCallback(() => {
    window.localStorage.removeItem(key)
    window.dispatchEvent(new CustomEvent<StorageChangeDetail>(LOCAL_STORAGE_CHANGE_EVENT, { detail: { key, value: initialRef.current } }))
    setState(initialRef.current)
  }, [key])
  return [value, setValue, reset] as const
}
