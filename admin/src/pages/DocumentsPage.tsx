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
  const [busy, setBusy] = useState<string | null>(null)

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

  async function upload(type: string, file: File | undefined, replaceBody: boolean) {
    if (!file) return
    const body = new FormData()
    body.append('file', file)
    if (replaceBody) {
      body.append('replace_body', '1')
    }
    setBusy(type)
    try {
      const response = await api.post<{ data: DocumentItem; meta?: { extracted?: boolean; body_replaced?: boolean } }>(
        `/api/v1/admin/documents/${type}`,
        body,
      )
      await load()
      const extracted = response.data.meta?.extracted
      const replaced = response.data.meta?.body_replaced
      if (replaced) {
        setNotice('PDF загружен, текст извлечён в редактор. Проверьте заголовки и списки, затем сохраните при правках.')
      } else if (extracted === false || !response.data.data.body) {
        setNotice('PDF загружен. Текст извлечь не удалось (часто так со сканами) — вставьте вручную или откройте PDF на сайте.')
      } else {
        setNotice('PDF обновлён. Существующий текст на сайте не перезаписан. Чтобы заменить — «Переизвлечь из PDF».')
      }
      setError(null)
    } catch (reason) {
      setError(errorText(reason))
    } finally {
      setBusy(null)
    }
  }

  async function extract(type: string) {
    if (!window.confirm('Перезаписать текст на сайте содержимым из текущего PDF?')) return
    setBusy(type)
    try {
      await api.post(`/api/v1/admin/documents/${type}/extract`)
      await load()
      setNotice('Текст переизвлечён из PDF. Проверьте разметку в редакторе.')
      setError(null)
    } catch (reason) {
      setError(errorText(reason))
    } finally {
      setBusy(null)
    }
  }

  return (
    <section className="space-y-4">
      <PageTitle title="Документы" />
      <p className="text-sm text-muted">
        Загрузите PDF — файл будет для скачивания/просмотра. Текст по возможности извлекается в редактор (можно поправить). На сайте
        показывается текст; если текста нет — PDF.
      </p>
      <Notice text={notice} />
      <Notice text={error} />
      {items.map((document) => (
        <article key={document.type} className={cardClass}>
          <h2 className={cardHeadingClass}>{document.label}</h2>
          <p className="text-sm text-muted">
            {document.available
              ? document.has_file
                ? document.body
                  ? 'Текст на сайте · PDF для скачивания/просмотра'
                  : 'Только PDF (текст ещё не извлечён)'
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
            <div className="flex flex-wrap gap-2">
              <Button type="button" disabled={saving === document.type || busy === document.type} onClick={() => void saveBody(document.type)}>
                {saving === document.type ? 'Сохраняю…' : 'Сохранить текст'}
              </Button>
              {document.has_file && (
                <Button type="button" variant="ghost" disabled={busy === document.type} onClick={() => void extract(document.type)}>
                  {busy === document.type ? 'Извлекаю…' : 'Переизвлечь из PDF'}
                </Button>
              )}
            </div>
          </div>
          <FilePicker
            label="PDF"
            accept="application/pdf,.pdf"
            buttonLabel={busy === document.type ? 'Загружаю…' : 'Выбрать PDF'}
            hint={document.has_file ? 'Файл загружен. Новый файл не затрёт текст, пока не нажмёте «Переизвлечь».' : 'При первой загрузке текст попробуем извлечь автоматически'}
            onPick={(file) => void upload(document.type, file, !document.body)}
          />
        </article>
      ))}
    </section>
  )
}
