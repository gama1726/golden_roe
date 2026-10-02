import { MediaImage } from '@/components/media-image'
import type { Banner, Block, ContactChannel, PageContent, Service } from '@/lib/types'
import { ArrowRight, Calendar, Clock, Heart, Mail, MessageCircle, Phone, Quote, Send, Shield, type LucideIcon } from 'lucide-react'

const pointIcons: Record<string, LucideIcon> = {
  'point.reply': Clock,
  'point.booking': Calendar,
  'point.personal': Heart,
  'point.privacy': Shield,
}

const channelIcons: Record<string, LucideIcon> = {
  telegram: Send,
  whatsapp: MessageCircle,
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
      <section className="relative min-h-[38rem] overflow-hidden bg-ink text-ivory md:min-h-[44rem]">
        <MediaImage image={banner?.image ?? null} className="absolute inset-0 h-full w-full object-cover object-[68%_center]" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/10" />
        <div className="relative mx-auto flex min-h-[38rem] w-full max-w-[80rem] items-center md:min-h-[44rem]">
          <div className="w-full max-w-xl px-5 py-16 md:px-10 md:py-20">
            {banner?.title && <p className="text-xs tracking-[0.28em] text-gold uppercase">{banner.title}</p>}
            <h1 className="mt-5 font-serif text-5xl leading-[0.95] font-medium md:text-7xl">{banner?.subtitle || 'Контакты'}</h1>
            {greeting?.title && <p className="mt-5 font-serif text-3xl leading-tight md:text-4xl">{greeting.title}</p>}
            {banner?.text && <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/80">{banner.text}</p>}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[80rem] px-5 py-16 md:px-10 md:py-24">
        {service && (
          <div className="mb-14 max-w-2xl border-t border-gold pt-6">
            <p className="text-xs tracking-[0.18em] text-gold uppercase">Услуга</p>
            <h2 className="mt-3 font-serif text-4xl">{service.title}</h2>
            <p className="mt-3">{service.price_display}</p>
            <p className="mt-2 text-muted">{service.format}</p>
            {service.audience && <p className="mt-4">{service.audience}</p>}
            {service.result && <p className="mt-3 whitespace-pre-line text-muted">{service.result}</p>}
          </div>
        )}

        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,36rem)_minmax(0,18rem)]">
          <div>
            {reach?.title && <h2 className="font-serif text-4xl leading-none md:text-6xl">{reach.title}</h2>}
            {reach?.body && <p className="mt-6 max-w-md leading-relaxed text-muted">{reach.body}</p>}
            <div className="mt-8 max-w-xl">
              {channels.map((channel) => (
                <ChannelLink key={channel.id} channel={channel} />
              ))}
            </div>
            <MessengerButtons telegram={telegram} whatsapp={whatsapp} />
          </div>
          {promise?.title && (
            <blockquote className="lg:pt-6">
              <Quote aria-hidden="true" className="text-gold" size={36} strokeWidth={1.25} />
              <p className="mt-4 font-serif text-2xl leading-snug text-gold italic md:text-3xl">{promise.title}</p>
            </blockquote>
          )}
        </div>
      </section>

      {points.length > 0 && (
        <section className="bg-cream">
          <div className="mx-auto grid w-full max-w-[80rem] gap-10 px-5 py-14 sm:grid-cols-2 md:px-10 lg:grid-cols-4">
            {points.map((point) => {
              const Icon = pointIcons[point.key] ?? Heart
              return (
                <div key={point.key}>
                  <Icon aria-hidden="true" className="text-gold" size={28} strokeWidth={1.25} />
                  {point.title && <h3 className="mt-4 font-serif text-2xl">{point.title}</h3>}
                  {point.body && <p className="mt-2 text-sm leading-relaxed text-muted">{point.body}</p>}
                </div>
              )
            })}
          </div>
        </section>
      )}

      {(scene?.image || consult) && (
        <section className="mx-auto grid w-full max-w-[80rem] items-stretch gap-6 px-5 py-16 md:px-10 md:py-24 lg:grid-cols-2">
          {scene?.image && (
            <div className="relative h-full min-h-72 overflow-hidden rounded-3xl">
              <MediaImage image={scene.image} className="absolute inset-0 h-full w-full object-cover" />
              {(scene.title || scene.body) && (
                <div className="relative flex min-h-72 flex-col justify-end bg-gradient-to-t from-ink/75 via-ink/25 to-transparent p-8 text-ivory">
                  {scene.title && <h2 className="font-serif text-4xl">{scene.title}</h2>}
                  {scene.body && <p className="mt-3 max-w-sm leading-relaxed text-ivory/85">{scene.body}</p>}
                </div>
              )}
            </div>
          )}
          {consult && (
            <div className="flex flex-col justify-center rounded-3xl bg-cream px-6 py-10 md:px-10">
              <Calendar aria-hidden="true" className="text-gold" size={28} strokeWidth={1.25} />
              {consult.title && <h2 className="mt-5 font-serif text-4xl leading-tight">{consult.title}</h2>}
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
    <div className="mt-8 flex flex-wrap gap-3">
      {telegram?.url && (
        <a href={telegram.url} className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm text-ivory">
          Написать в Telegram
          <ArrowRight aria-hidden="true" size={16} />
        </a>
      )}
      {whatsapp?.url && (
        <a href={whatsapp.url} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-sm">
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
      <span>
        <span className="block text-xs tracking-[0.16em] text-gold uppercase">{channel.label}</span>
        <span className="mt-1 block text-lg">{channel.display}</span>
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
