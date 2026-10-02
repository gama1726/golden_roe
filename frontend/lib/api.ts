import 'server-only'

import type {
  Article,
  ArticleCard,
  AuthorData,
  Block,
  ContactChannel,
  DocumentItem,
  HomeData,
  PageContent,
  PageMeta,
  ReviewItem,
  Seo,
  Service,
  ServicesData,
} from './types'

export function apiBase(): string {
  return process.env.API_URL ?? 'http://127.0.0.1:8000'
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${apiBase()}${path}`, {
    next: { revalidate: 60, tags: ['public'] },
  })

  if (!response.ok) {
    throw new Error(`API ${response.status} for ${path}`)
  }

  return response.json() as Promise<T>
}

export function getHome() {
  return getJson<{ data: HomeData }>('/api/v1/home')
}

export function getServices() {
  return getJson<ServicesData>('/api/v1/services')
}

export async function getService(id: number): Promise<Service | null> {
  const response = await fetch(`${apiBase()}/api/v1/services/${id}`, {
    next: { revalidate: 60, tags: ['public'] },
  })

  if (response.status === 404) return null
  if (!response.ok) return null

  const payload = (await response.json()) as { data: Service }
  return payload.data
}

export function getAuthor() {
  return getJson<{ data: AuthorData }>('/api/v1/author')
}

export function getArticles(page = 1) {
  return getJson<{ data: ArticleCard[]; meta: PageMeta; banner: HomeData['banner']; quote: Block | null; seo: Seo }>(
    `/api/v1/articles?page=${page}`,
  )
}

export async function getArticle(slug: string): Promise<{ article: Article; seo: Seo } | null> {
  const response = await fetch(`${apiBase()}/api/v1/articles/${encodeURIComponent(slug)}`, {
    next: { revalidate: 60, tags: ['public'] },
  })

  if (response.status === 404) return null
  if (!response.ok) throw new Error(`API ${response.status} for article`)

  const payload = (await response.json()) as { data: { article: Article; seo: Seo } }
  return payload.data
}

export function getReviews() {
  return getJson<{
    data: ReviewItem[]
    meta: { enabled: boolean }
    banner: HomeData['banner']
    quote: Block | null
    intro: Block | null
    cta: Block | null
    note: Block | null
    seo: Seo
  }>('/api/v1/reviews')
}

export function getContacts() {
  return getJson<{
    data: ContactChannel[]
    banner: HomeData['banner']
    blocks: {
      greeting: Block | null
      reach: Block | null
      promise: Block | null
      points: PageContent[]
      scene: Block | null
      consult: Block | null
    }
    seo: Seo
  }>('/api/v1/contacts')
}

export function getDocuments() {
  return getJson<{ data: DocumentItem[] }>('/api/v1/documents')
}

export async function safe<T>(load: () => Promise<T>): Promise<T | null> {
  try {
    return await load()
  } catch {
    return null
  }
}
