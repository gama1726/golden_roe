import { PERSON_NAME, SITE_NAME, absoluteUrl, siteUrl } from '@/lib/seo'
import type { ContactChannel } from '@/lib/types'

export function SeoJsonLd({ contacts = [] }: { contacts?: ContactChannel[] }) {
  const sameAs = contacts
    .map((channel) => channel.url)
    .filter((url): url is string => typeof url === 'string' && url.length > 0)

  const person = {
    '@type': 'Person',
    name: PERSON_NAME,
    alternateName: 'Вартанова Эльвира Борисовна',
    jobTitle: 'Практик системных расстановок',
    url: absoluteUrl('/ob-avtore'),
    worksFor: { '@id': `${siteUrl()}/#organization` },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }

  const organization = {
    '@type': 'Organization',
    '@id': `${siteUrl()}/#organization`,
    name: SITE_NAME,
    url: siteUrl(),
    description:
      'Практика Эльвиры Вартановой: системные расстановки, индивидуальные консультации и сопровождение изменений.',
    founder: { '@id': `${siteUrl()}/#person` },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }

  const website = {
    '@type': 'WebSite',
    '@id': `${siteUrl()}/#website`,
    name: SITE_NAME,
    url: siteUrl(),
    inLanguage: 'ru-RU',
    publisher: { '@id': `${siteUrl()}/#organization` },
  }

  const graph = {
    '@context': 'https://schema.org',
    '@graph': [
      { ...organization },
      { ...person, '@id': `${siteUrl()}/#person` },
      website,
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
