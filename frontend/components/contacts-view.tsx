import { MarbleBand, marbleStyle } from '@/components/marble-band'
import { MediaImage } from '@/components/media-image'
import { SiteQuote, cleanQuoteText } from '@/components/site-quote'
import type { Banner, Block, ContactChannel, PageContent, Service } from '@/lib/types'
import { TelegramIcon } from '@/components/telegram-icon'
import { WhatsAppIcon } from '@/components/whatsapp-icon'
import { ArrowRight, Calendar, Clock, Heart, Mail, MessageCircle, Phone, Shield, type LucideIcon } from 'lucide-react'

const pointIcons: Record<string, LucideIcon> = {
  'point.reply': Clock,
  'point.booking': Calendar,
  'point.personal': Heart,
  'point.privacy': Shield,
}

const channelIcons: Record<string, LucideIcon | typeof WhatsAppIcon | typeof TelegramIcon> = {
  telegram: TelegramIcon,
  whatsapp: WhatsAppIcon,
  email: Mail,
  phone: Phone,
}

export function ContactsView({
  banner,
  greeting,
  reach,
  promise,
  points,
  scene,
  consult,
  channels,
  service,
}: {
  banner: Banner | null
  greeting: Block | null
  reach: Block | null
  promise: Block | null
  points: PageContent[]
  scene: Block | null
  consult: Block | null
  channels: ContactChannel[]
  service: Service | null
}) {
  const telegram = channels.find((channel) => channel.key === 'telegram' && channel.url)
  const whatsapp = channels.find((channel) => channel.key === 'whatsapp' && channel.url)

  return (
    <>
      <section className="relative min-h-[30rem] overflow-hidden bg-ink text-ivory sm:min-h-[34rem] md:min-h-[40rem] lg:min-h-[44rem]">
        <MediaImage image={banner?.image ?? null} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[82%_center] sm:object-[72%_center] lg:object-[68%_center]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent sm:via-ink/30" />
        <div className="relative z-10 mx-auto flex min-h-[30rem] w-full max-w-[80rem] items-center sm:min-h-[34rem] md:min-h-[40rem] lg:min-h-[44rem]">
          <div className="w-full max-w-xl px-4 py-12 sm:px-5 sm:py-16 md:px-10 md:py-20">
            {banner?.title && <p className="text-[0.7rem] tracking-[0.22em] text-gold uppercase sm:text-xs sm:tracking-[0.28em]">{banner.title}</p>}
            <h1 className="mt-4 font-serif text-4xl leading-[0.95] font-medium min-[380px]:text-5xl md:text-6xl lg:text-7xl">{banner?.subtitle || 'Контакты'}</h1>
            {greeting?.title && <p className="mt-4 font-serif text-2xl leading-tight min-[380px]:text-3xl md:mt-5 md:text-4xl">{greeting.title}</p>}
            {banner?.text && <p className="mt-5 max-w-md text-sm leading-relaxed text-ivory/80 sm:mt-6 sm:text-base">{banner.text}</p>}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[80rem] px-4 py-12 sm:px-5 sm:py-16 md:px-10 md:py-20 lg:py-24">
        {service && (
          <div className="mb-10 max-w-2xl border-t border-gold pt-6 sm:mb-14">
            <p className="text-xs tracking-[0.18em] text-gold uppercase">Услуга</p>
            <h2 className="mt-3 font-serif text-3xl sm:text-4xl">{service.title}</h2>
            <p className="mt-3">{service.price_display}</p>
            <p className="mt-2 text-muted">{service.format}</p>
            {service.audience && <p className="mt-4">{service.audience}</p>}
            {service.result && <p className="mt-3 whitespace-pre-line text-muted">{service.result}</p>}
          </div>
        )}

        <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_minmax(12rem,16rem)] md:gap-8 lg:grid-cols-[minmax(0,36rem)_minmax(0,18rem)] lg:gap-12">
          <div className="min-w-0">
            {reach?.title && <h2 className="font-serif text-4xl leading-none md:text-5xl lg:text-6xl">{reach.title}</h2>}
            {reach?.body && <p className="mt-6 max-w-md leading-relaxed text-muted">{reach.body}</p>}
            <div className="mt-8 max-w-xl">
              {channels.map((channel) => (
                <ChannelLink key={channel.id} channel={channel} />
              ))}
            </div>
            <MessengerButtons telegram={telegram} whatsapp={whatsapp} />
          </div>
          {promise?.title && (
            <SiteQuote className="md:pt-2 lg:pt-6">{cleanQuoteText(promise.title)}</SiteQuote>
          )}
        </div>
      </section>

      {points.length > 0 && (
        <MarbleBand seed="contacts-points">
          <div className="mx-auto grid w-full max-w-[80rem] grid-cols-1 gap-8 px-4 py-12 min-[380px]:grid-cols-2 sm:px-5 md:gap-10 md:px-10 md:py-14 lg:grid-cols-4">
            {points.map((point) => {
              const Icon = pointIcons[point.key] ?? Heart
              return (
                <div key={point.key} className="min-w-0">
                  <Icon aria-hidden="true" className="text-gold" size={28} strokeWidth={1.25} />
                  {point.title && <h3 className="mt-4 font-serif text-xl md:text-2xl">{point.title}</h3>}
                  {point.body && <p className="mt-2 text-sm leading-relaxed text-muted">{point.body}</p>}
                </div>
              )
            })}
          </div>
        </MarbleBand>
      )}

      {(scene?.image || consult) && (
        <section className="mx-auto grid w-full max-w-[80rem] items-stretch gap-4 px-4 py-12 sm:px-5 sm:py-16 md:grid-cols-2 md:gap-6 md:px-10 md:py-20 lg:py-24">
          {scene?.image && (
            <div className="relative aspect-[5/4] overflow-hidden rounded-3xl md:aspect-auto md:h-full md:min-h-80">
              <MediaImage image={scene.image} className="absolute inset-0 h-full w-full object-cover" />
              {(scene.title || scene.body) && (
                <div className="relative flex h-full min-h-64 flex-col justify-end bg-gradient-to-t from-ink/75 via-ink/25 to-transparent p-6 text-ivory sm:p-8">
                  {scene.title && <h2 className="font-serif text-3xl sm:text-4xl">{scene.title}</h2>}
                  {scene.body && <p className="mt-3 max-w-sm leading-relaxed text-ivory/85">{scene.body}</p>}
                </div>
              )}
            </div>
          )}
          {consult && (
            <div className="flex flex-col justify-center overflow-hidden rounded-3xl px-5 py-8 sm:px-8 md:px-10" style={marbleStyle('contacts-consult')}>
              <Calendar aria-hidden="true" className="text-gold" size={28} strokeWidth={1.25} />
              {consult.title && <h2 className="mt-5 font-serif text-3xl leading-tight sm:text-4xl">{consult.title}</h2>}
              {consult.body && <p className="mt-4 max-w-md leading-relaxed text-muted">{consult.body}</p>}
              <MessengerButtons telegram={telegram} whatsapp={whatsapp} />
            </div>
          )}
        </section>
      )}
    </>
  )
}

function MessengerButtons({ telegram, whatsapp }: { telegram?: ContactChannel; whatsapp?: ContactChannel }) {
  if (!telegram && !whatsapp) return null

  return (
    <div className="mt-8 flex flex-col gap-3 min-[380px]:flex-row min-[380px]:flex-wrap">
      {telegram?.url && (
        <a href={telegram.url} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold-button px-5 py-3 text-sm text-ink">
          Написать в Telegram
          <ArrowRight aria-hidden="true" size={16} />
        </a>
      )}
      {whatsapp?.url && (
        <a href={whatsapp.url} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm">
          Написать в WhatsApp
        </a>
      )}
    </div>
  )
}

function ChannelLink({ channel }: { channel: ContactChannel }) {
  const Icon = channelIcons[channel.key] ?? MessageCircle
  const content = (
    <>
      <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
        <Icon aria-hidden="true" size={16} strokeWidth={1.5} />
      </span>
      <span className="min-w-0">
        <span className="block text-xs tracking-[0.16em] text-gold uppercase">{channel.label}</span>
        <span className="mt-1 block text-base break-words sm:text-lg">{channel.display}</span>
      </span>
    </>
  )

  if (!channel.url) {
    return <div className="flex items-start gap-4 border-t border-line py-5">{content}</div>
  }

  return (
    <a href={channel.url} className="flex items-start gap-4 border-t border-line py-5 hover:text-gold">
      {content}
    </a>
  )
}
