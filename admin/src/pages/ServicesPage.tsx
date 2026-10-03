import { ChevronDown, ChevronUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button, Field, Notice, TextArea, controlClass } from '../components/ui'
import { api, errorText, uploadImage } from '../lib/api'
import { usePageSave } from '../lib/save-bar'
import type { Service, StoredImage } from '../lib/types'
import { ContentPage } from './ContentPage'

const empty = { title: '', price: '', format: '', audience: '', result: '', is_active: true }

export function ServicesPage() {
  const [items, setItems] = useState<Service[]>([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState<number | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [image, setImage] = useState<StoredImage | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [baseline, setBaseline] = useState(JSON.stringify(empty))
  const formDirty = JSON.stringify(form) !== baseline || image !== null

  async function load() {
    const response = await api.get<{ data: Service[] }>('/api/v1/admin/services')
    setItems(response.data.data)
  }

  useEffect(() => {
    load().catch((reason: unknown) => setError(errorText(reason)))
  }, [])

  function notify(text: string) {
    setNotice(text)
    setError(null)
  }

  async function saveService() {
    if (!formDirty) return
    const payload: Record<string, unknown> = {
      title: form.title,
      price: Number(form.price),
      format: form.format,
      audience: form.audience,
      result: form.result,
      is_active: form.is_active,
    }
    if (image) payload.image = image
    if (editing) {
      await api.patch(`/api/v1/admin/services/${editing}`, payload)
    } else {
      await api.post('/api/v1/admin/services', payload)
    }
    setForm(empty)
    setEditing(null)
    setImage(null)
    setPreview(null)
    setBaseline(JSON.stringify(empty))
    await load()
    setError(null)
  }

  usePageSave('service-form', formDirty, saveService)

  function edit(service: Service) {
    setEditing(service.id)
    setForm({
      title: service.title,
      price: String(service.price),
      format: service.format,
      audience: service.audience,
      result: service.result,
      is_active: service.is_active,
    })
    setImage(null)
    setPreview(service.image?.original ?? null)
    setBaseline(
      JSON.stringify({
        title: service.title,
        price: String(service.price),
        format: service.format,
        audience: service.audience,
        result: service.result,
        is_active: service.is_active,
      }),
    )
  }

  async function onFile(file: File | undefined) {
    if (!file) return
    const uploaded = await uploadImage(file)
    setImage({ original: uploaded.original, webp: uploaded.webp, alt: uploaded.alt })
    setPreview(uploaded.urls.original)
  }

  async function remove(service: Service) {
    if (!window.confirm(`Удалить «${service.title}»?`)) return
    await api.delete(`/api/v1/admin/services/${service.id}`)
    await load()
    notify('Удалено')
  }

  async function move(index: number, direction: -1 | 1) {
    const next = [...items]
    const target = index + direction
    if (target < 0 || target >= next.length) return
    const current = next[index]
    const swap = next[target]
    if (!current || !swap) return
    next[index] = swap
    next[target] = current
    setItems(next)
    await api.patch('/api/v1/admin/services/reorder', { ids: next.map((item) => item.id) })
    notify('Порядок обновлён')
  }

  return (
    <div className="space-y-12">
    <ContentPage page="services" title="Услуги" />
    <section className="space-y-6">
      <h2 className="font-serif text-4xl leading-none">Карточки услуг</h2>
      <Notice text={notice} />
      <Notice text={error} />
      <div className="space-y-3">
        {items.map((service, index) => (
          <article key={service.id} className="rounded-3xl bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-2xl">{service.title}</h2>
                <p className="text-sm text-muted">
                  {service.price_display} · {service.format}
                  {service.is_active ? '' : ' · скрыта'}
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" onClick={() => move(index, -1)} aria-label="Выше">
                  <ChevronUp size={16} />
                </Button>
                <Button type="button" variant="ghost" onClick={() => move(index, 1)} aria-label="Ниже">
                  <ChevronDown size={16} />
                </Button>
                <Button type="button" variant="ghost" onClick={() => edit(service)}>
                  Изменить
                </Button>
                <Button type="button" variant="danger" onClick={() => remove(service)}>
                  Удалить
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="space-y-3 rounded-3xl bg-white p-5">
        <h2 className="font-serif text-2xl">{editing ? 'Редактирование' : 'Новая услуга'}</h2>
        <Field label="Название">
          <input className={controlClass} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
        </Field>
        <Field label="Цена, ₽">
          <input className={controlClass} type="number" min={0} value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} required />
        </Field>
        <Field label="Формат">
          <input className={controlClass} value={form.format} onChange={(event) => setForm({ ...form, format: event.target.value })} required />
        </Field>
        <Field label="Для кого">
          <TextArea value={form.audience} onChange={(event) => setForm({ ...form, audience: event.target.value })} required />
        </Field>
        <Field label="Результат">
          <TextArea value={form.result} onChange={(event) => setForm({ ...form, result: event.target.value })} required />
        </Field>
        <Field label="Изображение">
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onFile(event.target.files?.[0])} />
        </Field>
        {preview && <img src={preview} alt="" className="max-h-40 rounded-2xl object-cover" />}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} />
          Показывать на сайте
        </label>
        {editing && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setEditing(null)
              setForm(empty)
              setImage(null)
              setPreview(null)
              setBaseline(JSON.stringify(empty))
            }}
          >
            Отмена
          </Button>
        )}
      </div>
    </section>
    </div>
  )
}
