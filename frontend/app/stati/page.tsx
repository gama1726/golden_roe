import type { Metadata } from 'next'
import { ArticleList } from '@/components/article-list'
import { HeroOverlay, HeroShell, heroPad } from '@/components/hero'
import { MediaImage } from '@/components/media-image'
import { SiteQuote, cleanQuoteText } from '@/components/site-quote'
import { getArticles, safe } from '@/lib/api'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const page = await safe(() => getArticles())
  return pageMetadata({
    pageKey: 'articles',
    path: '/stati',
    seo: page?.seo,
    image: page?.banner?.image ?? null,
  })
}

export default async function ArticlesPage() {
  const page = await safe(() => getArticles())

  if (!page) {
    return (
      <section className="mx-auto w-full max-w-[80rem] px-5 py-20">
        <p>Не удалось загрузить страницу. Обновите её через минуту.</p>
      </section>
    )
  }

  const { banner, quote } = page

  return (
    <>
      <section className="relative min-h-[38rem] overflow-hidden bg-ink text-ivory md:min-h-[44rem]">
        <MediaImage image={banner?.image ?? null} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_center]" />
        <HeroOverlay />
        <HeroShell>
          <div className={`grid w-full items-end gap-8 md:grid-cols-[minmax(0,28rem)_minmax(0,16rem)] ${heroPad}`}>
            <div>
              {banner?.title && <p className="text-xs tracking-[0.28em] text-gold uppercase">{banner.title}</p>}
              <h1 className="mt-5 font-serif text-5xl leading-[0.95] font-medium md:text-7xl">{banner?.subtitle || 'Статьи'}</h1>
              {banner?.text && <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/80 md:text-lg">{banner.text}</p>}
            </div>
            {quote?.title && (
              <SiteQuote tone="ivory" attribution={quote.eyebrow}>
                {cleanQuoteText(quote.title)}
              </SiteQuote>
            )}
          </div>
        </HeroShell>
      </section>
      <section className="mx-auto w-full max-w-[80rem] px-5 py-16 md:py-24">
        <ArticleList initial={page.data} meta={page.meta} />
      </section>
    </>
  )
}
