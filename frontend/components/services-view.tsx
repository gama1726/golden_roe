import { MediaImage } from '@/components/media-image'
import type { Block, ContactChannel, PageContent, ServicesData } from '@/lib/types'
import { ArrowRight, ChartNoAxesColumn, Gem, Leaf, MessageCircle, Send, Target, UserRound, Users } from 'lucide-react'
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
        <MediaImage image={banner?.image ?? null} className="absolute inset-0 h-full w-full object-cover object-[72%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/15" />
        <div className="relative mx-auto flex min-h-[38rem] w-full max-w-[80rem] items-center md:min-h-[44rem]">
          <div className="grid w-full items-end gap-8 px-5 py-16 md:grid-cols-[minmax(0,26rem)_minmax(0,14rem)] md:px-10 md:py-20">
            <div>
              {banner?.title && <p className="text-xs tracking-[0.28em] text-gold uppercase">{banner.title}</p>}
              <h1 className="mt-5 font-serif text-5xl leading-[0.95] font-medium md:text-7xl">{banner?.subtitle || 'Услуги'}</h1>
              {banner?.text && <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/80 md:text-lg">{banner.text}</p>}
              <div className="mt-8 flex flex-wrap gap-3">
                {telegram && (
                  <a href={telegram.url ?? undefined} className="inline-flex items-center gap-2 rounded-full bg-gold-button px-5 py-3 text-sm text-ink">
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
            </div>
            {blocks.quote?.title && (
              <blockquote>
                <p className="font-serif text-2xl leading-snug text-ivory md:text-3xl">{blocks.quote.title}</p>
                {blocks.quote.eyebrow && <p className="mt-4 text-xs tracking-[0.22em] text-ivory/70 uppercase">{blocks.quote.eyebrow}</p>}
              </blockquote>
            )}
          </div>
        </div>
      </section>

      {blocks.points.length > 0 && (
        <section className="border-y border-line bg-cream">
          <ul className="mx-auto grid w-full max-w-[80rem] gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4">
            {blocks.points.map((point) => (
              <li key={point.id} className="text-center">
                <PointIcon point={point} />
                {point.title && <p className="mt-4 text-sm leading-relaxed">{point.title}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto w-full max-w-[80rem] px-5 py-8 md:py-12">
        {services.length > 0 ? (
          services.map((service, index) => (
            <article key={service.id} className="grid gap-8 border-t border-line py-12 md:grid-cols-[0.82fr_1.18fr] md:gap-12">
              <div>
                <p className="font-serif text-5xl text-gold/35">{String(index + 1).padStart(2, '0')}</p>
                <MediaImage image={service.image} className="mt-4 aspect-[4/3] w-full object-cover" />
              </div>
              <div>
                <p className="text-xs tracking-[0.22em] text-gold uppercase">{ordinals[index] ? `${ordinals[index]} услуга` : `Услуга ${index + 1}`}</p>
                <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <h2 className="font-serif text-4xl leading-tight">{service.title}</h2>
                  <p className="shrink-0 font-serif text-3xl">{service.price_display}</p>
                </div>
                {service.format && <p className="mt-3 text-muted">{service.format}</p>}
                <div className="mt-8 space-y-6">
                  {service.audience && (
                    <div className="flex gap-4">
                      <UserRound aria-hidden="true" className="mt-0.5 shrink-0 text-gold" size={20} strokeWidth={1.25} />
                      <div>
                        <p className="text-sm font-medium">Для кого</p>
                        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">{service.audience}</p>
                      </div>
                    </div>
                  )}
                  {service.result && (
                    <div className="flex gap-4">
                      <Target aria-hidden="true" className="mt-0.5 shrink-0 text-gold" size={20} strokeWidth={1.25} />
                      <div>
                        <p className="text-sm font-medium">Результат</p>
                        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted">{service.result}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href={`/kontakty?service=${service.id}`} className="inline-flex items-center gap-2 rounded-full bg-gold-button px-5 py-3 text-sm text-ink">
                    Узнать подробнее
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                  {telegram && (
                    <a href={telegram.url ?? undefined} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm">
                      <Send aria-hidden="true" size={16} />
                      Записаться в Telegram
                    </a>
                  )}
                  {whatsapp && (
                    <a href={whatsapp.url ?? undefined} className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-sm">
                      <MessageCircle aria-hidden="true" size={16} />
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

function PointIcon({ point }: { point: PageContent }) {
  const Icon = pointIcons[point.key] ?? Leaf
  return <Icon aria-hidden="true" className="mx-auto text-gold" size={28} strokeWidth={1.25} />
}

function ClosingBand({ block }: { block: Block }) {
  return (
    <section className="relative min-h-[28rem] overflow-hidden bg-ink text-ivory">
      <MediaImage image={block.image} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-ink/45" />
      <div className="relative mx-auto flex min-h-[28rem] w-full max-w-[80rem] flex-col justify-center px-5 py-16 md:px-10">
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
