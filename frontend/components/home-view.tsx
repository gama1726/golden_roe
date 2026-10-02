import { MediaImage } from '@/components/media-image'
import { formatDate } from '@/lib/format'
import type { ContactChannel, HomeData, PageContent } from '@/lib/types'
import { ArrowRight, Baby, Briefcase, ChartNoAxesColumn, Heart, House, Leaf, MessageCircle, Send } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

const resultIcons: Record<string, LucideIcon> = {
  'result.housing': House,
  'result.income': ChartNoAxesColumn,
  'result.businesses': Briefcase,
  'result.family': Heart,
  'result.health': Leaf,
  'result.children': Baby,
}

export function HomeView({ home, contacts }: { home: HomeData; contacts: ContactChannel[] }) {
  const { banner, blocks, services, articles } = home
  const telegram = contacts.find((channel) => channel.key === 'telegram' && channel.url)
  const whatsapp = contacts.find((channel) => channel.key === 'whatsapp' && channel.url)
  const results = blocks.results

  return (
    <>
      <section className="relative min-h-[38rem] overflow-hidden bg-ink text-ivory md:min-h-[44rem]">
        <MediaImage image={banner?.image ?? null} className="absolute inset-0 h-full w-full object-cover object-[78%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
        <div className="relative mx-auto flex min-h-[38rem] w-full max-w-[80rem] items-center md:min-h-[44rem]">
          <div className="flex max-w-xl flex-col justify-center px-5 py-16 md:px-10 md:py-20">
            {banner?.title && <p className="text-xs tracking-[0.28em] text-gold uppercase">{banner.title}</p>}
            {banner?.subtitle && <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[0.95] font-medium md:text-7xl">{banner.subtitle}</h1>}
            {banner?.text && <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/80 md:text-lg">{banner.text}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              {telegram && (
                <a href={telegram.url ?? undefined} className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm text-ink">
                  <Send aria-hidden="true" size={16} />
                  Записаться в Telegram
                </a>
              )}
              {whatsapp && (
                <a href={whatsapp.url ?? undefined} className="inline-flex items-center gap-2 rounded-full border border-ivory/40 px-5 py-3 text-sm">
                  <MessageCircle aria-hidden="true" size={16} />
                  Записаться в WhatsApp
                </a>
              )}
            </div>
            <a href="#ob-mne" className="mt-8 inline-flex items-center gap-2 text-xs tracking-[0.22em] text-ivory/70 uppercase">
              Узнать больше
              <ArrowRight aria-hidden="true" size={14} />
            </a>
          </div>
        </div>
      </section>

      {blocks.approach && (
        <section id="ob-mne" className="mx-auto w-full max-w-[80rem] px-5 py-16 md:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[0.9fr_1.15fr_0.85fr]">
            <MediaImage image={blocks.approach.image} className="aspect-[4/5] w-full object-cover" />
            <div>
              <p className="text-xs tracking-[0.22em] text-gold uppercase">Обо мне</p>
              {blocks.approach.title && <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{blocks.approach.title}</h2>}
              {blocks.approach.body && <p className="mt-6 whitespace-pre-line leading-relaxed text-muted">{blocks.approach.body}</p>}
              <Link href="/ob-avtore" className="mt-8 inline-flex items-center gap-2 text-sm">
                Узнать больше об авторе
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            {blocks.approach.eyebrow && (
              <blockquote className="font-serif text-3xl leading-snug text-gold italic md:text-4xl">{blocks.approach.eyebrow}</blockquote>
            )}
          </div>
        </section>
      )}

      {(results.title || results.items.length > 0) && (
        <section className="border-y border-line">
          <div className="mx-auto w-full max-w-[80rem] px-5 py-16 md:py-20">
            {results.eyebrow && <p className="text-center text-xs tracking-[0.22em] text-gold uppercase">{results.eyebrow}</p>}
            {results.title && <h2 className="mt-4 text-center font-serif text-4xl md:text-5xl">{results.title}</h2>}
            {results.items.length > 0 && (
              <ul className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
                {results.items.map((item) => (
                  <li key={item.id} className="text-center">
                    <ResultIcon item={item} />
                    <p className="mt-3 text-sm leading-snug">{item.title}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {blocks.choice && (
        <section className="relative min-h-[32rem] overflow-hidden bg-ink text-ivory">
          <MediaImage image={blocks.choice.image} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-ink/45" />
          <div className="relative mx-auto flex min-h-[32rem] w-full max-w-[80rem] flex-col justify-center px-5 py-16 md:px-10">
            {blocks.choice.eyebrow && <p className="text-xs tracking-[0.22em] text-gold uppercase">{blocks.choice.eyebrow}</p>}
            {blocks.choice.title && <h2 className="mt-4 max-w-xl font-serif text-5xl leading-tight md:text-6xl">{blocks.choice.title}</h2>}
            {blocks.choice.body && <p className="mt-6 max-w-xl whitespace-pre-line leading-relaxed text-ivory/85">{blocks.choice.body}</p>}
            <Link href="/kontakty" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm text-ink">
              Записаться на консультацию
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="mx-auto w-full max-w-[80rem] px-5 py-16 md:py-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-4xl md:text-5xl">Услуги</h2>
            <Link href="/uslugi" className="inline-flex items-center gap-2 text-sm">
              Все услуги
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <article key={service.id}>
                <MediaImage image={service.image} className="aspect-[16/10] w-full object-cover" />
                <h3 className="mt-5 font-serif text-3xl leading-tight">{service.title}</h3>
                {service.audience && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{service.audience}</p>}
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <p className="text-sm">{service.price_display}</p>
                  <Link href={`/kontakty?service=${service.id}`} className="inline-flex items-center gap-2 text-sm">
                    Узнать подробнее
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {articles.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto w-full max-w-[80rem] px-5 py-16 md:py-24">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-serif text-4xl md:text-5xl">Статьи</h2>
              <Link href="/stati" className="inline-flex items-center gap-2 text-sm">
                Все статьи
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-3">
              {articles.map((article) => {
                const date = formatDate(article.published_at)
                return (
                  <article key={article.id}>
                    <Link href={`/stati/${article.slug}`} className="block">
                      <MediaImage image={article.image} className="aspect-[4/3] w-full object-cover" />
                      {date && <p className="mt-4 text-sm text-muted">{date}</p>}
                      <h3 className="mt-2 font-serif text-2xl leading-tight">{article.title}</h3>
                      {article.excerpt && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{article.excerpt}</p>}
                    </Link>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function ResultIcon({ item }: { item: PageContent }) {
  const Icon = resultIcons[item.key] ?? Heart
  return <Icon aria-hidden="true" className="mx-auto text-gold" size={28} strokeWidth={1.25} />
}
