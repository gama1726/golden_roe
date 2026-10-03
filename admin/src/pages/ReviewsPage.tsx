import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Button, FilePicker, Notice, cardClass, cardHeadingClass } from '../components/ui'
import { ContentPage } from './ContentPage'
import { api, errorText } from '../lib/api'
import type { Review } from '../lib/types'

const filters = [
  { id: '', label: 'Все' },
  { id: 'pending', label: 'На проверке' },
  { id: 'approved', label: 'Одобренные' },
]

export function ReviewsPage() {
  const [params, setParams] = useSearchParams()
  const status = params.get('status') ?? ''
  const [items, setItems] = useState<Review[]>([])
  const [pendingCount, setPendingCount] = useState(0)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const query = status ? `?status=${status}` : ''
    const response = await api.get<{ data: Review[]; pending_count: number }>(`/api/v1/admin/reviews${query}`)
    setItems(response.data.data)
    setPendingCount(response.data.pending_count)
  }

  useEffect(() => {
    load().catch((reason: unknown) => setError(errorText(reason)))
  }, [status])

  async function act(id: number, action: 'approve' | 'pending' | 'delete') {
    if (action === 'delete' && !window.confirm('Удалить отзыв?')) return
    if (action === 'delete') await api.delete(`/api/v1/admin/reviews/${id}`)
    else await api.post(`/api/v1/admin/reviews/${id}/${action}`)
    await load()
    setNotice('Сохранено')
  }

  async function upload(id: number, file: File | undefined) {
    if (!file) return
    const body = new FormData()
    body.append('image', file)
    await api.post(`/api/v1/admin/reviews/${id}/image`, body)
    await load()
    setNotice('Изображение обновлено')
  }

  return (
    <div className="space-y-12">
    <ContentPage page="reviews" title="Отзывы" />
    <section className="space-y-4">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h2 className="font-serif text-4xl leading-none">Модерация</h2>
        <span className="text-sm text-muted">На проверке: {pendingCount}</span>
      </div>
      <div className="flex gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.id || 'all'}
            type="button"
            variant={status === filter.id ? 'primary' : 'ghost'}
            onClick={() => setParams(filter.id ? { status: filter.id } : {})}
          >
            {filter.label}
          </Button>
        ))}
      </div>
      <Notice text={notice} />
      <Notice text={error} />
      {items.length === 0 && <p className="text-muted">Отзывов нет.</p>}
      {items.map((review) => (
        <article key={review.id} className={cardClass}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className={cardHeadingClass}>{review.title}</h2>
              <p className="text-sm text-muted">
                {review.full_name} · {review.rating}/5 · {review.status === 'pending' ? 'На проверке' : 'Одобрен'}
              </p>
              <p className="text-sm">{review.service}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {review.status === 'pending' ? (
                <Button type="button" onClick={() => act(review.id, 'approve')}>Одобрить</Button>
              ) : (
                <Button type="button" variant="ghost" onClick={() => act(review.id, 'pending')}>На проверку</Button>
              )}
              <Button type="button" variant="danger" onClick={() => act(review.id, 'delete')}>Удалить</Button>
            </div>
          </div>
          <p>{review.text}</p>
          <p className="text-xs text-muted">
            {review.phone} · {review.email}
          </p>
          <FilePicker
            label="Изображение"
            accept="image/jpeg,image/png,image/webp"
            buttonLabel="Выбрать изображение"
            hint={review.image?.original ? 'Файл загружен' : 'JPEG, PNG или WebP'}
            preview={review.image?.original ?? null}
            onPick={(file) => void upload(review.id, file)}
          />
        </article>
      ))}
    </section>
    </div>
  )
}
