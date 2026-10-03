import {
  Check,
  FileText,
  House,
  LogOut,
  MessageSquare,
  Phone,
  Settings,
  SquareUser,
  Stamp,
  TextQuote,
  LayoutDashboard,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { api, errorText } from '../lib/api'
import { useAuth } from '../lib/auth'
import { SaveBarProvider } from '../lib/save-bar'

const links = [
  { to: '/', label: 'Обзор', icon: LayoutDashboard, end: true },
  { to: '/home', label: 'Главная', icon: House },
  { to: '/services', label: 'Услуги', icon: Stamp },
  { to: '/author', label: 'Об авторе', icon: SquareUser },
  { to: '/articles', label: 'Статьи', icon: FileText },
  { to: '/reviews', label: 'Отзывы', icon: MessageSquare },
  { to: '/contacts', label: 'Контакты', icon: Phone },
  { to: '/documents', label: 'Документы', icon: TextQuote },
  { to: '/settings', label: 'Настройки', icon: Settings },
]

export function Layout() {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()
  const [pending, setPending] = useState(0)
  const [savers, setSavers] = useState<Record<string, { dirty: boolean; save: () => Promise<void> }>>({})
  const saversRef = useRef(savers)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const rememberSavers = useCallback((next: Record<string, { dirty: boolean; save: () => Promise<void> }>) => {
    saversRef.current = next
    setSavers(next)
  }, [])
  const dirty = Object.values(savers).some((saver) => saver.dirty)
  const hasSave = Object.keys(savers).length > 0

  useEffect(() => {
    if (!saved) return
    const timer = window.setTimeout(() => setSaved(false), 2000)
    return () => window.clearTimeout(timer)
  }, [saved])

  async function savePage() {
    setSaving(true)
    setSaved(false)
    setSaveError(null)
    try {
      for (const saver of Object.values(saversRef.current)) {
        if (saver.dirty) await saver.save()
      }
      setSaved(true)
    } catch (reason) {
      setSaveError(errorText(reason))
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    api
      .get<{ pending_count?: number }>('/api/v1/admin/reviews?status=pending')
      .then((response) => setPending(response.data.pending_count ?? 0))
      .catch(() => setPending(0))
  }, [])

  async function logout() {
    await api.post('/api/v1/admin/logout')
    setUser(null)
    navigate('/login')
  }

  return (
    <div className="md:grid md:min-h-screen md:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-white md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-r md:border-b-0">
        <div className="px-5 py-5">
          <p className="font-serif text-2xl tracking-wide">Golden Roe</p>
          <p className="text-xs text-muted">{user?.email}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:min-h-0 md:flex-1 md:overflow-y-auto md:overflow-x-visible md:block md:space-y-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-full px-3 py-2 text-sm whitespace-nowrap ${
                  isActive ? 'bg-ink text-ivory' : 'hover:bg-cream'
                }`
              }
            >
              <link.icon size={16} strokeWidth={1.5} />
              {link.label}
              {link.to === '/reviews' && pending > 0 && (
                <span className="rounded-full bg-gold px-2 text-xs text-ink">{pending}</span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="hidden px-3 py-4 md:block">
          <button className="flex items-center gap-2 px-3 py-2 text-sm text-muted" onClick={logout} type="button">
            <LogOut size={16} strokeWidth={1.5} />
            Выйти
          </button>
        </div>
      </aside>
      <SaveBarProvider onChange={rememberSavers}>
        <main className={`px-4 py-6 md:px-10 ${hasSave ? 'pb-28' : ''}`}>
          <div className="mx-auto max-w-4xl">
            <Outlet context={{ refreshPending: setPending }} />
          </div>
        </main>
        {hasSave && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-ivory/95 backdrop-blur md:left-[240px]">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 md:px-10">
              <p className={`text-sm ${saveError ? 'text-red-800' : 'text-muted'}`}>
                {saveError ?? (dirty ? 'Есть несохранённые изменения' : saved ? 'Сохранено' : 'Изменений нет')}
              </p>
              <button
                type="button"
                disabled={!dirty || saving}
                onClick={() => void savePage()}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm transition ${
                  dirty || saving
                    ? 'bg-gold text-ink shadow-sm hover:bg-gold/90'
                    : 'cursor-not-allowed border border-line bg-white text-muted'
                }`}
              >
                {saving ? (
                  <>
                    <span className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />
                    Сохраняю…
                  </>
                ) : saved && !dirty ? (
                  <>
                    <Check aria-hidden="true" size={16} />
                    Сохранено
                  </>
                ) : (
                  'Сохранить'
                )}
              </button>
            </div>
          </div>
        )}
      </SaveBarProvider>
    </div>
  )
}
