import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getDocuments } from '@/lib/api'

type Props = { params: Promise<{ type: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { type } = await params
  const documents = await getDocuments().catch(() => null)
  const document = documents?.data.find((item) => item.type === type)
  return { title: document?.label || 'Документ' }
}

export default async function DocumentPage({ params }: Props) {
  const { type } = await params
  const documents = await getDocuments().catch(() => null)
  const document = documents?.data.find((item) => item.type === type)
  if (!document) notFound()

  return (
    <section className="mx-auto w-full max-w-[80rem] px-5 pt-24 pb-16 md:pt-32 md:pb-24">
      <h1 className="font-serif text-5xl leading-tight md:text-6xl">{document.label}</h1>
      {document.available ? (
        <div className="mt-8">
          <a href={`/documents/${document.type}/file`} className="text-sm underline decoration-gold underline-offset-4">
            Открыть PDF
          </a>
          <iframe title={document.label} src={`/documents/${document.type}/file`} className="mt-6 h-[75vh] w-full border border-line bg-white" />
        </div>
      ) : (
        <p className="mt-8 text-muted">Документ будет предоставлен заказчиком</p>
      )}
    </section>
  )
}
