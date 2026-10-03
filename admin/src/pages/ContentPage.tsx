import { useEffect, useState } from 'react'
import { Field, Notice, PageTitle, TextArea, controlClass } from '../components/ui'
import { api, errorText, uploadImage } from '../lib/api'
import { usePageSave } from '../lib/save-bar'
import type { AuthorStat, Banner, PageContent, StoredImage } from '../lib/types'

type Props = { page: 'home' | 'author' | 'services' | 'articles' | 'reviews' | 'contacts'; title: string }

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
  approach: 'Обо мне',
  results: 'Результаты',
  choice: 'Финальный акцент',
  'result.housing': 'Результат: жильё',
  'result.income': 'Результат: рост доходов',
  'result.businesses': 'Результат: новые бизнесы',
  'result.family': 'Результат: семья',
  'result.health': 'Результат: здоровье',
  'result.children': 'Результат: рождение детей',
  'anchor.beauty': 'Якорь: индустрия красоты',
  'anchor.business': 'Якорь: предпринимательство',
  'anchor.motherhood': 'Якорь: материнство',
  'anchor.manifesto': 'Якорь: манифест',
  'cta.note': 'Пояснение о проверке',
  greeting: 'Приветствие под заголовком',
  reach: 'Свяжитесь со мной',
  promise: 'Цитата',
  'point.reply': 'Быстро отвечаю',
  'point.booking': 'Удобная запись',
  'point.personal': 'Индивидуальный подход',
  'point.privacy': 'Конфиденциальность',
  scene: 'Фото внизу страницы',
  consult: 'Записаться на консультацию',
}

export function ContentPage({ page, title }: Props) {
  const [banners, setBanners] = useState<Banner[]>([])
  const [blocks, setBlocks] = useState<PageContent[]>([])
  const [stats, setStats] = useState<AuthorStat[]>([])
  const [images, setImages] = useState<Record<string, StoredImage>>({})
  const [previews, setPreviews] = useState<Record<string, string>>({})
  const [removed, setRemoved] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<{ banners: Banner[]; blocks: PageContent[]; stats: AuthorStat[] }>({
    banners: [],
    blocks: [],
    stats: [],
  })
  const [error, setError] = useState<string | null>(null)

  async function load() {
    const [bannerResponse, contentResponse] = await Promise.all([
      api.get<{ data: Banner[] }>(`/api/v1/admin/banners?page=${page}`),
      api.get<{ data: PageContent[] }>(`/api/v1/admin/page-contents?page=${page}`),
    ])
    const nextBanners = bannerResponse.data.data
    const nextBlocks = contentResponse.data.data
    let nextStats: AuthorStat[] = []
    if (page === 'author') {
      const statResponse = await api.get<{ data: AuthorStat[] }>('/api/v1/admin/author-stats')
      nextStats = statResponse.data.data
    }
    setBanners(nextBanners)
    setBlocks(nextBlocks)
    setStats(nextStats)
    setSaved({ banners: nextBanners, blocks: nextBlocks, stats: nextStats })
    setImages({})
    setPreviews({})
    setRemoved({})
  }

  useEffect(() => {
    load().catch((reason: unknown) => setError(errorText(reason)))
  }, [page])

  function bannerDirty(banner: Banner) {
    const key = `banner-${banner.id}`
    if (images[key] || removed[key]) return true
    const base = saved.banners.find((item) => item.id === banner.id)
    if (!base) return false
    return banner.title !== base.title || banner.subtitle !== base.subtitle || banner.text !== base.text
  }

  function blockDirty(block: PageContent) {
    const key = `block-${block.id}`
    if (images[key] || removed[key]) return true
    const base = saved.blocks.find((item) => item.id === block.id)
    if (!base) return false
    return block.eyebrow !== base.eyebrow || block.title !== base.title || block.body !== base.body
  }

  function statDirty(stat: AuthorStat) {
    const base = saved.stats.find((item) => item.id === stat.id)
    if (!base) return false
    return stat.value !== base.value || stat.label !== base.label || stat.is_active !== base.is_active
  }

  const dirty = banners.some(bannerDirty) || blocks.some(blockDirty) || stats.some(statDirty)

  useEffect(() => {
    if (!dirty) return
    const warn = (event: BeforeUnloadEvent) => event.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [dirty])

  async function saveAll() {
    setError(null)
    try {
      let nextBanners = banners
      let nextBlocks = blocks
      let nextStats = stats

      for (const banner of banners) {
        if (!bannerDirty(banner)) continue
        const key = `banner-${banner.id}`
        const payload: Record<string, unknown> = {
          title: banner.title,
          subtitle: banner.subtitle,
          text: banner.text,
        }
        if (images[key]) payload.image = images[key]
        else if (removed[key]) payload.image = null
        const response = await api.patch<{ data: Banner }>(`/api/v1/admin/banners/${banner.id}`, payload)
        nextBanners = nextBanners.map((item) => (item.id === banner.id ? response.data.data : item))
      }

      for (const block of blocks) {
        if (!blockDirty(block)) continue
        const key = `block-${block.id}`
        const payload: Record<string, unknown> = {
          eyebrow: block.eyebrow,
          title: block.title,
          body: block.body,
        }
        if (images[key]) payload.image = images[key]
        else if (removed[key]) payload.image = null
        const response = await api.patch<{ data: PageContent }>(`/api/v1/admin/page-contents/${block.id}`, payload)
        nextBlocks = nextBlocks.map((item) => (item.id === block.id ? response.data.data : item))
      }

      for (const stat of stats) {
        if (!statDirty(stat)) continue
        const response = await api.patch<{ data: AuthorStat }>(`/api/v1/admin/author-stats/${stat.id}`, {
          value: stat.value,
          label: stat.label,
          is_active: stat.is_active,
          sort_order: stat.sort_order,
        })
        nextStats = nextStats.map((item) => (item.id === stat.id ? response.data.data : item))
      }

      setBanners(nextBanners)
      setBlocks(nextBlocks)
      setStats(nextStats)
      setSaved({ banners: nextBanners, blocks: nextBlocks, stats: nextStats })
      setImages({})
      setPreviews({})
      setRemoved({})
    } catch (reason) {
      setError(errorText(reason))
      throw reason
    }
  }

  usePageSave(`content-${page}`, dirty, saveAll)

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
      <p className="text-sm text-muted">Тексты и фотографии этой страницы берутся отсюда. Чтобы заменить картинку, выберите файл. Пустое поле на сайте остаётся пустым. Все правки на странице сохраняются одной кнопкой внизу.</p>
      <Notice text={error} />
      {banners.map((banner) => (
        <div key={banner.id} className="space-y-3 rounded-3xl bg-white p-5">
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
        </div>
      ))}
      {page === 'author' && stats.map((stat) => (
        <div key={stat.id} className="grid items-end gap-3 rounded-3xl bg-white p-5 sm:grid-cols-2">
          <Field label="Основная часть">
            <input className={controlClass} placeholder="34 года" value={stat.value ?? ''} onChange={(event) => setStats(stats.map((item) => item.id === stat.id ? { ...item, value: event.target.value } : item))} />
          </Field>
          <Field label="Подпись">
            <input className={controlClass} value={stat.label} onChange={(event) => setStats(stats.map((item) => item.id === stat.id ? { ...item, label: event.target.value } : item))} />
          </Field>
        </div>
      ))}
      {blocks.map((block) => (
        <div key={block.id} className="space-y-3 rounded-3xl bg-white p-5">
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
        </div>
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
