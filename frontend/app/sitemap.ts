import type { MetadataRoute } from 'next'
import { getArticles } from '@/lib/api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.SITE_URL ?? 'http://127.0.0.1:3000'
  const paths = ['', '/uslugi', '/ob-avtore', '/stati', '/otzyvy', '/kontakty', '/documents/disclaimer', '/documents/privacy', '/documents/consent', '/documents/offer']
  const entries: MetadataRoute.Sitemap = paths.map((path) => ({ url: `${site}${path || '/'}` }))

  try {
    const first = await getArticles(1)
    const pages = [first]
    for (let page = 2; page <= first.meta.last_page; page += 1) {
      pages.push(await getArticles(page))
    }
    for (const page of pages) {
      for (const article of page.data) {
        entries.push({ url: `${site}/stati/${article.slug}` })
      }
    }
  } catch {
    return entries
  }

  return entries
}
