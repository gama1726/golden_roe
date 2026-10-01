'use client'

import { MediaImage } from '@/components/media-image'
import { formatDate } from '@/lib/format'
import { publicApiBase } from '@/lib/config'
import type { ArticleCard, PageMeta } from '@/lib/types'
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
      <div className="divide-y divide-line border-y border-line">
        {items.map((article) => {
          const date = formatDate(article.published_at)
          return (
            <article key={article.id} className="grid gap-6 py-8 md:grid-cols-[16rem_1fr] md:py-10">
              <MediaImage image={article.image} className="h-48 w-full object-cover" />
              <div>
                {date && <p className="text-sm text-muted">{date}</p>}
                <h2 className="mt-2 font-serif text-3xl leading-tight">
                  <Link href={`/stati/${article.slug}`} className="hover:text-gold">
                    {article.title}
                  </Link>
                </h2>
                {article.excerpt && <p className="mt-3 text-muted">{article.excerpt}</p>}
              </div>
            </article>
          )
        })}
      </div>
      {error && <p className="mt-4 text-sm">{error}</p>}
      {page < lastPage && (
        <button type="button" className="mt-8 border border-ink px-5 py-3 text-sm" onClick={loadMore} disabled={pending}>
          {pending ? 'Загрузка…' : 'Показать ещё'}
        </button>
      )}
    </div>
  )
}
