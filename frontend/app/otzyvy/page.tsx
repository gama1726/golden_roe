import type { Metadata } from 'next'
import { MediaImage } from '@/components/media-image'
import { ReviewForm } from '@/components/review-form'
import { getReviews, getServices, safe } from '@/lib/api'
import { formatDate } from '@/lib/format'

export async function generateMetadata(): Promise<Metadata> {
  const page = await safe(() => getReviews())
  return {
    title: page?.seo.title || 'Отзывы',
    description: page?.seo.description || undefined,
  }
}

export default async function ReviewsPage() {
  const [page, services] = await Promise.all([safe(() => getReviews()), safe(() => getServices())])

  if (!page) {
    return (
      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <p>Не удалось загрузить страницу. Обновите её через минуту.</p>
      </section>
    )
  }

  return (
    <section className="mx-auto grid w-full max-w-6xl gap-16 px-5 py-16 md:py-24 lg:grid-cols-[1fr_22rem]">
      <div>
        <h1 className="font-serif text-5xl leading-none md:text-7xl">Отзывы</h1>
        {page.meta.enabled && page.data.length > 0 ? (
          <div className="mt-12 divide-y divide-line border-y border-line">
            {page.data.map((review) => {
              const date = formatDate(review.created_at)
              return (
                <article key={review.id} className="py-8">
                  <p className="text-sm text-gold">{review.rating} из 5</p>
                  <h2 className="mt-2 font-serif text-3xl">{review.title}</h2>
                  <p className="mt-4 whitespace-pre-line">{review.text}</p>
                  <p className="mt-4 text-sm text-muted">
                    {review.full_name}
                    {review.service ? ` · ${review.service}` : ''}
                    {date ? ` · ${date}` : ''}
                  </p>
                  <MediaImage image={review.image} className="mt-4 max-h-72 w-full object-cover" />
                </article>
              )
            })}
          </div>
        ) : (
          <p className="mt-8 text-muted">Одобренных отзывов пока нет.</p>
        )}
      </div>
      <aside>
        <h2 className="font-serif text-3xl">Оставить отзыв</h2>
        <p className="mt-3 text-sm text-muted">Отзыв появится на сайте после проверки.</p>
        <div className="mt-6">
          <ReviewForm services={services?.data ?? []} />
        </div>
      </aside>
    </section>
  )
}
