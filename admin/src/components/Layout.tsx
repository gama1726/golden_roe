import {
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
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuth } from '../lib/auth'

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
      <aside className="border-b border-line bg-white md:border-r md:border-b-0">
        <div className="px-5 py-5">
          <p className="font-serif text-2xl tracking-wide">Golden Roe</p>
          <p className="text-xs text-muted">{user?.email}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:block md:space-y-1">
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
      <main className="px-4 py-6 md:px-10">
        <div className="mx-auto max-w-4xl">
          <Outlet context={{ refreshPending: setPending }} />
        </div>
      </main>
    </div>
  )
}
