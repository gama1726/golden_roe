import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { api } from './api'
import type { User } from './types'

type AuthState = {
  user: User | null
  ready: boolean
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    api
      .get<{ data: User }>('/api/v1/admin/me')
      .then((response) => setUser(response.data.data))
      .catch(() => setUser(null))
      .finally(() => setReady(true))

    const onLogout = () => setUser(null)
    window.addEventListener('auth:logout', onLogout)
    return () => window.removeEventListener('auth:logout', onLogout)
  }, [])

  return <AuthContext.Provider value={{ user, ready, setUser }}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthState {
  const value = useContext(AuthContext)
  if (!value) {
    throw new Error('AuthProvider is missing')
  }
  return value
}
