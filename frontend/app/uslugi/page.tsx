import type { Metadata } from 'next'
import { ServicesView } from '@/components/services-view'
import { getContacts, getServices, safe } from '@/lib/api'
import { pageMetadata } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const page = await safe(() => getServices())
  return pageMetadata({
    pageKey: 'services',
    path: '/uslugi',
    seo: page?.seo,
    image: page?.banner?.image ?? null,
  })
}

export default async function ServicesPage() {
  const [page, contacts] = await Promise.all([safe(() => getServices()), safe(() => getContacts())])

  if (!page) {
    return (
      <section className="mx-auto w-full max-w-[80rem] px-5 py-20">
        <p>Не удалось загрузить страницу. Обновите её через минуту.</p>
      </section>
    )
  }

  return <ServicesView page={page} contacts={contacts?.data ?? []} />
}
