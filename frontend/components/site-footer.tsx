import { Logo } from '@/components/logo'
import { channelIcons } from '@/lib/channel-icons'
import { siteNav } from '@/lib/site-nav'
import type { ContactChannel, DocumentItem, FooterData } from '@/lib/types'
import Link from 'next/link'

export function SiteFooter({
  contacts,
  documents,
  footer,
}: {
  contacts: ContactChannel[]
  documents: DocumentItem[]
  footer?: FooterData | null
}) {
  const legalName = footer?.legal_name?.trim() || null
  const inn = footer?.inn?.trim() || null

  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <Link href="/" className="shrink-0" aria-label="Golden Roe">
          <Logo markClassName="h-8" wordmarkClassName="h-4 w-auto" />
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Разделы сайта">
          {siteNav.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gold">
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex flex-wrap items-center gap-3">
          {contacts.map((channel) => {
            const Icon = channelIcons[channel.key]
            if (!Icon || !channel.url) return null
            return (
              <a key={channel.id} href={channel.url} aria-label={channel.label} className="text-ink hover:text-gold">
                <Icon aria-hidden="true" size={18} strokeWidth={1.5} />
              </a>
            )
          })}
          <Link href="/kontakty" className="rounded-full bg-gold-button px-5 py-2 text-sm text-ink">
            Записаться
          </Link>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-2 px-4 py-2.5 text-xs text-muted sm:px-5 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {documents.map((document) => (
              <li key={document.type}>
                <Link href={`/documents/${document.type}`} className="hover:text-gold">
                  {document.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-0.5 lg:items-end lg:text-right">
            {(legalName || inn) && (
              <p className="leading-relaxed">
                {legalName && <span className="block">{legalName}</span>}
                {inn && <span className="block">ИНН {inn}</span>}
              </p>
            )}
            <p>© {new Date().getFullYear()} Golden Roe</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
