import { MediaImage } from '@/components/media-image'
import { formatDate } from '@/lib/format'
import type { ContactChannel, HomeData, PageContent } from '@/lib/types'
import { ArrowRight, Baby, Briefcase, ChartNoAxesColumn, Heart, House, Leaf, MessageCircle, Mouse, Send } from 'lucide-react'
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
      <section className="relative min-h-[92svh] overflow-hidden bg-ink text-ivory md:min-h-[44rem]">
        <MediaImage image={banner?.image ?? null} className="absolute inset-0 h-full w-full object-cover object-[72%_12%] md:object-[78%_center]" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-transparent md:bg-gradient-to-r md:from-ink md:via-ink/75 md:to-ink/10" />
        <div className="relative mx-auto flex min-h-[92svh] w-full max-w-[80rem] items-end md:min-h-[44rem] md:items-center">
          <div className="flex w-full max-w-xl flex-col justify-end px-4 pt-24 pb-10 sm:px-5 md:justify-center md:px-10 md:py-20">
            {banner?.title && <p className="text-[0.7rem] tracking-[0.22em] text-gold uppercase sm:text-xs sm:tracking-[0.28em]">{banner.title}</p>}
            {banner?.subtitle && <h1 className="mt-4 max-w-xl font-serif text-4xl leading-[0.95] font-medium sm:text-5xl md:mt-5 md:text-7xl">{banner.subtitle}</h1>}
            {banner?.text && <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/80 sm:mt-6 sm:text-base md:text-lg">{banner.text}</p>}
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              {telegram && (
                <a href={telegram.url ?? undefined} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-gold-button px-5 py-3 text-sm text-ink sm:w-auto">
                  <Send aria-hidden="true" size={16} />
                  Записаться в Telegram
                </a>
              )}
              {whatsapp && (
                <a href={whatsapp.url ?? undefined} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-ivory/40 px-5 py-3 text-sm sm:w-auto">
                  <MessageCircle aria-hidden="true" size={16} />
                  Записаться в WhatsApp
                </a>
              )}
            </div>
            <a href="#ob-mne" className="mt-8 flex flex-col items-center gap-2 self-center text-xs tracking-[0.22em] text-ivory/80 uppercase md:flex-row md:self-start">
              <Mouse aria-hidden="true" className="md:hidden" size={18} strokeWidth={1.25} />
              Узнать больше
              <ArrowRight aria-hidden="true" className="hidden md:block" size={14} />
            </a>
          </div>
        </div>
      </section>

      {blocks.approach && (
        <section id="ob-mne" className="mx-auto w-full max-w-[80rem] px-4 py-12 sm:px-5 sm:py-16 md:py-24">
          <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[0.9fr_1.15fr_0.85fr]">
            <MediaImage image={blocks.approach.image} className="aspect-[4/5] w-full rounded-3xl object-cover lg:rounded-none" />
            <div>
              <p className="text-xs tracking-[0.22em] text-gold uppercase">Обо мне</p>
              {blocks.approach.title && <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl md:text-5xl">{blocks.approach.title}</h2>}
              {blocks.approach.body && <p className="mt-5 whitespace-pre-line text-sm leading-relaxed text-muted sm:mt-6 sm:text-base">{blocks.approach.body}</p>}
              <Link href="/ob-avtore" className="mt-6 inline-flex items-center gap-2 text-sm sm:mt-8">
                Узнать больше об авторе
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            {blocks.approach.eyebrow && (
              <blockquote className="font-serif text-2xl leading-snug text-gold italic sm:text-3xl md:text-4xl">
                <span className="mb-3 block font-sans text-4xl not-italic lg:hidden">“</span>
                {blocks.approach.eyebrow}
              </blockquote>
            )}
          </div>
        </section>
      )}

      {(results.title || results.items.length > 0) && (
        <section className="border-y border-line">
          <div className="mx-auto w-full max-w-[80rem] px-4 py-12 sm:px-5 sm:py-16 md:py-20">
            {results.eyebrow && <p className="text-center text-xs tracking-[0.22em] text-gold uppercase">{results.eyebrow}</p>}
            {results.title && <h2 className="mt-4 text-center font-serif text-3xl sm:text-4xl md:text-5xl">{results.title}</h2>}
            {results.items.length > 0 && (
              <ul className="mt-10 grid grid-cols-3 gap-x-3 gap-y-8 sm:gap-8 lg:mt-12 lg:grid-cols-6">
                {results.items.map((item) => (
                  <li key={item.id} className="text-center">
                    <ResultIcon item={item} />
                    <p className="mt-3 text-xs leading-snug sm:text-sm">{item.title}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {blocks.choice && (
        <section className="relative min-h-[28rem] overflow-hidden bg-ink text-ivory sm:min-h-[32rem]">
          <MediaImage image={blocks.choice.image} className="absolute inset-0 h-full w-full object-cover object-[center_40%]" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/40 to-ink/20" />
          <div className="relative mx-auto flex min-h-[28rem] w-full max-w-[80rem] flex-col justify-end px-4 py-12 sm:min-h-[32rem] sm:justify-center sm:px-5 sm:py-16 md:px-10">
            {blocks.choice.eyebrow && <p className="text-xs tracking-[0.22em] text-gold uppercase">{blocks.choice.eyebrow}</p>}
            {blocks.choice.title && <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">{blocks.choice.title}</h2>}
            {blocks.choice.body && <p className="mt-4 max-w-xl text-sm whitespace-pre-line leading-relaxed text-ivory/85 sm:mt-6 sm:text-base">{blocks.choice.body}</p>}
            <Link href="/kontakty" className="mt-6 inline-flex min-h-11 w-fit items-center gap-2 rounded-full bg-gold-button px-5 py-3 text-sm text-ink sm:mt-8">
              Записаться на консультацию
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>
      )}

      {services.length > 0 && (
        <section className="mx-auto w-full max-w-[80rem] px-4 py-12 sm:px-5 sm:py-16 md:py-24">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl">Услуги</h2>
            <Link href="/uslugi" className="inline-flex shrink-0 items-center gap-2 text-sm">
              Все услуги
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div className="mt-8 grid gap-8 sm:mt-10 md:grid-cols-2">
            {services.map((service) => (
              <article key={service.id} className="min-w-0">
                <MediaImage image={service.image} className="aspect-[16/10] w-full rounded-2xl object-cover lg:rounded-none" />
                <h3 className="mt-5 font-serif text-2xl leading-tight sm:text-3xl">{service.title}</h3>
                {service.audience && <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{service.audience}</p>}
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p className="text-sm text-gold">{service.price_display}</p>
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
          <div className="mx-auto w-full max-w-[80rem] px-4 py-12 sm:px-5 sm:py-16 md:py-24">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl">Статьи</h2>
              <Link href="/stati" className="inline-flex shrink-0 items-center gap-2 text-sm">
                Все статьи
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            <div className="mt-8 grid gap-8 sm:mt-10 md:grid-cols-3">
              {articles.map((article) => {
                const date = formatDate(article.published_at)
                return (
                  <article key={article.id} className="min-w-0">
                    <Link href={`/stati/${article.slug}`} className="block">
                      <MediaImage image={article.image} className="aspect-[4/3] w-full rounded-2xl object-cover lg:rounded-none" />
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
