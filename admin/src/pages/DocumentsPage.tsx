import { useEffect, useState } from 'react'
import { FilePicker, Notice, PageTitle, cardClass, cardHeadingClass } from '../components/ui'
import { api, errorText } from '../lib/api'
import type { DocumentItem } from '../lib/types'

export function DocumentsPage() {
  const [items, setItems] = useState<DocumentItem[]>([])
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const response = await api.get<{ data: DocumentItem[] }>('/api/v1/admin/documents')
    setItems(response.data.data)
  }

  useEffect(() => {
    load().catch((reason: unknown) => setError(errorText(reason)))
  }, [])

  async function upload(type: string, file: File | undefined) {
    if (!file) return
    const body = new FormData()
    body.append('file', file)
    try {
      await api.post(`/api/v1/admin/documents/${type}`, body)
      await load()
      setNotice('Файл заменён. Публичная ссылка не изменилась.')
      setError(null)
    } catch (reason) {
      setError(errorText(reason))
    }
  }

  return (
    <section className="space-y-4">
      <PageTitle title="Документы" />
      <p className="text-sm text-muted">Тексты готовит заказчик. Здесь только загрузка PDF.</p>
      <Notice text={notice} />
      <Notice text={error} />
      {items.map((document) => (
        <article key={document.type} className={cardClass}>
          <h2 className={cardHeadingClass}>{document.label}</h2>
          <p className="text-sm text-muted">{document.available ? 'Файл загружен' : 'Документ будет предоставлен заказчиком'}</p>
          <p className="text-xs text-muted break-all">{document.url}</p>
          <FilePicker
            label="PDF"
            accept="application/pdf,.pdf"
            buttonLabel="Выбрать PDF"
            hint={document.available ? 'Файл загружен' : 'Только PDF'}
            onPick={(file) => void upload(document.type, file)}
          />
        </article>
      ))}
    </section>
  )
}
