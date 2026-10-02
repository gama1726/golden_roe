import { useEffect, useState, type FormEvent } from 'react'
import { Button, Field, Notice, controlClass } from '../components/ui'
import { ContentPage } from './ContentPage'
import { api, errorText } from '../lib/api'
import type { ContactChannel } from '../lib/types'

export function ContactsPage() {
  const [items, setItems] = useState<ContactChannel[]>([])
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [draft, setDraft] = useState({ key: '', label: '', value: '' })

  async function load() {
    const response = await api.get<{ data: ContactChannel[] }>('/api/v1/admin/contacts')
    setItems(response.data.data)
  }

  useEffect(() => {
    load().catch((reason: unknown) => setError(errorText(reason)))
  }, [])

  async function save(channel: ContactChannel) {
    try {
      await api.patch(`/api/v1/admin/contacts/${channel.id}`, {
        key: channel.key,
        label: channel.label,
        value: channel.value,
        url: channel.url_override,
        is_public: channel.is_public,
        sort_order: channel.sort_order,
      })
      await load()
      setNotice('Сохранено')
      setError(null)
    } catch (reason) {
      setError(errorText(reason))
    }
  }

  async function create(event: FormEvent) {
    event.preventDefault()
    try {
      await api.post('/api/v1/admin/contacts', draft)
      setDraft({ key: '', label: '', value: '' })
      await load()
      setNotice('Канал добавлен')
    } catch (reason) {
      setError(errorText(reason))
    }
  }

  function update(id: number, patch: Partial<ContactChannel>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  return (
    <div className="space-y-12">
    <ContentPage page="contacts" title="Контакты" />
    <section className="space-y-4">
      <h2 className="font-serif text-4xl leading-none">Каналы связи</h2>
      <Notice text={notice} />
      <Notice text={error} />
      {items.map((channel) => (
        <form
          key={channel.id}
          className="space-y-3 rounded-3xl bg-white p-5"
          onSubmit={(event) => {
            event.preventDefault()
            void save(channel)
          }}
        >
          <h2 className="font-serif text-2xl">{channel.label}</h2>
          <p className="text-sm text-muted">Ссылка: {channel.url ?? 'будет собрана из значения'}</p>
          <Field label="Подпись">
            <input className={controlClass} value={channel.label} onChange={(event) => update(channel.id, { label: event.target.value })} />
          </Field>
          <Field label="Значение">
            <input className={controlClass} value={channel.value} onChange={(event) => update(channel.id, { value: event.target.value })} />
          </Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={channel.is_public} onChange={(event) => update(channel.id, { is_public: event.target.checked })} />
            Показывать на сайте
          </label>
          <Button type="submit">Сохранить</Button>
        </form>
      ))}
      <form onSubmit={create} className="space-y-3 rounded-3xl bg-white p-5">
        <h2 className="font-serif text-2xl">Новый канал</h2>
        <p className="text-sm text-muted">Для будущего адреса или соцсети. Пустые каналы не создаются заранее.</p>
        <Field label="Ключ, латиницей">
          <input className={controlClass} value={draft.key} onChange={(event) => setDraft({ ...draft, key: event.target.value })} placeholder="instagram" required />
        </Field>
        <Field label="Подпись">
          <input className={controlClass} value={draft.label} onChange={(event) => setDraft({ ...draft, label: event.target.value })} required />
        </Field>
        <Field label="Значение или ссылка">
          <input className={controlClass} value={draft.value} onChange={(event) => setDraft({ ...draft, value: event.target.value })} required />
        </Field>
        <Button type="submit">Добавить</Button>
      </form>
    </section>
    </div>
  )
}
