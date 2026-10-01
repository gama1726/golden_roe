import Link from 'next/link'
import type { Service } from '@/lib/types'

export function ServiceList({ services }: { services: Service[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {services.map((service) => (
        <article key={service.id} className="grid gap-6 py-10 md:grid-cols-[1.2fr_1fr] md:py-14">
          <div>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">{service.title}</h2>
            <p className="mt-4 text-lg">{service.price_display}</p>
            <p className="mt-2 text-muted">{service.format}</p>
          </div>
          <div className="space-y-4">
            {service.audience && <p>{service.audience}</p>}
            {service.result && <p className="whitespace-pre-line text-muted">{service.result}</p>}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={`/kontakty?service=${service.id}`} className="border border-ink px-4 py-2 text-sm">
                Узнать подробнее
              </Link>
              <Link href="/kontakty" className="bg-ink px-4 py-2 text-sm text-ivory">
                Записаться
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
