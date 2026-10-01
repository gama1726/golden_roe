import type { Metadata } from 'next'
import Link from 'next/link'
import { ArticleList } from '@/components/article-list'
import { MediaImage } from '@/components/media-image'
import { ServiceList } from '@/components/service-list'
import { getHome, safe } from '@/lib/api'
import { hasCopy } from '@/lib/format'

export async function generateMetadata(): Promise<Metadata> {
  const home = await safe(() => getHome())
  return {
    title: home?.data.seo.title || 'Golden Roe',
    description: home?.data.seo.description || undefined,
  }
}

export default async function HomePage() {
  const home = await safe(() => getHome())

  if (!home) {
    return (
      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <p>Не удалось загрузить страницу. Обновите её через минуту.</p>
      </section>
    )
  }

  const { banner, blocks, services, articles } = home.data
  const results = blocks.results

  return (
    <>
      <section className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.3fr_0.7fr] md:py-24">
        <div>
          <p className="text-xs tracking-[0.22em] text-gold uppercase">Golden Roe</p>
          {banner?.title && <h1 className="mt-4 font-serif text-5xl leading-none font-medium md:text-7xl">{banner.title}</h1>}
          {banner?.subtitle && <p className="mt-6 font-serif text-3xl leading-tight text-ink md:text-4xl">{banner.subtitle}</p>}
          {banner?.text && <p className="mt-6 max-w-xl text-lg text-muted">{banner.text}</p>}
          <Link href="/kontakty" className="mt-8 inline-block bg-ink px-6 py-3 text-sm text-ivory">
            Записаться
          </Link>
        </div>
        <MediaImage image={banner?.image ?? null} className="h-full max-h-[36rem] w-full object-cover" />
      </section>

      {hasCopy(blocks.approach) && (
        <section className="bg-cream">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 md:grid-cols-2 md:py-24">
            <div>
              {blocks.approach?.title && <h2 className="font-serif text-4xl leading-tight md:text-5xl">{blocks.approach.title}</h2>}
              {blocks.approach?.body && <p className="mt-6 whitespace-pre-line text-muted">{blocks.approach.body}</p>}
            </div>
            <MediaImage image={blocks.approach?.image ?? null} className="h-full max-h-96 w-full object-cover" />
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
          <h2 className="font-serif text-4xl md:text-5xl">Услуги</h2>
          <div className="mt-8">
            <ServiceList services={services} />
          </div>
        </section>
      )}

      {(results.title || results.body || results.items.length > 0) && (
        <section className="border-t border-line">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
            {results.title && <h2 className="font-serif text-4xl leading-tight md:text-5xl">{results.title}</h2>}
            {results.body && <p className="mt-6 max-w-2xl whitespace-pre-line text-muted">{results.body}</p>}
            {results.items.length > 0 && (
              <ul className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {results.items.map((item) => (
                  <li key={item.id} className="border-t border-gold pt-4">
                    <p className="font-serif text-3xl">{item.title}</p>
                    {item.body && <p className="mt-3 whitespace-pre-line text-muted">{item.body}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {hasCopy(blocks.choice) && (
        <section className="bg-ink text-ivory">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
            {blocks.choice?.title && <h2 className="max-w-3xl font-serif text-4xl leading-tight md:text-6xl">{blocks.choice.title}</h2>}
            {blocks.choice?.body && <p className="mt-6 max-w-2xl whitespace-pre-line text-ivory/80">{blocks.choice.body}</p>}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h2 className="font-serif text-4xl md:text-5xl">Статьи</h2>
            <Link href="/stati" className="text-sm underline decoration-gold underline-offset-4">
              Все статьи
            </Link>
          </div>
          <ArticleList initial={articles} meta={{ current_page: 1, last_page: 1, per_page: articles.length, total: articles.length }} />
        </section>
      )}
    </>
  )
}
