import { useEffect, useMemo, useState } from 'react'
import { Field, FilePicker, Notice, PageTitle, TextArea, cardClass, cardHeadingClass, controlClass } from '../components/ui'
import { api, errorText, uploadImage } from '../lib/api'
import { usePageSave } from '../lib/save-bar'
import type { AuthorStat, Banner, PageContent, StoredImage } from '../lib/types'

type Props = { page: 'home' | 'author' | 'services' | 'articles' | 'reviews' | 'contacts'; title: string }

type Section =
  | { id: string; title: string; hint?: string; type: 'hero'; quoteKey?: string; extraKeys?: string[] }
  | { id: string; title: string; hint?: string; type: 'stats' }
  | { id: string; title: string; hint?: string; type: 'group'; keys: string[] }

const blockLabel: Record<string, string> = {
  quote: 'Цитата на баннере',
  'point.system': 'Лист — подпись',
  'point.individual': 'Ромб — подпись',
  'point.trust': 'Люди — подпись',
  'point.results': 'График — подпись',
  cta: 'Нижний экран',
  path: 'Текст и фото слева',
  'path.photo': 'Фото справа',
  pillars: 'Заголовок блока',
  'pillar.family': 'Семья',
  'pillar.spirit': 'Духовное развитие',
  'pillar.business': 'Предпринимательство',
  'pillar.creativity': 'Творчество',
  'pillar.health': 'Здоровье',
  'pillar.beauty': 'Эстетика',
  'pillar.quote': 'Цитата справа',
  son: 'Текст и фото слева',
  'son.photo': 'Фото справа',
  'son.quote': 'Цитата на фото',
  guide: 'Заголовок и текст',
  'guide.experience': 'Предпринимательский опыт',
  'guide.person': 'Понимание человека',
  'guide.system': 'Системный подход',
  'guide.care': 'Честность и поддержка',
  'guide.growth': 'Живой пример',
  manifesto: 'Текст и фото',
  'manifesto.quote': 'Цитата справа',
  intro: 'Вступление',
  approach: 'Обо мне',
  results: 'Заголовок полосы',
  choice: 'Финальный акцент',
  'result.housing': 'Новое жильё',
  'result.income': 'Рост доходов',
  'result.businesses': 'Новые бизнесы',
  'result.family': 'Гармония в семье',
  'result.health': 'Здоровье и энергия',
  'result.children': 'Рождение детей',
  'cta.note': 'Пояснение справа',
  greeting: 'Приветствие под заголовком',
  reach: 'Свяжитесь со мной',
  promise: 'Цитата справа',
  'point.reply': 'Быстро отвечаю',
  'point.booking': 'Удобная запись',
  'point.personal': 'Индивидуальный подход',
  'point.privacy': 'Конфиденциальность',
  scene: 'Фото слева',
  consult: 'Блок записи справа',
}

/** Sections in the same top-to-bottom order as the public site. */
const pageSections: Record<Props['page'], Section[]> = {
  home: [
    {
      id: 'hero',
      type: 'hero',
      title: '1. Первый экран',
      hint: 'Баннер: надзаголовок, заголовок, текст и фото на весь экран.',
    },
    {
      id: 'approach',
      type: 'group',
      title: '2. Обо мне',
      hint: 'Фото слева, текст по центру, цитата справа.',
      keys: ['approach'],
    },
    {
      id: 'results',
      type: 'group',
      title: '3. Мраморная полоса: результаты',
      hint: 'Заголовок полосы и шесть подписей под иконками.',
      keys: [
        'results',
        'result.housing',
        'result.businesses',
        'result.income',
        'result.family',
        'result.health',
        'result.children',
      ],
    },
    {
      id: 'choice',
      type: 'group',
      title: '4. Финальный акцент',
      hint: 'Тёмный экран с фото перед блоком услуг.',
      keys: ['choice'],
    },
  ],
  services: [
    {
      id: 'hero',
      type: 'hero',
      title: '1. Первый экран',
      hint: 'Баннер и цитата справа.',
      quoteKey: 'quote',
    },
    {
      id: 'points',
      type: 'group',
      title: '2. Мраморная полоса под баннером',
      hint: 'Четыре подписи с иконками между баннером и списком услуг.',
      keys: ['point.system', 'point.individual', 'point.trust', 'point.results'],
    },
    {
      id: 'cta',
      type: 'group',
      title: '3. Нижний экран',
      hint: 'После карточек услуг. Карточки услуг редактируются ниже на этой странице.',
      keys: ['cta'],
    },
  ],
  author: [
    {
      id: 'hero',
      type: 'hero',
      title: '1. Первый экран',
      hint: 'Баннер и цитата справа.',
      quoteKey: 'quote',
    },
    {
      id: 'path',
      type: 'group',
      title: '2. Мой путь',
      hint: 'Фото слева, текст по центру, фото справа.',
      keys: ['path', 'path.photo'],
    },
    {
      id: 'stats',
      type: 'stats',
      title: '3. Мраморная полоса: цифры',
      hint: 'Четыре значения между «Мой путь» и «Точки опоры».',
    },
    {
      id: 'pillars',
      type: 'group',
      title: '4. Точки опоры',
      hint: 'Заголовок, шесть подписей с иконками и цитата справа.',
      keys: [
        'pillars',
        'pillar.family',
        'pillar.spirit',
        'pillar.business',
        'pillar.creativity',
        'pillar.health',
        'pillar.beauty',
        'pillar.quote',
      ],
    },
    {
      id: 'son',
      type: 'group',
      title: '5. Семья',
      hint: 'Фото слева, текст, фото справа и цитата на фото.',
      keys: ['son', 'son.photo', 'son.quote'],
    },
    {
      id: 'guide',
      type: 'group',
      title: '6. Почему я могу быть проводником',
      hint: 'Заголовок блока и пункты списка.',
      keys: ['guide', 'guide.experience', 'guide.person', 'guide.system', 'guide.care', 'guide.growth'],
    },
    {
      id: 'manifesto',
      type: 'group',
      title: '7. Большой баннер внизу страницы',
      hint: 'Тёмный экран перед подвалом: текст слева, цитата справа, фото на фоне.',
      keys: ['manifesto', 'manifesto.quote'],
    },
  ],
  articles: [
    {
      id: 'hero',
      type: 'hero',
      title: '1. Первый экран',
      hint: 'Баннер и цитата справа. Список статей — в разделе «Статьи» ниже.',
      quoteKey: 'quote',
    },
  ],
  reviews: [
    {
      id: 'hero',
      type: 'hero',
      title: '1. Первый экран',
      hint: 'Баннер и цитата справа.',
      quoteKey: 'quote',
    },
    {
      id: 'intro',
      type: 'group',
      title: '2. Вступление к отзывам',
      hint: 'Текст над сеткой отзывов.',
      keys: ['intro'],
    },
    {
      id: 'cta',
      type: 'group',
      title: '3. Нижний экран',
      hint: 'Призыв оставить отзыв и пояснение справа.',
      keys: ['cta', 'cta.note'],
    },
  ],
  contacts: [
    {
      id: 'hero',
      type: 'hero',
      title: '1. Первый экран',
      hint: 'Баннер и приветствие под заголовком.',
      extraKeys: ['greeting'],
    },
    {
      id: 'reach',
      type: 'group',
      title: '2. Свяжитесь со мной',
      hint: 'Заголовок, текст и цитата. Каналы связи редактируются ниже.',
      keys: ['reach', 'promise'],
    },
    {
      id: 'points',
      type: 'group',
      title: '3. Мраморная полоса: преимущества',
      hint: 'Четыре карточки с иконками.',
      keys: ['point.reply', 'point.booking', 'point.personal', 'point.privacy'],
    },
    {
      id: 'bottom',
      type: 'group',
      title: '4. Низ страницы',
      hint: 'Фото слева и мраморный блок записи справа.',
      keys: ['scene', 'consult'],
    },
  ],
}

/** Only fields the public site actually reads for each block key. */
function visibleFields(key: string, page: Props['page']): {
  eyebrow: boolean
  title: boolean
  body: boolean
  image: boolean
  eyebrowLabel?: string
  titleLabel?: string
  bodyLabel?: string
} {
  if (key === 'path.photo' || key === 'son.photo') {
    return { eyebrow: false, title: false, body: false, image: true }
  }
  if (key === 'pillar.quote' || key === 'son.quote' || key === 'cta.note') {
    return { eyebrow: false, title: false, body: true, image: false, bodyLabel: 'Текст цитаты' }
  }
  if (key === 'quote' || key === 'manifesto.quote') {
    return {
      eyebrow: true,
      title: true,
      body: false,
      image: false,
      titleLabel: 'Цитата',
      eyebrowLabel: 'Подпись',
    }
  }
  if (key === 'promise' || key === 'greeting') {
    return { eyebrow: false, title: true, body: false, image: false, titleLabel: key === 'promise' ? 'Цитата' : 'Приветствие' }
  }
  if (key === 'pillars') {
    return { eyebrow: false, title: true, body: false, image: false, titleLabel: 'Заголовок' }
  }
  if (key === 'results') {
    return { eyebrow: true, title: true, body: false, image: false }
  }
  if (key.startsWith('result.') || (key.startsWith('pillar.') && key !== 'pillar.quote') || key.startsWith('guide.')) {
    return { eyebrow: false, title: true, body: false, image: false, titleLabel: 'Подпись' }
  }
  if (key.startsWith('point.') && page === 'services') {
    return { eyebrow: false, title: true, body: false, image: false, titleLabel: 'Подпись' }
  }
  if (key.startsWith('point.') && page === 'contacts') {
    return { eyebrow: false, title: true, body: true, image: false }
  }
  if (key === 'cta' && (page === 'services' || page === 'reviews')) {
    return { eyebrow: false, title: true, body: true, image: true }
  }
  if (key === 'consult' || key === 'reach' || key === 'guide') {
    return { eyebrow: false, title: true, body: true, image: false }
  }
  if (key === 'intro') {
    return { eyebrow: true, title: true, body: true, image: false }
  }
  if (key === 'approach') {
    return {
      eyebrow: true,
      title: true,
      body: true,
      image: true,
      eyebrowLabel: 'Цитата справа',
    }
  }
  if (key === 'scene') {
    return { eyebrow: false, title: true, body: true, image: true }
  }
  return { eyebrow: true, title: true, body: true, image: true }
}

function sectionKeys(section: Section): string[] {
  if (section.type === 'hero') {
    return [section.quoteKey, ...(section.extraKeys ?? [])].filter((key): key is string => Boolean(key))
  }
  if (section.type === 'group') {
    return section.keys
  }
  return []
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

  const sections = pageSections[page]
  const knownKeys = useMemo(() => new Set(sections.flatMap(sectionKeys)), [sections])

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
    if (block.key === 'path.photo' && (block.eyebrow || block.title || block.body)) return true
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
        const payload: Record<string, unknown> =
          block.key === 'path.photo'
            ? { eyebrow: null, title: null, body: null }
            : {
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

  function patchBlock(id: number, field: 'eyebrow' | 'title' | 'body', value: string) {
    setBlocks((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  function blockByKey(key: string) {
    return blocks.find((block) => block.key === key)
  }

  const leftover = blocks
    .filter((block) => !knownKeys.has(block.key) && !block.key.startsWith('anchor.'))
    .sort((a, b) => a.sort_order - b.sort_order)

  return (
    <section className="space-y-6">
      <PageTitle title={title} />
      <p className="text-sm text-muted">
        Блоки расположены сверху вниз — как на сайте. Связанные поля собраны в одну карточку. Все правки на странице
        сохраняются одной кнопкой внизу.
      </p>
      <Notice text={error} />

      {sections.map((section) => {
        if (section.type === 'hero') {
          const quote = section.quoteKey ? blockByKey(section.quoteKey) : undefined
          const extras = (section.extraKeys ?? [])
            .map((key) => blockByKey(key))
            .filter((block): block is PageContent => Boolean(block))

          return (
            <div key={section.id} className={cardClass}>
              <h2 className={cardHeadingClass}>{section.title}</h2>
              {section.hint && <p className="text-sm text-muted">{section.hint}</p>}
              {banners.map((banner) => (
                <div key={banner.id} className="space-y-5 border-t border-line pt-5 first:border-t-0 first:pt-0">
                  <Field label="Надзаголовок">
                    <input
                      className={controlClass}
                      value={banner.title ?? ''}
                      onChange={(event) =>
                        setBanners(banners.map((item) => (item.id === banner.id ? { ...item, title: event.target.value } : item)))
                      }
                    />
                  </Field>
                  <Field label="Заголовок">
                    <input
                      className={controlClass}
                      value={banner.subtitle ?? ''}
                      onChange={(event) =>
                        setBanners(
                          banners.map((item) => (item.id === banner.id ? { ...item, subtitle: event.target.value } : item)),
                        )
                      }
                    />
                  </Field>
                  <Field label="Текст">
                    <TextArea
                      value={banner.text ?? ''}
                      onChange={(event) =>
                        setBanners(banners.map((item) => (item.id === banner.id ? { ...item, text: event.target.value } : item)))
                      }
                    />
                  </Field>
                  <ImageEditor
                    label="Фото баннера"
                    inputKey={`banner-${banner.id}`}
                    current={banner.image?.original ?? null}
                    preview={previews[`banner-${banner.id}`] ?? null}
                    removed={removed[`banner-${banner.id}`] ?? false}
                    onPick={onFile}
                    onRemove={removeImage}
                  />
                </div>
              ))}
              {extras.map((block) => (
                <BlockFields
                  key={block.id}
                  block={block}
                  page={page}
                  nested
                  onPatch={patchBlock}
                  previews={previews}
                  removed={removed}
                  onPick={onFile}
                  onRemove={removeImage}
                />
              ))}
              {quote && (
                <BlockFields
                  block={quote}
                  page={page}
                  nested
                  onPatch={patchBlock}
                  previews={previews}
                  removed={removed}
                  onPick={onFile}
                  onRemove={removeImage}
                />
              )}
            </div>
          )
        }

        if (section.type === 'stats') {
          if (stats.length === 0) return null
          return (
            <div key={section.id} className={cardClass}>
              <h2 className={cardHeadingClass}>{section.title}</h2>
              {section.hint && <p className="text-sm text-muted">{section.hint}</p>}
              {stats.map((stat, index) => (
                <div key={stat.id} className="grid items-end gap-5 border-t border-line pt-5 sm:grid-cols-2">
                  <p className="sm:col-span-2 text-sm font-medium text-muted">Показатель {index + 1}</p>
                  <Field label="Основная часть">
                    <input
                      className={controlClass}
                      placeholder="34 года"
                      value={stat.value ?? ''}
                      onChange={(event) =>
                        setStats(stats.map((item) => (item.id === stat.id ? { ...item, value: event.target.value } : item)))
                      }
                    />
                  </Field>
                  <Field label="Подпись">
                    <input
                      className={controlClass}
                      value={stat.label}
                      onChange={(event) =>
                        setStats(stats.map((item) => (item.id === stat.id ? { ...item, label: event.target.value } : item)))
                      }
                    />
                  </Field>
                </div>
              ))}
            </div>
          )
        }

        const items = section.keys
          .map((key) => blockByKey(key))
          .filter((block): block is PageContent => Boolean(block))
        if (items.length === 0) return null

        return (
          <div key={section.id} className={cardClass}>
            <h2 className={cardHeadingClass}>{section.title}</h2>
            {section.hint && <p className="text-sm text-muted">{section.hint}</p>}
            {items.map((block) => (
              <BlockFields
                key={block.id}
                block={block}
                page={page}
                nested={items.length > 1}
                onPatch={patchBlock}
                previews={previews}
                removed={removed}
                onPick={onFile}
                onRemove={removeImage}
              />
            ))}
          </div>
        )
      })}

      {leftover.length > 0 && (
        <div className={cardClass}>
          <h2 className={cardHeadingClass}>Прочие блоки</h2>
          <p className="text-sm text-muted">Есть в базе, но не привязаны к текущей раскладке сайта.</p>
          {leftover.map((block) => (
            <BlockFields
              key={block.id}
              block={block}
              page={page}
              nested
              onPatch={patchBlock}
              previews={previews}
              removed={removed}
              onPick={onFile}
              onRemove={removeImage}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function BlockFields({
  block,
  page,
  nested,
  onPatch,
  previews,
  removed,
  onPick,
  onRemove,
}: {
  block: PageContent
  page: Props['page']
  nested: boolean
  onPatch: (id: number, field: 'eyebrow' | 'title' | 'body', value: string) => void
  previews: Record<string, string>
  removed: Record<string, boolean>
  onPick: (key: string, file: File | undefined) => void
  onRemove: (key: string) => void
}) {
  const fields = visibleFields(block.key, page)
  const label = blockLabel[block.key] ?? block.key

  return (
    <div className={nested ? 'space-y-4 border-t border-line pt-5' : 'space-y-5'}>
      {nested && <p className="text-sm font-medium">{label}</p>}
      {fields.eyebrow && (
        <Field label={fields.eyebrowLabel ?? 'Надзаголовок'}>
          <input
            className={controlClass}
            value={block.eyebrow ?? ''}
            onChange={(event) => onPatch(block.id, 'eyebrow', event.target.value)}
            placeholder={block.key === 'approach' ? 'Текст цитаты справа от блока «Обо мне»' : undefined}
          />
        </Field>
      )}
      {fields.title && (
        <Field label={fields.titleLabel ?? 'Заголовок'}>
          <input
            className={controlClass}
            value={block.title ?? ''}
            onChange={(event) => onPatch(block.id, 'title', event.target.value)}
          />
        </Field>
      )}
      {fields.body && (
        <Field label={fields.bodyLabel ?? 'Текст'}>
          <TextArea
            value={block.body ?? ''}
            placeholder="Текст будет предоставлен заказчиком"
            onChange={(event) => onPatch(block.id, 'body', event.target.value)}
          />
        </Field>
      )}
      {fields.image && (
        <ImageEditor
          label={nested ? `Изображение · ${label}` : 'Изображение блока'}
          inputKey={`block-${block.id}`}
          current={block.image?.original ?? null}
          preview={previews[`block-${block.id}`] ?? null}
          removed={removed[`block-${block.id}`] ?? false}
          onPick={onPick}
          onRemove={onRemove}
        />
      )}
    </div>
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
    <FilePicker
      label={label}
      accept="image/jpeg,image/png,image/webp"
      buttonLabel="Выбрать изображение"
      hint={shown ? 'Файл выбран' : 'JPEG, PNG или WebP'}
      preview={shown}
      onPick={(file) => onPick(inputKey, file)}
      onClear={shown ? () => onRemove(inputKey) : undefined}
    />
  )
}
