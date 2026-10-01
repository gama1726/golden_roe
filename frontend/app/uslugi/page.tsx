import type { Metadata } from 'next'
import { MediaImage } from '@/components/media-image'
import { ServiceList } from '@/components/service-list'
import { getServices, safe } from '@/lib/api'

export async function generateMetadata(): Promise<Metadata> {
  const page = await safe(() => getServices())
  return {
    title: page?.seo.title || 'Услуги',
    description: page?.seo.description || undefined,
  }
}

export default async function ServicesPage() {
  const page = await safe(() => getServices())

  if (!page) {
    return (
      <section className="mx-auto w-full max-w-6xl px-5 py-20">
        <p>Не удалось загрузить страницу. Обновите её через минуту.</p>
      </section>
    )
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-16 md:py-24">
      <h1 className="font-serif text-5xl leading-none md:text-7xl">{page.banner?.title || 'Услуги'}</h1>
      {page.banner?.subtitle && <p className="mt-6 max-w-2xl font-serif text-3xl">{page.banner.subtitle}</p>}
      {page.banner?.text && <p className="mt-4 max-w-2xl text-muted">{page.banner.text}</p>}
      <MediaImage image={page.banner?.image ?? null} className="mt-8 max-h-[28rem] w-full object-cover" />
      <div className="mt-12">
        {page.data.length > 0 ? <ServiceList services={page.data} /> : <p className="text-muted">Услуги пока не опубликованы.</p>}
      </div>
    </section>
  )
}
