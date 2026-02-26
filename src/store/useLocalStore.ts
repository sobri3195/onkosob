import { useEffect, useMemo, useState } from 'react'
import { seed } from '@/data/seed'

const KEY = 'onko-radiasi-demo'

export type Store = typeof seed

const read = (): Store => {
  const raw = localStorage.getItem(KEY)
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seed))
    return seed
  }
  return { ...seed, ...JSON.parse(raw) }
}

export const saveStore = (next: Store) => localStorage.setItem(KEY, JSON.stringify(next))

export function useLocalStore() {
  const [store, setStore] = useState<Store>(seed)

  useEffect(() => {
    const initial = read()
    setStore(initial)
    document.documentElement.classList.toggle('dark', initial.settings.theme === 'dark')
  }, [])

  const actions = useMemo(() => ({
    update: (updater: (s: Store) => Store) => setStore(prev => { const next = updater(prev); saveStore(next); return next }),
    loginAdmin: () => setStore(prev => { const next = { ...prev, isAdmin: true }; saveStore(next); return next }),
    logoutAdmin: () => setStore(prev => { const next = { ...prev, isAdmin: false }; saveStore(next); return next })
  }), [])

  return { store, ...actions }
}
