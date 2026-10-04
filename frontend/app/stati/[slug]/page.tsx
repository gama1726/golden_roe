import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MediaImage } from '@/components/media-image'
import { getArticle } from '@/lib/api'
import { formatDate } from '@/lib/format'
import { PERSON_NAME, SITE_NAME, pageMetadata } from '@/lib/seo'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const page = await getArticle(slug)
    if (!page) return pageMetadata({ pageKey: 'articles', path: '/stati' })
    const title = page.seo.title || `${page.article.title} — ${SITE_NAME}`
    const description =
      page.seo.description ||
      page.article.excerpt ||
      `${page.article.title}. Статья Эльвиры Вартановой на сайте ${SITE_NAME}.`
    return pageMetadata({
      pageKey: 'articles',
      path: `/stati/${slug}`,
      title,
      description,
      image: page.article.image,
      type: 'article',
    })
  } catch {
    return { title: `Статья — ${SITE_NAME}`, authors: [{ name: PERSON_NAME }] }
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const page = await getArticle(slug).catch(() => null)
  if (!page) notFound()

  const date = formatDate(page.article.published_at)

  return (
    <article className="mx-auto w-full max-w-3xl px-5 pt-24 pb-16 md:pt-32 md:pb-24">
      {date && <p className="text-sm text-muted">{date}</p>}
      <h1 className="mt-3 font-serif text-5xl leading-tight md:text-6xl">{page.article.title}</h1>
      <MediaImage image={page.article.image} className="mt-8 w-full object-cover" />
      <div className="article-body mt-8 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: page.article.content }} />
    </article>
  )
}
