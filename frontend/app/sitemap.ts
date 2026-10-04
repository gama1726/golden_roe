import type { MetadataRoute } from 'next'
import { getArticles } from '@/lib/api'
import { siteUrl } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = siteUrl()
  const now = new Date()

  const staticPaths: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
    { path: '/', priority: 1, changeFrequency: 'weekly' },
    { path: '/uslugi', priority: 0.9, changeFrequency: 'weekly' },
    { path: '/ob-avtore', priority: 0.9, changeFrequency: 'monthly' },
    { path: '/stati', priority: 0.8, changeFrequency: 'weekly' },
    { path: '/otzyvy', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/kontakty', priority: 0.8, changeFrequency: 'monthly' },
    { path: '/documents/disclaimer', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/documents/privacy', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/documents/consent', priority: 0.3, changeFrequency: 'yearly' },
    { path: '/documents/offer', priority: 0.3, changeFrequency: 'yearly' },
  ]

  const entries: MetadataRoute.Sitemap = staticPaths.map(({ path, priority, changeFrequency }) => ({
    url: `${site}${path === '/' ? '/' : path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  try {
    const first = await getArticles(1)
    const pages = [first]
    for (let page = 2; page <= first.meta.last_page; page += 1) {
      pages.push(await getArticles(page))
    }
    for (const page of pages) {
      for (const article of page.data) {
        entries.push({
          url: `${site}/stati/${article.slug}`,
          lastModified: article.published_at ? new Date(article.published_at) : now,
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    }
  } catch {
    return entries
  }

  return entries
}
