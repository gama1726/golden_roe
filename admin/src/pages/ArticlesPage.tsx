import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button, Notice } from '../components/ui'
import { api, errorText } from '../lib/api'
import type { Article, PageMeta } from '../lib/types'
import { ContentPage } from './ContentPage'

export function ArticlesPage() {
  const [items, setItems] = useState<Article[]>([])
  const [meta, setMeta] = useState<PageMeta | null>(null)
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get<{ data: Article[]; meta: PageMeta }>(`/api/v1/admin/articles?page=${page}`)
      .then((response) => {
        setItems(response.data.data)
        setMeta(response.data.meta)
      })
      .catch((reason: unknown) => setError(errorText(reason)))
  }, [page])

  async function remove(article: Article) {
    if (!window.confirm(`Удалить «${article.title}»?`)) return
    await api.delete(`/api/v1/admin/articles/${article.id}`)
    setItems((current) => current.filter((item) => item.id !== article.id))
  }

  return (
    <div className="space-y-12">
    <ContentPage page="articles" title="Статьи" />
    <section>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-serif text-2xl leading-none">Материалы</h2>
        <Link to="/articles/new" className="rounded-full bg-ink px-4 py-2 text-sm text-ivory">
          Новая статья
        </Link>
      </div>
      <Notice text={error} />
      <div className="space-y-3">
        {items.length === 0 && <p className="text-muted">Статей пока нет.</p>}
        {items.map((article) => (
          <article key={article.id} className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-5">
            <div>
              <h2 className="font-serif text-2xl">{article.title}</h2>
              <p className="text-sm text-muted">{article.is_published ? 'Опубликована' : 'Черновик'}</p>
            </div>
            <div className="flex gap-2">
              <Link to={`/articles/${article.id}`} className="rounded-full border border-line px-4 py-2 text-sm">
                Изменить
              </Link>
              <Button type="button" variant="danger" onClick={() => remove(article)}>
                Удалить
              </Button>
            </div>
          </article>
        ))}
      </div>
      {meta && meta.last_page > 1 && (
        <div className="mt-4 flex gap-2">
          <Button type="button" variant="ghost" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>
            Назад
          </Button>
          <Button type="button" variant="ghost" disabled={page >= meta.last_page} onClick={() => setPage((value) => value + 1)}>
            Дальше
          </Button>
        </div>
      )}
    </section>
    </div>
  )
}
