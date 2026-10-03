import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from 'react'

type Saver = {
  dirty: boolean
  save: () => Promise<void>
}

type SaveBarContextValue = {
  register: (id: string, saver: Saver) => void
  unregister: (id: string) => void
}

export const SaveBarContext = createContext<SaveBarContextValue | null>(null)

export function usePageSave(id: string, dirty: boolean, save: () => Promise<void>) {
  const bar = useContext(SaveBarContext)
  const saveRef = useRef(save)
  saveRef.current = save

  useEffect(() => {
    if (!bar) return
    bar.register(id, {
      dirty,
      save: () => saveRef.current(),
    })
  }, [bar, id, dirty])

  useEffect(() => {
    if (!bar) return
    return () => bar.unregister(id)
  }, [bar, id])
}

export function SaveBarProvider({
  children,
  onChange,
}: {
  children: ReactNode
  onChange: (savers: Record<string, Saver>) => void
}) {
  const savers = useRef<Record<string, Saver>>({})

  const value = useMemo<SaveBarContextValue>(
    () => ({
      register: (id, saver) => {
        savers.current = { ...savers.current, [id]: saver }
        onChange(savers.current)
      },
      unregister: (id) => {
        const next = { ...savers.current }
        delete next[id]
        savers.current = next
        onChange(savers.current)
      },
    }),
    [onChange],
  )

  return <SaveBarContext.Provider value={value}>{children}</SaveBarContext.Provider>
}
