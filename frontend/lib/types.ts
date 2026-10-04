export type Seo = {
  title: string | null
  description: string | null
}

export type ImageUrls = {
  alt: string
  original: string | null
  webp: Record<string, string>
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

export type Block = {
  eyebrow: string | null
  title: string | null
  body: string | null
  image: ImageUrls | null
}

export type PageContent = Block & {
  id: number
  page: string
  key: string
  eyebrow: string | null
  sort_order: number
}

export type Service = {
  id: number
  title: string
  price: number
  price_display: string
  image: ImageUrls | null
  format: string
  audience: string
  result: string
  sort_order: number
  is_active: boolean
}

export type ArticleCard = {
  id: number
  slug: string
  title: string
  excerpt: string | null
  image: ImageUrls | null
  published_at: string | null
  created_at: string | null
}

export type Article = ArticleCard & {
  content: string
  excerpt: string | null
  is_published: boolean
  updated_at: string | null
}

export type AuthorStat = {
  id: number
  value: string | null
  label: string
  sort_order: number
  is_active: boolean
}

export type ServicesData = {
  data: Service[]
  banner: Banner | null
  blocks: {
    quote: Block | null
    points: PageContent[]
    cta: Block | null
  }
  seo: Seo
}

export type HomeData = {
  banner: Banner | null
  blocks: {
    approach: Block | null
    choice: Block | null
    results: {
      eyebrow: string | null
      title: string | null
      body: string | null
      items: PageContent[]
    }
  }
  services: Service[]
  articles: ArticleCard[]
  seo: Seo
}

export type AuthorData = {
  banner: Banner | null
  quote: Block | null
  stats: AuthorStat[]
  path: Block | null
  path_photo: Block | null
  pillars: {
    title: string | null
    items: PageContent[]
    quote: Block | null
  }
  son: PageContent | null
  son_photo: Block | null
  son_quote: Block | null
  guide: PageContent | null
  guide_items: PageContent[]
  manifesto: Block | null
  manifesto_quote: Block | null
  seo: Seo
}

export type ContactChannel = {
  id: number
  key: string
  label: string
  display: string
  url: string | null
  sort_order: number
}

export type DocumentItem = {
  type: string
  label: string
  body: string | null
  available: boolean
  has_file: boolean
  url: string
  updated_at: string | null
}

export type FooterData = {
  legal_name: string | null
  inn: string | null
}

export type ReviewItem = {
  id: number
  full_name: string
  rating: number
  service: string
  title: string
  text: string
  image: ImageUrls | null
  created_at: string | null
}

export type PageMeta = {
  current_page: number
  per_page: number
  total: number
  last_page: number
}
