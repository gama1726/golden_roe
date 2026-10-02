'use client'

import { MediaImage } from '@/components/media-image'
import { formatDate } from '@/lib/format'
import { publicApiBase } from '@/lib/config'
import type { ArticleCard, PageMeta } from '@/lib/types'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function ArticleList({ initial, meta }: { initial: ArticleCard[]; meta: PageMeta }) {
  const [items, setItems] = useState(initial)
  const [page, setPage] = useState(meta.current_page)
  const [lastPage, setLastPage] = useState(meta.last_page)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function loadMore() {
    setPending(true)
    setError(null)
    try {
      const response = await fetch(`${publicApiBase()}/api/v1/articles?page=${page + 1}`)
      if (!response.ok) throw new Error('Не удалось загрузить статьи')
      const payload = (await response.json()) as { data: ArticleCard[]; meta: PageMeta }
      setItems((current) => [...current, ...payload.data])
      setPage(payload.meta.current_page)
      setLastPage(payload.meta.last_page)
    } catch {
      setError('Не удалось загрузить статьи')
    } finally {
      setPending(false)
    }
  }

  if (items.length === 0) {
    return <p className="text-muted">Статей пока нет.</p>
  }

  return (
    <div>
      <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {items.map((article) => {
          const date = formatDate(article.published_at)
          return (
            <article key={article.id}>
              <Link href={`/stati/${article.slug}`} className="group block">
                <MediaImage image={article.image} className="aspect-[4/3] w-full object-cover" />
                {date && <p className="mt-4 text-sm text-muted">{date}</p>}
                <h2 className="mt-2 font-serif text-2xl leading-tight group-hover:text-gold">{article.title}</h2>
                {article.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{article.excerpt}</p>}
                <span className="mt-4 inline-flex items-center gap-2 text-sm">
                  Читать статью
                  <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Link>
            </article>
          )
        })}
      </div>
      {error && <p className="mt-6 text-sm">{error}</p>}
      {page < lastPage && (
        <div className="mt-12 text-center">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 text-sm"
            onClick={loadMore}
            disabled={pending}
          >
            {pending ? 'Загрузка…' : 'Показать ещё'}
            {!pending && <ArrowRight aria-hidden="true" size={16} />}
          </button>
        </div>
      )}
    </div>
  )
}
