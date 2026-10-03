import { MarbleBand } from '@/components/marble-band'
import { MediaImage } from '@/components/media-image'
import { SiteQuote, cleanQuoteText } from '@/components/site-quote'
import type { AuthorData, PageContent } from '@/lib/types'
import { ArrowRight, ChartNoAxesColumn, Check, Flower2, Gem, Music, Sun, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

const pillarIcons: Record<string, LucideIcon> = {
  'pillar.family': Users,
  'pillar.spirit': Flower2,
  'pillar.business': ChartNoAxesColumn,
  'pillar.creativity': Music,
  'pillar.health': Sun,
  'pillar.beauty': Gem,
}

export function AuthorView({ author }: { author: AuthorData }) {
  const { banner, quote, stats, path, path_photo, pillars, son, son_photo, guide, guide_items, manifesto, manifesto_quote } = author

  return (
    <>
      <section className="relative min-h-[38rem] overflow-hidden bg-ink text-ivory md:min-h-[44rem]">
        <MediaImage image={banner?.image ?? null} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_center]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/35 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[38rem] w-full max-w-[80rem] items-center md:min-h-[44rem]">
          <div className="grid w-full items-end gap-8 px-5 py-16 md:grid-cols-[minmax(0,28rem)_minmax(0,16rem)] md:px-10 md:py-20">
            <div>
              {banner?.title && <p className="text-xs tracking-[0.28em] text-gold uppercase">{banner.title}</p>}
              <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[0.95] font-medium md:text-6xl">{banner?.subtitle || 'Об авторе'}</h1>
              {banner?.text && <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/80">{banner.text}</p>}
              <Link href="/kontakty" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-button px-5 py-3 text-sm text-ink">
                Записаться на консультацию
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            {quote?.title && (
              <SiteQuote tone="ivory" attribution={quote.eyebrow}>
                {cleanQuoteText(quote.title)}
              </SiteQuote>
            )}
          </div>
        </div>
      </section>

      {(path || path_photo) && (
        <section className="mx-auto grid w-full max-w-[80rem] items-center gap-8 px-5 py-14 md:px-10 md:py-20 lg:grid-cols-[0.9fr_1.15fr_0.9fr] lg:gap-10">
          <Portrait image={path?.image ?? null} />
          <div>
            {path?.eyebrow && <p className="text-xs tracking-[0.22em] text-gold uppercase">{path.eyebrow}</p>}
            {path?.title && <h2 className="mt-4 font-serif text-4xl leading-[1.05] md:text-5xl">{path.title}</h2>}
            {path?.body && <p className="mt-6 whitespace-pre-line leading-relaxed text-muted">{path.body}</p>}
            <Link href="/stati" className="mt-8 inline-flex items-center gap-2 text-sm">
              Больше о моём пути
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <Portrait image={path_photo?.image ?? null} card />
        </section>
      )}

      {stats.length > 0 && (
        <MarbleBand seed="author-stats" className="relative border-y border-line">
          <div className="pointer-events-none absolute inset-0 bg-[#3d2a1f]/12" aria-hidden="true" />
          <ul className="relative grid w-full grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const long = (stat.value?.length ?? 0) > 12
              const mobileColDivider = index % 2 === 1
              const desktopDivider = index > 0
              const mobileRowDivider = index >= 2

              return (
                <li
                  key={stat.id}
                  className={[
                    'relative px-4 py-10 text-center text-[#3d2a1f] sm:px-8 sm:py-12 lg:px-10 xl:px-16',
                    mobileColDivider || desktopDivider
                      ? 'before:absolute before:top-[18%] before:bottom-[18%] before:left-0 before:w-px before:bg-[#3d2a1f]/20'
                      : '',
                    !mobileColDivider && desktopDivider ? 'before:hidden lg:before:block' : '',
                    mobileColDivider && !desktopDivider ? 'lg:before:hidden' : '',
                    mobileRowDivider
                      ? 'after:absolute after:top-0 after:right-[18%] after:left-[18%] after:h-px after:bg-[#3d2a1f]/20 lg:after:hidden'
                      : '',
                  ].join(' ')}
                >
                  {stat.value && (
                    <p className={`font-serif leading-tight ${long ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'}`}>{stat.value}</p>
                  )}
                  <p className="mx-auto mt-4 max-w-[16rem] text-base leading-relaxed md:text-lg xl:max-w-none">{stat.label}</p>
                </li>
              )
            })}
          </ul>
        </MarbleBand>
      )}

      {(pillars.title || pillars.items.length > 0) && (
        <section className="border-b border-line">
          <div className="mx-auto grid w-full max-w-[80rem] items-end gap-10 px-5 py-14 md:px-10 md:py-16 lg:grid-cols-[minmax(0,1fr)_18rem] lg:gap-16">
            <div>
              {pillars.title && <h2 className="font-serif text-4xl md:text-5xl">{pillars.title}</h2>}
              {pillars.items.length > 0 && (
                <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
                  {pillars.items.map((item) => (
                    <li key={item.id} className="text-center">
                      <PillarIcon item={item} />
                      {item.title && <p className="mt-4 text-sm leading-relaxed">{item.title}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {pillars.quote?.body && (
              <SiteQuote className="lg:pb-2">{cleanQuoteText(pillars.quote.body)}</SiteQuote>
            )}
          </div>
        </section>
      )}

      {(son || son_photo) && (
        <section className="border-t border-line">
          <div className="mx-auto grid w-full max-w-[80rem] items-center gap-8 px-5 py-16 md:py-24 lg:grid-cols-[0.85fr_1.1fr_1fr]">
            <MediaImage image={son?.image ?? null} className="aspect-[4/5] w-full object-cover" />
            <div>
              {son?.eyebrow && <p className="text-xs tracking-[0.22em] text-gold uppercase">{son.eyebrow}</p>}
              {son?.title && <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{son.title}</h2>}
              {son?.body && <p className="mt-6 whitespace-pre-line leading-relaxed text-muted">{son.body}</p>}
            </div>
            <MediaImage image={son_photo?.image ?? null} className="aspect-[4/3] w-full object-cover" />
          </div>
        </section>
      )}

      {(guide?.title || guide?.body || guide_items.length > 0) && (
        <section className="border-t border-line">
          <div className="mx-auto grid w-full max-w-[80rem] items-start gap-6 px-5 py-10 md:px-10 md:py-12 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-x-14">
            {guide?.title && <h2 className="font-serif text-4xl leading-[1.05] md:text-5xl">{guide.title}</h2>}
            <div className={guide?.title ? '' : 'lg:col-span-2'}>
              {guide?.body && <p className="whitespace-pre-line leading-relaxed text-muted">{guide.body}</p>}
              {guide_items.length > 0 && (
                <ul className={`${guide?.body ? 'mt-6' : ''} grid gap-x-10 gap-y-3 sm:grid-cols-2`}>
                  {guide_items.map((item) => (
                    <li key={item.id} className="flex gap-3">
                      <Check aria-hidden="true" className="mt-0.5 shrink-0 text-gold" size={18} strokeWidth={1.5} />
                      {item.title && <span className="leading-snug">{item.title}</span>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {manifesto && (
        <section className="relative min-h-[36rem] overflow-hidden bg-ink text-ivory md:min-h-[44rem]">
          <MediaImage image={manifesto.image} sizes="100vw" className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[center_42%]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent" />
          <div className="relative z-10 mx-auto grid min-h-[36rem] w-full max-w-[80rem] items-center gap-10 px-5 py-16 md:min-h-[44rem] md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:px-10 md:py-20">
            <div>
              {manifesto.eyebrow && <p className="text-xs tracking-[0.22em] text-gold uppercase">{manifesto.eyebrow}</p>}
              {manifesto.title && <h2 className="mt-4 max-w-xl font-serif text-5xl leading-[1.05] md:text-6xl">{manifesto.title}</h2>}
              {manifesto.body && <p className="mt-6 max-w-xl leading-relaxed text-ivory/85">{manifesto.body}</p>}
              <Link href="/kontakty" className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-button px-5 py-3 text-sm text-ink">
                Записаться на консультацию
                <ArrowRight aria-hidden="true" size={16} />
              </Link>
            </div>
            {manifesto_quote?.title && (
              <SiteQuote tone="ivory" align="right" attribution={manifesto_quote.eyebrow}>
                {cleanQuoteText(manifesto_quote.title)}
              </SiteQuote>
            )}
          </div>
        </section>
      )}
    </>
  )
}

function Portrait({ image, card = false }: { image: PageContent['image']; card?: boolean }) {
  if (!image) return null

  return (
    <div className="relative">
      <MediaImage image={image} sizes="(min-width: 1024px) 28rem, 100vw" className="aspect-[4/5] w-full object-cover" />
      <p className={card ? 'absolute right-4 bottom-6 max-w-[11rem] bg-ivory/95 px-4 py-3 font-serif text-2xl leading-none text-ink italic' : 'absolute bottom-6 left-5 max-w-[11rem] font-serif text-3xl leading-none text-ivory italic'}>
        Эльвира Вартанова
      </p>
    </div>
  )
}

function PillarIcon({ item }: { item: PageContent }) {
  const Icon = pillarIcons[item.key] ?? Gem
  return <Icon aria-hidden="true" className="mx-auto text-gold" size={28} strokeWidth={1.25} />
}
