import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageTitle } from '../components/ui'
import { api } from '../lib/api'
import type { Dashboard } from '../lib/types'

export function DashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null)

  useEffect(() => {
    api.get<{ data: Dashboard }>('/api/v1/admin/dashboard').then((response) => setData(response.data.data))
  }, [])

  const cards = [
    { label: 'Отзывы на проверке', value: data?.pending_reviews ?? '—', to: '/reviews?status=pending' },
    { label: 'Услуги', value: data?.services ?? '—', to: '/services' },
    { label: 'Статьи', value: data?.articles ?? '—', to: '/articles' },
    { label: 'Опубликованные статьи', value: data?.published_articles ?? '—', to: '/articles' },
  ]

  return (
    <section>
      <PageTitle title="Обзор" />
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <Link key={card.label} to={card.to} className="rounded-3xl bg-white p-6 hover:bg-cream">
            <p className="font-serif text-5xl">{card.value}</p>
            <p className="mt-2 text-sm text-muted">{card.label}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}
