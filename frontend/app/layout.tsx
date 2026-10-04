import type { Metadata } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import { SeoJsonLd } from '@/components/seo-json-ld'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getContacts, getDocuments, getFooter, safe } from '@/lib/api'
import { PERSON_NAME, SITE_NAME, siteUrl } from '@/lib/seo'
import './globals.css'

const serif = Cormorant_Garamond({
  subsets: ['cyrillic', 'latin'],
  weight: ['500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
})

const sans = Manrope({
  subsets: ['cyrillic', 'latin'],
  weight: ['400', '500', '600'],
  variable: '--font-manrope',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} — ${PERSON_NAME}`,
    template: '%s',
  },
  description:
    'Golden Roe — практика Эльвиры Вартановой: системные расстановки, индивидуальные консультации и сопровождение изменений в жизни, семье и бизнесе.',
  applicationName: SITE_NAME,
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const [contacts, documents, footer] = await Promise.all([
    safe(() => getContacts()),
    safe(() => getDocuments()),
    safe(() => getFooter()),
  ])

  return (
    <html lang="ru" className={`${serif.variable} ${sans.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-ivory font-sans text-ink antialiased">
        <SeoJsonLd contacts={contacts?.data ?? []} />
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:bg-white focus:px-3 focus:py-2">
          К содержанию
        </a>
        <SiteHeader />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter
          contacts={contacts?.data ?? []}
          documents={documents?.data ?? []}
          footer={footer?.data ?? null}
        />
      </body>
    </html>
  )
}
