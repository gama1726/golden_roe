import type { Metadata } from 'next'
import { ArticleList } from '@/components/article-list'
import { MediaImage } from '@/components/media-image'
import { getArticles, safe } from '@/lib/api'

export async function generateMetadata(): Promise<Metadata> {
  const page = await safe(() => getArticles())
  return {
    title: page?.seo.title || 'Статьи',
    description: page?.seo.description || undefined,
  }
}

export default async function ArticlesPage() {
  const page = await safe(() => getArticles())

  if (!page) {
    return (
      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <p>Не удалось загрузить страницу. Обновите её через минуту.</p>
      </section>
    )
  }

  const { banner, quote } = page

  return (
    <>
      <section className="relative min-h-[34rem] overflow-hidden bg-ink text-ivory md:min-h-[40rem]">
        <MediaImage image={banner?.image ?? null} className="absolute inset-0 h-full w-full object-cover object-[72%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/82 to-ink/10" />
        <div className="relative mx-auto flex min-h-[34rem] w-full max-w-[80rem] items-center md:min-h-[40rem]">
          <div className="max-w-xl px-5 py-16 md:px-10 md:py-20">
            {banner?.title && <p className="text-xs tracking-[0.28em] text-gold uppercase">{banner.title}</p>}
            <h1 className="mt-5 font-serif text-5xl leading-[0.95] font-medium md:text-7xl">{banner?.subtitle || 'Статьи'}</h1>
            {banner?.text && <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/80 md:text-lg">{banner.text}</p>}
            {quote?.title && <p className="mt-8 max-w-sm font-serif text-2xl leading-snug text-ivory italic md:text-3xl">{quote.title}</p>}
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-[80rem] px-5 py-16 md:py-24">
        <ArticleList initial={page.data} meta={page.meta} />
      </section>
    </>
  )
}
