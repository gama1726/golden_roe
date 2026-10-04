import { useEffect, useState } from 'react'
import { RichText } from '../components/Editor'
import { Button, FilePicker, Notice, PageTitle, cardClass, cardHeadingClass } from '../components/ui'
import { api, errorText } from '../lib/api'
import type { DocumentItem } from '../lib/types'

export function DocumentsPage() {
  const [items, setItems] = useState<DocumentItem[]>([])
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)

  async function load() {
    const response = await api.get<{ data: DocumentItem[] }>('/api/v1/admin/documents')
    setItems(response.data.data)
    setDrafts(Object.fromEntries(response.data.data.map((document) => [document.type, document.body ?? ''])))
  }

  useEffect(() => {
    load().catch((reason: unknown) => setError(errorText(reason)))
  }, [])

  async function saveBody(type: string) {
    setSaving(type)
    try {
      await api.patch(`/api/v1/admin/documents/${type}`, { body: drafts[type] ?? '' })
      await load()
      setNotice('Текст сохранён. На сайте он отображается шрифтами сайта.')
      setError(null)
    } catch (reason) {
      setError(errorText(reason))
    } finally {
      setSaving(null)
    }
  }

  async function upload(type: string, file: File | undefined) {
    if (!file) return
    const body = new FormData()
    body.append('file', file)
    try {
      await api.post(`/api/v1/admin/documents/${type}`, body)
      await load()
      setNotice('PDF обновлён. Ссылка на скачивание внизу страницы документа.')
      setError(null)
    } catch (reason) {
      setError(errorText(reason))
    }
  }

  return (
    <section className="space-y-4">
      <PageTitle title="Документы" />
      <p className="text-sm text-muted">
        Текст на сайте — через редактор (как у статей). PDF опционален: кнопка скачивания внизу страницы.
      </p>
      <Notice text={notice} />
      <Notice text={error} />
      {items.map((document) => (
        <article key={document.type} className={cardClass}>
          <h2 className={cardHeadingClass}>{document.label}</h2>
          <p className="text-sm text-muted">
            {document.available
              ? document.has_file
                ? 'Текст на сайте · PDF для скачивания'
                : 'Только текст на сайте (PDF ещё нет)'
              : 'Нет текста и PDF — на сайте заглушка'}
          </p>
          <div className="space-y-3">
            <p className="text-sm text-muted">Текст на сайте</p>
            <RichText
              key={`${document.type}-${document.updated_at ?? 'new'}`}
              initial={drafts[document.type] ?? ''}
              onChange={(html) => setDrafts((current) => ({ ...current, [document.type]: html }))}
            />
            <Button type="button" disabled={saving === document.type} onClick={() => void saveBody(document.type)}>
              {saving === document.type ? 'Сохраняю…' : 'Сохранить текст'}
            </Button>
          </div>
          <FilePicker
            label="PDF для скачивания"
            accept="application/pdf,.pdf"
            buttonLabel="Выбрать PDF"
            hint={document.has_file ? 'Файл загружен' : 'Необязательно'}
            onPick={(file) => void upload(document.type, file)}
          />
        </article>
      ))}
    </section>
  )
}
