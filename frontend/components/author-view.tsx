import { MarbleBand } from '@/components/marble-band'
import { MediaImage } from '@/components/media-image'
import { SiteQuote, cleanQuoteText } from '@/components/site-quote'
import type { AuthorData, AuthorStat, PageContent } from '@/lib/types'
import {
  ArrowRight,
  BriefcaseBusiness,
  ChartNoAxesColumn,
  Check,
  Flower2,
  Gem,
  Heart,
  HeartHandshake,
  Leaf,
  Music,
  Sparkles,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

const pillarIcons: Record<string, LucideIcon> = {
  'pillar.family': Heart,
  'pillar.spirit': Flower2,
  'pillar.business': ChartNoAxesColumn,
  'pillar.creativity': Music,
  'pillar.health': Leaf,
  'pillar.beauty': Gem,
}

const statIcons: LucideIcon[] = [Sparkles, HeartHandshake, Music, BriefcaseBusiness]

export function AuthorView({ author }: { author: AuthorData }) {
  const { banner, quote, stats, path, path_photo, pillars, son, son_photo, son_quote, guide, guide_items, manifesto, manifesto_quote } =
    author

  return (
    <>
      <section className="relative min-h-[38rem] overflow-hidden bg-ink text-ivory md:min-h-[44rem]">
        <MediaImage image={banner?.image ?? null} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_center]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/60 via-ink/20 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[38rem] w-full max-w-[80rem] items-center md:min-h-[44rem]">
          <div className="grid w-full items-end gap-8 px-5 py-16 md:grid-cols-[minmax(0,28rem)_minmax(0,16rem)] md:px-10 md:py-20">
            <div>
              {banner?.title && <p className="text-xs tracking-[0.28em] text-gold uppercase">{banner.title}</p>}
              <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[0.95] font-medium md:text-6xl">{banner?.subtitle || 'Об авторе'}</h1>
              {banner?.text && <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/85">{banner.text}</p>}
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
        <section className="mx-auto grid w-full max-w-[80rem] items-stretch gap-6 px-5 py-8 md:px-10 md:py-12 lg:grid-cols-[1fr_1.05fr_1fr] lg:gap-8">
          <Portrait image={path?.image ?? null} caption={path?.title && !path.body ? path.title : null} />
          <div className="flex flex-col justify-center">
            {path?.eyebrow && <p className="text-xs tracking-[0.22em] text-gold uppercase">{path.eyebrow}</p>}
            {path?.title && <h2 className="mt-3 font-serif text-3xl leading-[1.05] md:text-4xl">{path.title}</h2>}
            {path?.body && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted md:text-base">{path.body}</p>}
            <Link href="/stati" className="mt-5 inline-flex items-center gap-2 text-sm">
              Больше о моём пути
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <Portrait
            image={path_photo?.image ?? null}
            caption={path_photo?.title || path_photo?.body || 'Система\nСоздание\nСвобода'}
            card
          />
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
                  <StatIcon stat={stat} index={index} />
                  {stat.value && (
                    <p className={`mt-4 font-serif leading-tight ${long ? 'text-2xl md:text-3xl' : 'text-4xl md:text-5xl'}`}>{stat.value}</p>
                  )}
                  <p className="mx-auto mt-3 max-w-[16rem] text-base leading-relaxed md:text-lg xl:max-w-none">{stat.label}</p>
                </li>
              )
            })}
          </ul>
        </MarbleBand>
      )}

      {(pillars.title || pillars.items.length > 0) && (
        <section className="w-full border-y border-line bg-[#efe6d8]">
          <div className="grid w-full items-stretch lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)]">
            <div className="px-5 py-8 md:px-10 md:py-10 lg:px-12 lg:py-12">
              {pillars.title && <h2 className="font-serif text-4xl md:text-5xl">{pillars.title}</h2>}
              {pillars.items.length > 0 && (
                <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:mt-10 lg:grid-cols-6 lg:gap-x-2 xl:gap-x-4">
                  {pillars.items.map((item) => (
                    <li key={item.id} className="text-center">
                      <PillarIcon item={item} />
                      {item.title && <p className="mx-auto mt-3 max-w-[9rem] text-sm leading-snug">{item.title}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {pillars.quote?.body && (
              <div className="flex border-t border-[#e0d4c4] bg-ivory/75 lg:border-t-0 lg:border-l">
                <SiteQuote className="flex h-full w-full flex-col justify-center px-6 py-8 md:px-8 md:py-10">
                  {cleanQuoteText(pillars.quote.body)}
                </SiteQuote>
              </div>
            )}
          </div>
        </section>
      )}

      {(son || son_photo) && (
        <section className="w-full">
          <div className="grid w-full items-stretch lg:grid-cols-4 lg:gap-0">
            <div className="min-h-0 lg:h-full">
              <MediaImage
                image={son?.image ?? null}
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="aspect-[4/5] w-full object-cover lg:h-full lg:min-h-[28rem] lg:aspect-auto"
              />
            </div>
            <div className="flex flex-col justify-center bg-ivory px-6 py-10 md:px-8 md:py-12 lg:px-10">
              {son?.eyebrow && <p className="text-xs tracking-[0.22em] text-gold uppercase">{son.eyebrow}</p>}
              {son?.title && <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{son.title}</h2>}
              {son?.body && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted md:text-base">{son.body}</p>}
            </div>
            <div className="relative min-h-0 lg:col-span-2 lg:h-full">
              <MediaImage
                image={son_photo?.image ?? null}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="aspect-[16/10] w-full object-cover lg:h-full lg:min-h-[28rem] lg:aspect-auto"
              />
              {son_quote?.body && (
                <SiteQuote
                  boxed
                  tone="ivory"
                  className="absolute inset-y-[12%] right-[6%] flex w-[min(14rem,42%)] flex-col justify-center shadow-sm"
                >
                  {cleanQuoteText(son_quote.body)}
                </SiteQuote>
              )}
            </div>
          </div>
        </section>
      )}

      {(guide?.title || guide?.body || guide_items.length > 0) && (
        <section className="w-full border-t border-line">
          <div className="w-full px-5 py-10 md:px-10 md:py-14 lg:px-12">
            {guide?.title && <h2 className="max-w-4xl font-serif text-4xl leading-[1.05] md:text-5xl">{guide.title}</h2>}
            <div className="mt-8 grid items-start gap-8 lg:mt-10 lg:grid-cols-2 lg:gap-x-16 xl:gap-x-24">
              {guide?.body && <p className="whitespace-pre-line leading-relaxed text-muted">{guide.body}</p>}
              {guide_items.length > 0 && (
                <ul className="grid gap-4">
                  {guide_items.map((item) => (
                    <li key={item.id} className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-gold text-gold">
                        <Check aria-hidden="true" size={14} strokeWidth={1.75} />
                      </span>
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
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/55 via-ink/20 to-transparent" />
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

function Portrait({
  image,
  caption = null,
  card = false,
}: {
  image: PageContent['image']
  caption?: string | null
  card?: boolean
}) {
  if (!image) return null

  return (
    <div className="relative min-h-0 lg:h-full">
      <MediaImage
        image={image}
        sizes="(min-width: 1024px) 28rem, 100vw"
        className="aspect-[4/5] w-full object-cover lg:h-full lg:aspect-auto"
      />
      {caption && (
        <p
          className={
            card
              ? 'absolute right-4 bottom-6 max-w-[12rem] whitespace-pre-line text-right font-script text-3xl leading-none text-ivory drop-shadow md:text-4xl'
              : 'absolute bottom-6 left-5 max-w-[11rem] whitespace-pre-line font-script text-3xl leading-none text-ivory drop-shadow'
          }
        >
          {caption}
        </p>
      )}
    </div>
  )
}

function PillarIcon({ item }: { item: PageContent }) {
  const Icon = pillarIcons[item.key] ?? Gem
  return <Icon aria-hidden="true" className="mx-auto text-gold" size={34} strokeWidth={1.1} />
}

function StatIcon({ index }: { stat: AuthorStat; index: number }) {
  const Icon = statIcons[index % statIcons.length]
  return <Icon aria-hidden="true" className="mx-auto text-[#3d2a1f]" size={34} strokeWidth={1.2} />
}
