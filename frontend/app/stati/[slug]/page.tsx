import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MediaImage } from '@/components/media-image'
import { getArticle } from '@/lib/api'
import { formatDate } from '@/lib/format'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  try {
    const page = await getArticle(slug)
    if (!page) return { title: 'Статья' }
    return {
      title: page.seo.title || page.article.title,
      description: page.seo.description || undefined,
    }
  } catch {
    return { title: 'Статья' }
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const page = await getArticle(slug).catch(() => null)
  if (!page) notFound()

  const date = formatDate(page.article.published_at)

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-16 md:py-24">
      {date && <p className="text-sm text-muted">{date}</p>}
      <h1 className="mt-3 font-serif text-5xl leading-tight md:text-6xl">{page.article.title}</h1>
      <MediaImage image={page.article.image} className="mt-8 w-full object-cover" />
      <div className="article-body mt-8 text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: page.article.content }} />
    </article>
  )
}
