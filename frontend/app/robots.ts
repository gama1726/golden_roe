import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const site = process.env.SITE_URL ?? 'http://127.0.0.1:3000'

  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${site}/sitemap.xml`,
  }
}
