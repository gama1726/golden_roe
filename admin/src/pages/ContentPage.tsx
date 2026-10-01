import { useEffect, useState } from 'react'
import { Button, Field, Notice, PageTitle, TextArea, controlClass } from '../components/ui'
import { api, errorText, uploadImage } from '../lib/api'
import type { AuthorStat, Banner, PageContent, StoredImage } from '../lib/types'

type Props = { page: 'home' | 'author'; title: string }

export function ContentPage({ page, title }: Props) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [blocks, setBlocks] = useState<PageContent[]>([])
  const [stats, setStats] = useState<AuthorStat[]>([])
  const [images, setImages] = useState<Record<string, StoredImage>>({})
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
    const image = images[`banner-${banner.id}`]
    if (image) payload.image = image
    await api.patch(`/api/v1/admin/banners/${banner.id}`, payload)
    setError(null)
    setNotice('Сохранено')
  }

  async function saveBlock(block: PageContent) {
    const payload: Record<string, unknown> = {
      eyebrow: block.eyebrow,
      title: block.title,
      body: block.body,
    }
    const image = images[`block-${block.id}`]
    if (image) payload.image = image
    await api.patch(`/api/v1/admin/page-contents/${block.id}`, payload)
    setError(null)
    setNotice('Сохранено')
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
  }

  return (
    <section className="space-y-4">
      <PageTitle title={title} />
      <p className="text-sm text-muted">Если текста нет, оставьте поле пустым. На сайте пустой блок не заполняется выдуманным текстом.</p>
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
          <h2 className="font-serif text-2xl">Баннер</h2>
          <Field label="Заголовок">
            <input className={controlClass} value={banner.title ?? ''} onChange={(event) => setBanners(banners.map((item) => item.id === banner.id ? { ...item, title: event.target.value } : item))} />
          </Field>
          <Field label="Подзаголовок">
            <input className={controlClass} value={banner.subtitle ?? ''} onChange={(event) => setBanners(banners.map((item) => item.id === banner.id ? { ...item, subtitle: event.target.value } : item))} />
          </Field>
          <Field label="Текст">
            <TextArea value={banner.text ?? ''} onChange={(event) => setBanners(banners.map((item) => item.id === banner.id ? { ...item, text: event.target.value } : item))} />
          </Field>
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onFile(`banner-${banner.id}`, event.target.files?.[0])} />
          {banner.image?.original && <img src={banner.image.original} alt="" className="max-h-48 rounded-2xl object-cover" />}
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
          <p className="text-xs tracking-wide text-muted uppercase">{block.key}</p>
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
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onFile(`block-${block.id}`, event.target.files?.[0])} />
          <Button type="submit">Сохранить блок</Button>
        </form>
      ))}
    </section>
  )
}
