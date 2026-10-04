import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDocument } from '@/lib/api'

type Props = { params: Promise<{ type: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  try {
    const page = await getDocument(type)
    return { title: page.data.label || 'Документ' }
  } catch {
    return { title: 'Документ' }
  }
}

export default async function DocumentPage({ params }: Props) {
  const { type } = await params
  const page = await getDocument(type).catch(() => null)
  if (!page) notFound()

  const document = page.data
  const hasBody = Boolean(document.body && document.body.replace(/<[^>]+>/g, '').trim())

  return (
    <section className="mx-auto w-full max-w-3xl px-5 pt-24 pb-16 md:pt-32 md:pb-24">
      <h1 className="font-serif text-5xl leading-tight md:text-6xl">{document.label}</h1>

      {hasBody ? (
        <div
          className="article-body mt-8 text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: document.body ?? '' }}
        />
      ) : document.has_file ? (
        <p className="mt-8 text-muted">Текст документа на сайте пока не загружен. Можно скачать PDF ниже.</p>
      ) : (
        <p className="mt-8 text-muted">Документ будет предоставлен заказчиком</p>
      )}

      {document.has_file && (
        <p className="mt-12 border-t border-line pt-8">
          <a
            href={`/documents/${document.type}/file`}
            className="inline-flex text-sm underline decoration-gold underline-offset-4"
            download={`${document.type}.pdf`}
          >
            Скачать PDF
          </a>
        </p>
      )}
    </section>
  )
}
