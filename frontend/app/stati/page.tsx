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

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
      <h1 className="font-serif text-5xl leading-none md:text-7xl">{page.banner?.title || 'Статьи'}</h1>
      {page.banner?.text && <p className="mt-6 max-w-2xl text-muted">{page.banner.text}</p>}
      <MediaImage image={page.banner?.image ?? null} className="mt-8 max-h-96 w-full object-cover" />
      <div className="mt-12">
        <ArticleList initial={page.data} meta={page.meta} />
      </div>
    </section>
  )
}
