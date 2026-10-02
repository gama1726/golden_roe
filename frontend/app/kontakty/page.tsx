import type { Metadata } from 'next'
import { ContactsView } from '@/components/contacts-view'
import { getContacts, getService, safe } from '@/lib/api'

export async function generateMetadata(): Promise<Metadata> {
  const page = await safe(() => getContacts())
  return {
    title: page?.seo.title || 'Контакты',
    description: page?.seo.description || undefined,
  }
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

  return (
    <ContactsView
      banner={page.banner}
      greeting={page.blocks.greeting}
      reach={page.blocks.reach}
      promise={page.blocks.promise}
      points={page.blocks.points}
      scene={page.blocks.scene}
      consult={page.blocks.consult}
      channels={page.data}
      service={service}
    />
  )
}
