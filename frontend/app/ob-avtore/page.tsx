import type { Metadata } from 'next'
import { MediaImage } from '@/components/media-image'
import { getAuthor, safe } from '@/lib/api'
import { hasCopy } from '@/lib/format'
import type { PageContent } from '@/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  const page = await safe(() => getAuthor())
  return {
    title: page?.data.seo.title || 'Об авторе',
    description: page?.data.seo.description || undefined,
  }
}

function Block({ block }: { block: PageContent }) {
  return (
    <article className="grid gap-8 border-t border-line py-12 md:grid-cols-[1.2fr_0.8fr]">
      <div>
        {block.eyebrow && <p className="text-xs tracking-[0.18em] text-gold uppercase">{block.eyebrow}</p>}
        {block.title && <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">{block.title}</h2>}
        {block.body && <p className="mt-6 whitespace-pre-line text-muted">{block.body}</p>}
      </div>
      <MediaImage image={block.image} className="h-full max-h-[32rem] w-full object-cover" />
    </article>
  )
}

export default async function AuthorPage() {
  const page = await safe(() => getAuthor())

  if (!page) {
    return (
      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <p>Не удалось загрузить страницу. Обновите её через минуту.</p>
      </section>
    )
  }

  const { banner, stats, anchors, son, guide } = page.data

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
      <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h1 className="font-serif text-5xl leading-none md:text-7xl">{banner?.title || 'Об авторе'}</h1>
          {banner?.subtitle && <p className="mt-6 font-serif text-3xl">{banner.subtitle}</p>}
          {banner?.text && <p className="mt-6 max-w-xl whitespace-pre-line text-muted">{banner.text}</p>}
        </div>
        <MediaImage image={banner?.image ?? null} className="h-full max-h-[36rem] w-full object-cover" />
      </div>

      {stats.length > 0 && (
        <ul className="mt-16 grid gap-8 border-y border-line py-10 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <li key={stat.id}>
              {stat.value && <p className="font-serif text-5xl">{stat.value}</p>}
              <p className="mt-2 text-muted">{stat.label}</p>
            </li>
          ))}
        </ul>
      )}

      {anchors.length > 0 && (
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          {anchors.filter((anchor) => anchor.title || anchor.body).map((anchor) => (
            <article key={anchor.id}>
              {anchor.title && <h2 className="font-serif text-3xl">{anchor.title}</h2>}
              {anchor.body && <p className="mt-3 whitespace-pre-line text-muted">{anchor.body}</p>}
            </article>
          ))}
        </div>
      )}

      {hasCopy(son) && son && <Block block={son} />}
      {hasCopy(guide) && guide && <Block block={guide} />}
    </section>
  )
}
