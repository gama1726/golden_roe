import type { Metadata } from 'next'
import type { ImageUrls, Seo } from './types'

export const SITE_NAME = 'Golden Roe'
export const PERSON_NAME = 'Эльвира Вартанова'

const fallbackDescription =
  'Golden Roe — практика Эльвиры Вартановой: системные расстановки, консультации и сопровождение изменений в жизни, семье и бизнесе.'

const pageFallbacks: Record<string, { title: string; description: string }> = {
  home: {
    title: `${SITE_NAME} — ${PERSON_NAME} | системные расстановки и консультации`,
    description: fallbackDescription,
  },
  services: {
    title: `Услуги — ${SITE_NAME} | ${PERSON_NAME}`,
    description:
      'Форматы работы с Эльвирой Вартановой: системные сессии, разборы и сопровождение. Актуальные услуги и стоимость на сайте Golden Roe.',
  },
  author: {
    title: `${PERSON_NAME} — об авторе | ${SITE_NAME}`,
    description:
      'Эльвира Вартанова — основательница Golden Roe. Путь, точки опоры и подход к системным расстановкам и личным изменениям.',
  },
  articles: {
    title: `Статьи — ${SITE_NAME} | ${PERSON_NAME}`,
    description:
      'Статьи Эльвиры Вартановой о системном видении, семье, бизнесе и внутренней опоре. Материалы практики Golden Roe.',
  },
  reviews: {
    title: `Отзывы клиентов — ${SITE_NAME} | ${PERSON_NAME}`,
    description:
      'Отзывы о работе с Эльвирой Вартановой и практике Golden Roe. Реальные истории изменений после консультаций и расстановок.',
  },
  contacts: {
    title: `Контакты — ${SITE_NAME} | записаться к ${PERSON_NAME}`,
    description:
      'Связаться с Эльвирой Вартановой: Telegram, WhatsApp, телефон и email. Запись на консультацию в Golden Roe.',
  },
}

export function siteUrl(): string {
  return (process.env.SITE_URL ?? 'http://127.0.0.1:3000').replace(/\/$/, '')
}

export function absoluteUrl(path = '/'): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${siteUrl()}${normalized === '/' ? '' : normalized}` || siteUrl()
}

function pickSeo(seo: Seo | null | undefined, pageKey: keyof typeof pageFallbacks) {
  const fallback = pageFallbacks[pageKey]
  const title = seo?.title?.trim() || fallback.title
  const description = seo?.description?.trim() || fallback.description
  return { title, description }
}

function ogImage(image?: ImageUrls | null): string | undefined {
  if (!image) return undefined
  const fromWebp = Object.values(image.webp ?? {}).find((url) => typeof url === 'string' && url.length > 0)
  return fromWebp || image.original || undefined
}

export function pageMetadata(options: {
  pageKey: keyof typeof pageFallbacks
  path: string
  seo?: Seo | null
  title?: string | null
  description?: string | null
  image?: ImageUrls | null
  type?: 'website' | 'article'
}): Metadata {
  const fallback = pickSeo(options.seo, options.pageKey)
  const title = options.title?.trim() || fallback.title
  const description = options.description?.trim() || fallback.description
  const canonical = absoluteUrl(options.path)
  const image = ogImage(options.image)

  return {
    title,
    description,
    keywords: [
      SITE_NAME,
      PERSON_NAME,
      'Эльвира Вартанова',
      'системные расстановки',
      'консультации',
      'Golden Roe',
    ],
    authors: [{ name: PERSON_NAME }],
    creator: PERSON_NAME,
    publisher: SITE_NAME,
    alternates: { canonical },
    openGraph: {
      type: options.type ?? 'website',
      locale: 'ru_RU',
      url: canonical,
      siteName: SITE_NAME,
      title,
      description,
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export function documentMetadata(label: string, type: string): Metadata {
  const title = `${label} — ${SITE_NAME}`
  const description = `${label} практики Golden Roe (${PERSON_NAME}). Документ на сайте и PDF для скачивания.`
  return pageMetadata({
    pageKey: 'home',
    path: `/documents/${type}`,
    title,
    description,
  })
}
