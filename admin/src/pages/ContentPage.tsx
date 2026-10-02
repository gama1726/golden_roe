import { useEffect, useState } from 'react'
import { Field, Notice, PageTitle, SaveButton, TextArea, controlClass, useSaveFeedback } from '../components/ui'
import { api, errorText, uploadImage } from '../lib/api'
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
  const [error, setError] = useState<string | null>(null)
  const feedback = useSaveFeedback()

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
    const response = await api.patch<{ data: Banner }>(`/api/v1/admin/banners/${banner.id}`, payload)
    clearImageState(key)
    setBanners((current) => current.map((item) => (item.id === banner.id ? response.data.data : item)))
    setError(null)
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
    const response = await api.patch<{ data: PageContent }>(`/api/v1/admin/page-contents/${block.id}`, payload)
    clearImageState(key)
    setBlocks((current) => current.map((item) => (item.id === block.id ? response.data.data : item)))
    setError(null)
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
    const response = await api.patch<{ data: AuthorStat }>(`/api/v1/admin/author-stats/${stat.id}`, {
      value: stat.value,
      label: stat.label,
      is_active: stat.is_active,
      sort_order: stat.sort_order,
    })
    setStats((current) => current.map((item) => (item.id === stat.id ? response.data.data : item)))
    setError(null)
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
      <Notice text={error} />
      {banners.map((banner) => (
        <form
          key={banner.id}
          className="space-y-3 rounded-3xl bg-white p-5"
          onSubmit={(event) => {
            event.preventDefault()
            feedback.run(`banner-${banner.id}`, () => saveBanner(banner)).catch((reason: unknown) => setError(errorText(reason)))
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
          <SaveButton idle="Сохранить баннер" pending={feedback.pending(`banner-${banner.id}`)} saved={feedback.saved(`banner-${banner.id}`)} />
        </form>
      ))}
      {page === 'author' && stats.map((stat) => (
        <form
          key={stat.id}
          className="grid items-end gap-3 rounded-3xl bg-white p-5 sm:grid-cols-[minmax(14rem,1fr)_minmax(0,1.4fr)_auto]"
          onSubmit={(event) => {
            event.preventDefault()
            feedback.run(`stat-${stat.id}`, () => saveStat(stat)).catch((reason: unknown) => setError(errorText(reason)))
          }}
        >
          <Field label="Основная часть">
            <input className={controlClass} placeholder="34 года" value={stat.value ?? ''} onChange={(event) => setStats(stats.map((item) => item.id === stat.id ? { ...item, value: event.target.value } : item))} />
          </Field>
          <Field label="Подпись">
            <input className={controlClass} value={stat.label} onChange={(event) => setStats(stats.map((item) => item.id === stat.id ? { ...item, label: event.target.value } : item))} />
          </Field>
          <div className="flex items-end">
            <SaveButton pending={feedback.pending(`stat-${stat.id}`)} saved={feedback.saved(`stat-${stat.id}`)} />
          </div>
        </form>
      ))}
      {blocks.map((block) => (
        <form
          key={block.id}
          className="space-y-3 rounded-3xl bg-white p-5"
          onSubmit={(event) => {
            event.preventDefault()
            feedback.run(`block-${block.id}`, () => saveBlock(block)).catch((reason: unknown) => setError(errorText(reason)))
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
          <SaveButton idle="Сохранить блок" pending={feedback.pending(`block-${block.id}`)} saved={feedback.saved(`block-${block.id}`)} />
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
