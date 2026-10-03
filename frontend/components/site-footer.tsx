import { Logo } from '@/components/logo'
import type { ContactChannel, DocumentItem } from '@/lib/types'
import { TelegramIcon } from '@/components/telegram-icon'
import { WhatsAppIcon } from '@/components/whatsapp-icon'
import { Mail, Phone } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'

const links = [
  { href: '/', label: 'Главная' },
  { href: '/uslugi', label: 'Услуги' },
  { href: '/ob-avtore', label: 'Об авторе' },
  { href: '/stati', label: 'Статьи' },
  { href: '/otzyvy', label: 'Отзывы' },
  { href: '/kontakty', label: 'Контакты' },
]

const channelIcons: Record<string, LucideIcon | typeof WhatsAppIcon | typeof TelegramIcon> = {
  telegram: TelegramIcon,
  whatsapp: WhatsAppIcon,
  email: Mail,
  phone: Phone,
}

export function SiteFooter({ contacts, documents }: { contacts: ContactChannel[]; documents: DocumentItem[] }) {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-8 px-4 py-10 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <Link href="/" className="shrink-0" aria-label="Golden Roe">
          <Logo markClassName="h-12 sm:h-14" />
        </Link>
        <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Разделы сайта">
          {links.map((link) => (
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
        <div className="mx-auto flex w-full max-w-[80rem] flex-col gap-3 px-4 py-4 text-xs text-muted sm:px-5 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-x-4 gap-y-2">
            {documents.map((document) => (
              <li key={document.type}>
                <Link href={`/documents/${document.type}`} className="hover:text-gold">
                  {document.label}
                </Link>
              </li>
            ))}
          </ul>
          <p>© {new Date().getFullYear()} Golden Roe</p>
        </div>
      </div>
    </footer>
  )
}
