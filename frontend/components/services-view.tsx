import { MarbleBand } from '@/components/marble-band'
import { MediaImage } from '@/components/media-image'
import { SiteQuote, cleanQuoteText } from '@/components/site-quote'
import type { Block, ContactChannel, PageContent, ServicesData } from '@/lib/types'
import { TelegramIcon } from '@/components/telegram-icon'
import { WhatsAppIcon } from '@/components/whatsapp-icon'
import { ArrowRight, ChartNoAxesColumn, Gem, Leaf, Target, UserRound, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

const pointIcons: Record<string, LucideIcon> = {
  'point.system': Leaf,
  'point.individual': Gem,
  'point.trust': Users,
  'point.results': ChartNoAxesColumn,
}

const ordinals = ['Первая', 'Вторая', 'Третья', 'Четвёртая', 'Пятая', 'Шестая', 'Седьмая', 'Восьмая', 'Девятая', 'Десятая']

export function ServicesView({ page, contacts }: { page: ServicesData; contacts: ContactChannel[] }) {
  const { banner, blocks, data: services } = page
  const telegram = contacts.find((channel) => channel.key === 'telegram' && channel.url)
  const whatsapp = contacts.find((channel) => channel.key === 'whatsapp' && channel.url)

  return (
    <>
      <section className="relative min-h-[38rem] overflow-hidden bg-ink text-ivory md:min-h-[44rem]">
        <MediaImage image={banner?.image ?? null} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_center]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/35 to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[38rem] w-full max-w-[80rem] items-center md:min-h-[44rem]">
          <div className="grid w-full items-end gap-8 px-5 py-16 md:grid-cols-[minmax(0,26rem)_minmax(0,14rem)] md:px-10 md:py-20">
            <div>
              {banner?.title && <p className="text-xs tracking-[0.28em] text-gold uppercase">{banner.title}</p>}
              <h1 className="mt-5 font-serif text-5xl leading-[0.95] font-medium md:text-7xl">{banner?.subtitle || 'Услуги'}</h1>
              {banner?.text && <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/80 md:text-lg">{banner.text}</p>}
              <div className="mt-8 flex flex-wrap gap-3">
                {telegram && (
                  <a href={telegram.url ?? undefined} className="inline-flex items-center gap-2 rounded-full bg-gold-button px-5 py-3 text-sm text-ink">
                    <TelegramIcon size={16} />
                    Записаться в Telegram
                  </a>
                )}
                {whatsapp && (
                  <a href={whatsapp.url ?? undefined} className="inline-flex items-center gap-2 rounded-full border border-ivory/40 px-5 py-3 text-sm">
                    <WhatsAppIcon size={16} />
                    Записаться в WhatsApp
                  </a>
                )}
              </div>
            </div>
            {blocks.quote?.title && (
              <SiteQuote tone="ivory" attribution={blocks.quote.eyebrow}>
                {cleanQuoteText(blocks.quote.title)}
              </SiteQuote>
            )}
          </div>
        </div>
      </section>

      {blocks.points.length > 0 && (
        <MarbleBand seed="services-points" className="relative border-y border-line">
          <div className="pointer-events-none absolute inset-0 bg-[#3d2a1f]/12" aria-hidden="true" />
          <ul className="relative grid w-full grid-cols-2 lg:grid-cols-4">
            {blocks.points.map((point, index) => {
              const mobileColDivider = index % 2 === 1
              const desktopDivider = index > 0
              const mobileRowDivider = index >= 2

              return (
                <li
                  key={point.id}
                  className={[
                    'relative px-4 py-10 text-center text-ink sm:px-8 sm:py-12 lg:px-10 xl:px-16',
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
                  <PointIcon point={point} />
                  {point.title && (
                    <p className="mx-auto mt-5 max-w-[16rem] text-base leading-relaxed md:text-lg xl:max-w-none">{point.title}</p>
                  )}
                </li>
              )
            })}
          </ul>
        </MarbleBand>
      )}

      <section className="mx-auto w-full max-w-[80rem] px-5 py-8 md:py-12">
        {services.length > 0 ? (
          services.map((service, index) => (
            <article key={service.id} className="grid gap-8 border-t border-line py-12 md:grid-cols-[0.9fr_1.1fr] md:items-stretch md:gap-12">
              <div className="flex min-h-0 flex-col">
                <p className="font-serif text-5xl text-gold/35">{String(index + 1).padStart(2, '0')}</p>
                <div className="relative mt-4 aspect-square w-full overflow-hidden md:aspect-auto md:min-h-0 md:flex-1">
                  <MediaImage image={service.image} className="h-full w-full object-cover md:absolute md:inset-0" />
                </div>
              </div>
              <div className="flex flex-col">
                <p className="text-xs tracking-[0.22em] text-gold uppercase">{ordinals[index] ? `${ordinals[index]} услуга` : `Услуга ${index + 1}`}</p>
                <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
                  <h2 className="font-serif text-4xl leading-tight md:text-5xl">{service.title}</h2>
                  <p className="shrink-0 font-serif text-3xl text-brown md:text-4xl">{service.price_display}</p>
                </div>
                {service.format && <p className="mt-3 text-base text-muted md:text-lg">{service.format}</p>}
                <div className="mt-8 md:mt-10">
                  {service.audience && (
                    <ServiceFact icon={UserRound} label="Для кого" text={service.audience} />
                  )}
                  {service.result && (
                    <ServiceFact icon={Target} label="Результат" text={service.result} bordered={Boolean(service.audience)} />
                  )}
                </div>
                <div className="mt-8 flex flex-wrap gap-3 md:mt-auto md:pt-8">
                  <Link href={`/kontakty?service=${service.id}`} className="inline-flex items-center gap-2 rounded-full bg-gold-button px-5 py-3 text-sm text-ink">
                    Узнать подробнее
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                  {telegram && (
                    <a href={telegram.url ?? undefined} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm">
                      <TelegramIcon size={16} />
                      Записаться в Telegram
                    </a>
                  )}
                  {whatsapp && (
                    <a href={whatsapp.url ?? undefined} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm">
                      <WhatsAppIcon size={16} />
                      Записаться в WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <p className="py-16 text-muted">Услуги пока не опубликованы.</p>
        )}
      </section>

      {blocks.cta && <ClosingBand block={blocks.cta} />}
    </>
  )
}

function ServiceFact({
  icon: Icon,
  label,
  text,
  bordered = false,
}: {
  icon: LucideIcon
  label: string
  text: string
  bordered?: boolean
}) {
  return (
    <div
      className={`grid grid-cols-[2.5rem_minmax(5.5rem,8rem)_minmax(0,1fr)] items-start gap-x-3 gap-y-1 py-6 min-[480px]:gap-x-5 md:py-7 ${
        bordered ? 'border-t border-line' : ''
      }`}
    >
      <Icon aria-hidden="true" className="mt-0.5 text-gold" size={32} strokeWidth={1.25} />
      <p className="pt-1 text-base font-medium md:text-lg">{label}</p>
      <p className="pt-1 whitespace-pre-line text-base leading-relaxed text-muted md:text-lg">{text}</p>
    </div>
  )
}

function PointIcon({ point }: { point: PageContent }) {
  const Icon = pointIcons[point.key] ?? Leaf
  return <Icon aria-hidden="true" className="mx-auto text-[#3d2a1f]" size={40} strokeWidth={1.25} />
}

function ClosingBand({ block }: { block: Block }) {
  return (
    <section className="relative min-h-[28rem] overflow-hidden bg-ink text-ivory">
      <MediaImage image={block.image} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 bg-ink/45" />
      <div className="relative z-10 mx-auto flex min-h-[28rem] w-full max-w-[80rem] flex-col justify-center px-5 py-16 md:px-10">
        {block.title && <h2 className="max-w-xl font-serif text-5xl leading-tight md:text-6xl">{block.title}</h2>}
        {block.body && <p className="mt-6 max-w-xl whitespace-pre-line leading-relaxed text-ivory/85">{block.body}</p>}
        <Link href="/kontakty" className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-gold-button px-5 py-3 text-sm text-ink">
          Записаться на консультацию
          <ArrowRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </section>
  )
}
