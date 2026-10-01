import type { Metadata } from 'next'
import { Mail, MessageCircle, Phone, Send } from 'lucide-react'
import { getContacts, getService, safe } from '@/lib/api'
import type { ContactChannel } from '@/lib/types'

export async function generateMetadata(): Promise<Metadata> {
  const page = await safe(() => getContacts())
  return {
    title: page?.seo.title || 'Контакты',
    description: page?.seo.description || undefined,
  }
}

function ChannelIcon({ name }: { name: string }) {
  if (name === 'telegram') return <Send aria-hidden="true" size={18} />
  if (name === 'whatsapp') return <MessageCircle aria-hidden="true" size={18} />
  if (name === 'email') return <Mail aria-hidden="true" size={18} />
  if (name === 'phone') return <Phone aria-hidden="true" size={18} />
  return null
}

function ChannelLink({ channel }: { channel: ContactChannel }) {
  const content = (
    <>
      <ChannelIcon name={channel.key} />
      <span>
        <span className="block text-xs tracking-[0.16em] text-gold uppercase">{channel.label}</span>
        <span className="mt-1 block text-lg">{channel.display}</span>
      </span>
    </>
  )

  if (!channel.url) {
    return <div className="flex items-start gap-3 border-t border-line py-5">{content}</div>
  }

  return (
    <a href={channel.url} className="flex items-start gap-3 border-t border-line py-5 hover:text-gold">
      {content}
    </a>
  )
}

export default async function ContactsPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const params = await searchParams
  const serviceId = Number(params.service)
  const [page, service] = await Promise.all([
    safe(() => getContacts()),
    Number.isInteger(serviceId) && serviceId > 0 ? getService(serviceId) : Promise.resolve(null),
  ])

  if (!page) {
    return (
      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <p>Не удалось загрузить страницу. Обновите её через минуту.</p>
      </section>
    )
  }

  const messengers = page.data.filter((channel) => channel.key === 'telegram' || channel.key === 'whatsapp')

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
      <h1 className="font-serif text-5xl leading-none md:text-7xl">{page.banner?.title || 'Контакты'}</h1>
      {page.banner?.text && <p className="mt-6 max-w-2xl text-muted">{page.banner.text}</p>}

      {service && (
        <div className="mt-10 max-w-2xl border-t border-gold pt-6">
          <p className="text-xs tracking-[0.18em] text-gold uppercase">Услуга</p>
          <h2 className="mt-3 font-serif text-4xl">{service.title}</h2>
          <p className="mt-3">{service.price_display}</p>
          <p className="mt-2 text-muted">{service.format}</p>
          {service.audience && <p className="mt-4">{service.audience}</p>}
          {service.result && <p className="mt-3 whitespace-pre-line text-muted">{service.result}</p>}
        </div>
      )}

      {messengers.length > 0 && (
        <div className="mt-12 flex flex-wrap gap-3">
          {messengers.map((channel) =>
            channel.url ? (
              <a key={channel.id} href={channel.url} className="bg-ink px-5 py-3 text-sm text-ivory">
                {channel.label}
              </a>
            ) : null,
          )}
        </div>
      )}

      <div className="mt-8 max-w-xl">
        {page.data.map((channel) => (
          <ChannelLink key={channel.id} channel={channel} />
        ))}
      </div>
    </section>
  )
}
