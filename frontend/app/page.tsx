import type { Metadata } from 'next'
import { HomeView } from '@/components/home-view'
import { getContacts, getHome, safe } from '@/lib/api'

export async function generateMetadata(): Promise<Metadata> {
  const home = await safe(() => getHome())
  return {
    title: home?.data.seo.title || 'Golden Roe',
    description: home?.data.seo.description || undefined,
  }
}

export default async function HomePage() {
  const [home, contacts] = await Promise.all([safe(() => getHome()), safe(() => getContacts())])

  if (!home) {
    return (
      <section className="mx-auto w-full max-w-[80rem] px-5 py-20">
        <p>Не удалось загрузить страницу. Обновите её через минуту.</p>
      </section>
    )
  }

  return <HomeView home={home.data} contacts={contacts?.data ?? []} />
}
