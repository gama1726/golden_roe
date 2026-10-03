import type { Metadata } from 'next'
import { AuthorView } from '@/components/author-view'
import { getAuthor, safe } from '@/lib/api'

export async function generateMetadata(): Promise<Metadata> {
  const page = await safe(() => getAuthor())
  return {
    title: page?.data.seo.title || 'Об авторе',
    description: page?.data.seo.description || undefined,
  }
}

export default async function AuthorPage() {
  const page = await safe(() => getAuthor())

  if (!page) {
    return (
      <section className="mx-auto w-full max-w-[80rem] px-5 py-20">
        <p>Не удалось загрузить страницу. Обновите её через минуту.</p>
      </section>
    )
  }

  return <AuthorView author={page.data} />
}
