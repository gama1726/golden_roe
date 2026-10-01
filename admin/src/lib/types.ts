export type User = {
  id: number
  name: string
  email: string
  role: string
}

export type ImageUrls = {
  alt: string
  original: string | null
  webp: Record<string, string | null>
}

export type StoredImage = {
  original: string
  webp: Record<string, string>
  alt: string
}

export type Service = {
  id: number
  title: string
  price: number
  price_display: string
  format: string
  audience: string
  result: string
  sort_order: number
  is_active: boolean
}

export type Article = {
  id: number
  slug: string
  title: string
  excerpt: string | null
  content: string
  image: ImageUrls | null
  is_published: boolean
  published_at: string | null
  created_at: string | null
}

export type Review = {
  id: number
  full_name: string
  phone: string
  email: string
  service_id: number | null
  service: string | null
  rating: number
  title: string
  text: string
  image: ImageUrls | null
  status: 'pending' | 'approved'
  created_at: string | null
}

export type Banner = {
  id: number
  page: string
  sort_order: number
  title: string | null
  subtitle: string | null
  text: string | null
  image: ImageUrls | null
}

export type PageContent = {
  id: number
  page: string
  key: string
  eyebrow: string | null
  title: string | null
  body: string | null
  image: ImageUrls | null
  sort_order: number
}

export type AuthorStat = {
  id: number
  value: string | null
  label: string
  sort_order: number
  is_active: boolean
}

export type ContactChannel = {
  id: number
  key: string
  label: string
  value: string
  display: string
  url: string | null
  url_override: string | null
  sort_order: number
  is_public: boolean
}

export type DocumentItem = {
  type: string
  label: string
  available: boolean
  url: string
  updated_at: string | null
}

export type SeoEntry = {
  title: string | null
  description: string | null
}

export type Settings = {
  reviews_enabled: boolean
  seo: Record<string, SeoEntry>
}

export type Dashboard = {
  pending_reviews: number
  services: number
  articles: number
  published_articles: number
}

export type PageMeta = {
  current_page: number
  last_page: number
  total: number
}
