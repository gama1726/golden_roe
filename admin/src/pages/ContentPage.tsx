import { useEffect, useState } from 'react'
import { Button, Field, Notice, PageTitle, TextArea, controlClass } from '../components/ui'
import { api, errorText, uploadImage } from '../lib/api'
import type { AuthorStat, Banner, PageContent, StoredImage } from '../lib/types'

type Props = { page: 'home' | 'author' | 'services' | 'articles' | 'reviews'; title: string }

const blockLabel: Record<string, string> = {
  quote: 'Цитата на баннере',
  'point.system': 'Принцип: системный подход',
  'point.individual': 'Принцип: индивидуальные решения',
  'point.trust': 'Принцип: конфиденциальность',
  'point.results': 'Принцип: реальные изменения',
  cta: 'Нижний экран',
  path: 'Мой путь',
  'path.photo': 'Мой путь: фото справа',
  pillars: 'Точки опоры',
  'pillar.family': 'Точка опоры: семья',
  'pillar.spirit': 'Точка опоры: духовное развитие',
  'pillar.business': 'Точка опоры: предпринимательство',
  'pillar.creativity': 'Точка опоры: творчество',
  'pillar.health': 'Точка опоры: здоровье',
  'pillar.beauty': 'Точка опоры: эстетика',
  'pillar.quote': 'Цитата: точки опоры',
  son: 'Семья',
  'son.photo': 'Семья: фото справа',
  guide: 'Почему я могу быть проводником',
  'guide.experience': 'Пункт: предпринимательский опыт',
  'guide.person': 'Пункт: понимание человека',
  'guide.system': 'Пункт: системный подход',
  'guide.care': 'Пункт: честность и поддержка',
  'guide.growth': 'Пункт: живой пример',
  manifesto: 'Манифест',
  'manifesto.quote': 'Цитата манифеста',
  intro: 'Вступление к отзывам',
  'cta.note': 'Пояснение о проверке',
}

export function ContentPage({ page, title }: Props) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [blocks, setBlocks] = useState<PageContent[]>([])
  const [stats, setStats] = useState<AuthorStat[]>([])
  const [images, setImages] = useState<Record<string, StoredImage>>({})
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const [removed, setRemoved] = useState<Record<string, boolean>>({})
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const [bannerResponse, contentResponse] = await Promise.all([
      api.get<{ data: Banner[] }>(`/api/v1/admin/banners?page=${page}`),
      api.get<{ data: PageContent[] }>(`/api/v1/admin/page-contents?page=${page}`),
    ])
    setBanners(bannerResponse.data.data)
    setBlocks(contentResponse.data.data)
    if (page === 'author') {
      const statResponse = await api.get<{ data: AuthorStat[] }>('/api/v1/admin/author-stats')
      setStats(statResponse.data.data)
    }
  }

  useEffect(() => {
    load().catch((reason: unknown) => setError(errorText(reason)))
  }, [page])

  async function saveBanner(banner: Banner) {
    const payload: Record<string, unknown> = {
      title: banner.title,
      subtitle: banner.subtitle,
      text: banner.text,
    }
    const key = `banner-${banner.id}`
    if (images[key]) payload.image = images[key]
    else if (removed[key]) payload.image = null
    await api.patch(`/api/v1/admin/banners/${banner.id}`, payload)
    clearImageState(key)
    await load()
    setError(null)
    setNotice('Сохранено')
  }

  async function saveBlock(block: PageContent) {
    const payload: Record<string, unknown> = {
      eyebrow: block.eyebrow,
      title: block.title,
      body: block.body,
    }
    const key = `block-${block.id}`
    if (images[key]) payload.image = images[key]
    else if (removed[key]) payload.image = null
    await api.patch(`/api/v1/admin/page-contents/${block.id}`, payload)
    clearImageState(key)
    await load()
    setError(null)
    setNotice('Сохранено')
  }

  function clearImageState(key: string) {
    setImages((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
    setPreviews((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
    setRemoved((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  async function saveStat(stat: AuthorStat) {
    await api.patch(`/api/v1/admin/author-stats/${stat.id}`, {
      value: stat.value,
      label: stat.label,
      is_active: stat.is_active,
      sort_order: stat.sort_order,
    })
    setError(null)
    setNotice('Сохранено')
  }

  async function onFile(key: string, file: File | undefined) {
    if (!file) return
    const uploaded = await uploadImage(file)
    setImages((current) => ({
      ...current,
      [key]: { original: uploaded.original, webp: uploaded.webp, alt: uploaded.alt },
    }))
    if (uploaded.urls.original) {
      setPreviews((current) => ({ ...current, [key]: uploaded.urls.original as string }))
    }
    setRemoved((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  function removeImage(key: string) {
    setRemoved((current) => ({ ...current, [key]: true }))
    setImages((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
    setPreviews((current) => {
      const next = { ...current }
      delete next[key]
      return next
    })
  }

  return (
    <section className="space-y-4">
      <PageTitle title={title} />
      <p className="text-sm text-muted">Тексты и фотографии этой страницы берутся отсюда. Чтобы заменить картинку, выберите файл и сохраните. Пустое поле на сайте остаётся пустым.</p>
      <Notice text={notice} />
      <Notice text={error} />
      {banners.map((banner) => (
        <form
          key={banner.id}
          className="space-y-3 rounded-3xl bg-white p-5"
          onSubmit={(event) => {
            event.preventDefault()
            saveBanner(banner).catch((reason: unknown) => setError(errorText(reason)))
          }}
        >
          <h2 className="font-serif text-2xl">Баннер первого экрана</h2>
          <Field label="Заголовок">
            <input className={controlClass} value={banner.title ?? ''} onChange={(event) => setBanners(banners.map((item) => item.id === banner.id ? { ...item, title: event.target.value } : item))} />
          </Field>
          <Field label="Подзаголовок">
            <input className={controlClass} value={banner.subtitle ?? ''} onChange={(event) => setBanners(banners.map((item) => item.id === banner.id ? { ...item, subtitle: event.target.value } : item))} />
          </Field>
          <Field label="Текст">
            <TextArea value={banner.text ?? ''} onChange={(event) => setBanners(banners.map((item) => item.id === banner.id ? { ...item, text: event.target.value } : item))} />
          </Field>
          <ImageEditor
            label="Изображение баннера"
            inputKey={`banner-${banner.id}`}
            current={banner.image?.original ?? null}
            preview={previews[`banner-${banner.id}`] ?? null}
            removed={removed[`banner-${banner.id}`] ?? false}
            onPick={onFile}
            onRemove={removeImage}
          />
          <Button type="submit">Сохранить баннер</Button>
        </form>
      ))}
      {page === 'author' && stats.map((stat) => (
        <form
          key={stat.id}
          className="grid gap-3 rounded-3xl bg-white p-5 sm:grid-cols-[120px_1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault()
            saveStat(stat).catch((reason: unknown) => setError(errorText(reason)))
          }}
        >
          <Field label="Число">
            <input className={controlClass} value={stat.value ?? ''} onChange={(event) => setStats(stats.map((item) => item.id === stat.id ? { ...item, value: event.target.value } : item))} />
          </Field>
          <Field label="Подпись">
            <input className={controlClass} value={stat.label} onChange={(event) => setStats(stats.map((item) => item.id === stat.id ? { ...item, label: event.target.value } : item))} />
          </Field>
          <div className="flex items-end">
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      ))}
      {blocks.map((block) => (
        <form
          key={block.id}
          className="space-y-3 rounded-3xl bg-white p-5"
          onSubmit={(event) => {
            event.preventDefault()
            saveBlock(block).catch((reason: unknown) => setError(errorText(reason)))
          }}
        >
          <h2 className="font-serif text-2xl">{blockLabel[block.key] ?? block.key}</h2>
          <Field label="Надзаголовок">
            <input className={controlClass} value={block.eyebrow ?? ''} onChange={(event) => setBlocks(blocks.map((item) => item.id === block.id ? { ...item, eyebrow: event.target.value } : item))} />
          </Field>
          <Field label="Заголовок">
            <input className={controlClass} value={block.title ?? ''} onChange={(event) => setBlocks(blocks.map((item) => item.id === block.id ? { ...item, title: event.target.value } : item))} />
          </Field>
          <Field label="Текст">
            <TextArea
              value={block.body ?? ''}
              placeholder="Текст будет предоставлен заказчиком"
              onChange={(event) => setBlocks(blocks.map((item) => item.id === block.id ? { ...item, body: event.target.value } : item))}
            />
          </Field>
          <ImageEditor
            label="Изображение блока"
            inputKey={`block-${block.id}`}
            current={block.image?.original ?? null}
            preview={previews[`block-${block.id}`] ?? null}
            removed={removed[`block-${block.id}`] ?? false}
            onPick={onFile}
            onRemove={removeImage}
          />
          <Button type="submit">Сохранить блок</Button>
        </form>
      ))}
    </section>
  )
}

function ImageEditor({
  label,
  inputKey,
  current,
  preview,
  removed,
  onPick,
  onRemove,
}: {
  label: string
  inputKey: string
  current: string | null
  preview: string | null
  removed: boolean
  onPick: (key: string, file: File | undefined) => void
  onRemove: (key: string) => void
}) {
  const shown = preview ?? (removed ? null : current)

  return (
    <Field label={label}>
      <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onPick(inputKey, event.target.files?.[0])} />
      {shown && <img src={shown} alt="" className="mt-3 max-h-48 rounded-2xl object-cover" />}
      {shown && (
        <button type="button" className="mt-2 text-sm text-muted underline" onClick={() => onRemove(inputKey)}>
          Убрать изображение
        </button>
      )}
    </Field>
  )
}
