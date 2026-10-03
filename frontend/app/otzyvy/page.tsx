import type { Metadata } from 'next'
import { ReviewsView } from '@/components/reviews-view'
import { getReviews, getServices, safe } from '@/lib/api'

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
      <section className="mx-auto w-full max-w-[80rem] px-5 py-20">
        <p>Не удалось загрузить страницу. Обновите её через минуту.</p>
      </section>
    )
  }

  return (
    <ReviewsView
      banner={page.banner}
      quote={page.quote}
      intro={page.intro}
      reviews={page.data}
      cta={page.cta}
      note={page.note}
      services={services?.data ?? []}
    />
  )
}
