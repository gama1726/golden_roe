import type { Metadata } from 'next'
import { Cormorant_Garamond, Manrope, Marck_Script } from 'next/font/google'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getContacts, getDocuments, safe } from '@/lib/api'
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

const script = Marck_Script({
  subsets: ['cyrillic', 'latin'],
  weight: '400',
  variable: '--font-marck',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? 'http://127.0.0.1:3000'),
  title: {
    default: 'Golden Roe',
    template: '%s',
  },
}

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  const [contacts, documents] = await Promise.all([
    safe(() => getContacts()),
    safe(() => getDocuments()),
  ])

  return (
    <html lang="ru" className={`${serif.variable} ${sans.variable} ${script.variable} h-full`}>
      <body className="flex min-h-full flex-col bg-ivory font-sans text-ink antialiased">
        <a href="#content" className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:bg-white focus:px-3 focus:py-2">
          К содержанию
        </a>
        <SiteHeader />
        <main id="content" className="flex-1">
          {children}
        </main>
        <SiteFooter contacts={contacts?.data ?? []} documents={documents?.data ?? []} />
      </body>
    </html>
  )
}
