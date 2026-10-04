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
  const fileHref = `/documents/${document.type}/file`

  return (
    <section className="mx-auto w-full max-w-3xl px-5 pt-24 pb-16 md:pt-32 md:pb-24">
      <h1 className="font-serif text-5xl leading-tight md:text-6xl">{document.label}</h1>

      {hasBody ? (
        <div
          className="article-body mt-8 text-lg leading-relaxed"
          dangerouslySetInnerHTML={{ __html: document.body ?? '' }}
        />
      ) : document.has_file ? (
        <>
          <p className="mt-8 text-muted">
            Текст на сайте пока не извлечён. Откройте PDF ниже — на телефоне удобнее кнопка «Открыть PDF».
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href={fileHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex text-sm underline decoration-gold underline-offset-4"
            >
              Открыть PDF
            </a>
            <a href={fileHref} download={`${document.type}.pdf`} className="inline-flex text-sm underline decoration-gold underline-offset-4">
              Скачать PDF
            </a>
          </div>
          <iframe
            title={document.label}
            src={fileHref}
            className="mt-6 hidden h-[75vh] w-full border border-line bg-white md:block"
          />
        </>
      ) : (
        <p className="mt-8 text-muted">Документ будет предоставлен заказчиком</p>
      )}

      {hasBody && document.has_file && (
        <p className="mt-12 border-t border-line pt-8">
          <a
            href={fileHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex text-sm underline decoration-gold underline-offset-4"
          >
            Открыть PDF
          </a>
          <span className="mx-3 text-muted">·</span>
          <a href={fileHref} download={`${document.type}.pdf`} className="inline-flex text-sm underline decoration-gold underline-offset-4">
            Скачать PDF
          </a>
        </p>
      )}
    </section>
  )
}
