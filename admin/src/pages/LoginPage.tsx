import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button, Field, Notice, controlClass } from '../components/ui'
import { api, ensureCsrf, errorText } from '../lib/api'
import { useAuth } from '../lib/auth'
import type { User } from '../lib/types'

export function LoginPage() {
  const { user, ready, setUser } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@goldenroe.local')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  if (ready && user) return <Navigate to="/" replace />

  async function submit(event: FormEvent) {
    event.preventDefault()
    setPending(true)
    setError(null)
    try {
      await ensureCsrf()
      const response = await api.post<{ data: User }>('/api/v1/admin/login', { email, password })
      setUser(response.data.data)
      navigate('/')
    } catch (reason) {
      setError(errorText(reason))
    } finally {
      setPending(false)
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="w-full max-w-md space-y-4 rounded-3xl bg-white p-8 shadow-sm">
        <p className="text-xs tracking-[0.2em] text-gold uppercase">Golden Roe</p>
        <h1 className="font-serif text-4xl">Вход</h1>
        <Notice text={error} />
        <Field label="Email">
          <input className={controlClass} type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </Field>
        <Field label="Пароль">
          <input className={controlClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </Field>
        <Button type="submit" disabled={pending}>
          {pending ? 'Входим…' : 'Войти'}
        </Button>
      </form>
    </main>
  )
}
