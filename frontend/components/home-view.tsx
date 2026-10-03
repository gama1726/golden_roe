import { MarbleBand } from '@/components/marble-band'
import { MediaImage } from '@/components/media-image'
import { HeroOverlay, ctaPrimary, ctaSecondaryOnDark, heroPad } from '@/components/hero'
import { SiteQuote, cleanQuoteText } from '@/components/site-quote'
import { formatDate } from '@/lib/format'
import type { ContactChannel, HomeData, PageContent } from '@/lib/types'
import { TelegramIcon } from '@/components/telegram-icon'
import { WhatsAppIcon } from '@/components/whatsapp-icon'
import { ArrowRight, Baby, Briefcase, ChartNoAxesColumn, Heart, House, Leaf, Mouse } from 'lucide-react'
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
        <MediaImage image={banner?.image ?? null} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_12%] md:object-[78%_center]" />
        <HeroOverlay variant="home" />
        <div className="relative z-10 mx-auto flex min-h-[92svh] w-full max-w-[80rem] items-end md:min-h-[44rem] md:items-center">
          <div className={`flex w-full max-w-xl flex-col justify-end md:justify-center ${heroPad}`}>
            {banner?.title && <p className="text-xs tracking-[0.28em] text-gold uppercase">{banner.title}</p>}
            {banner?.subtitle && <h1 className="mt-4 max-w-xl font-serif text-4xl leading-[0.95] font-medium sm:text-5xl md:mt-5 md:text-7xl">{banner.subtitle}</h1>}
            {banner?.text && <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/80 sm:mt-6 sm:text-base md:text-lg">{banner.text}</p>}
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
              {telegram && (
                <a href={telegram.url ?? undefined} className={`${ctaPrimary} w-full sm:w-auto`}>
                  <TelegramIcon size={16} />
                  Записаться в Telegram
                </a>
              )}
              {whatsapp && (
                <a href={whatsapp.url ?? undefined} className={`${ctaSecondaryOnDark} w-full sm:w-auto`}>
                  <WhatsAppIcon size={16} />
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
        <section id="ob-mne" className="mx-auto w-full max-w-[80rem] px-4 py-8 sm:px-5 md:py-12">
          <div className="grid items-stretch gap-6 sm:gap-8 lg:grid-cols-[1fr_1.05fr_1fr]">
            <div className="min-h-0 lg:h-full">
              <MediaImage
                image={blocks.approach.image}
                className="aspect-[4/5] w-full rounded-3xl object-cover lg:h-full lg:aspect-auto lg:rounded-none"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xs tracking-[0.22em] text-gold uppercase">Обо мне</p>
              {blocks.approach.title && <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">{blocks.approach.title}</h2>}
              {blocks.approach.body && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted md:text-base">{blocks.approach.body}</p>}
              <Link href="/ob-avtore" className="mt-5 inline-flex items-center gap-2 text-sm">
                Узнать больше об авторе
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            {blocks.approach.eyebrow && !/^обо\s*мне$/iu.test(blocks.approach.eyebrow.trim()) && (
              <div className="flex items-center lg:h-full">
                <SiteQuote>{cleanQuoteText(blocks.approach.eyebrow)}</SiteQuote>
              </div>
            )}
          </div>
        </section>
      )}

      {(results.title || results.items.length > 0) && (
        <MarbleBand seed="home-results" className="border-y border-line">
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
        </MarbleBand>
      )}

      {blocks.choice && (
        <section className="relative min-h-[28rem] overflow-hidden bg-ink text-ivory sm:min-h-[32rem]">
          <MediaImage image={blocks.choice.image} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_40%]" />
          <HeroOverlay variant="dark-soft" />
          <div className={`relative z-10 mx-auto flex min-h-[28rem] w-full max-w-[80rem] flex-col justify-end sm:min-h-[32rem] sm:justify-center ${heroPad}`}>
            {blocks.choice.eyebrow && <p className="text-xs tracking-[0.22em] text-gold uppercase">{blocks.choice.eyebrow}</p>}
            {blocks.choice.title && <h2 className="mt-4 max-w-xl font-serif text-4xl leading-tight sm:text-5xl md:text-6xl">{blocks.choice.title}</h2>}
            {blocks.choice.body && <p className="mt-4 max-w-xl text-sm whitespace-pre-line leading-relaxed text-ivory/85 sm:mt-6 sm:text-base">{blocks.choice.body}</p>}
            <Link href="/kontakty" className={`${ctaPrimary} mt-6 w-fit sm:mt-8`}>
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
