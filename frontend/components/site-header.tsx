'use client'

import { Logo } from '@/components/logo'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Главная' },
  { href: '/uslugi', label: 'Услуги' },
  { href: '/ob-avtore', label: 'Об авторе' },
  { href: '/stati', label: 'Статьи' },
  { href: '/otzyvy', label: 'Отзывы' },
  { href: '/kontakty', label: 'Контакты' },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ivory">
      <div className="mx-auto flex w-full max-w-[80rem] items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="shrink-0" aria-label="Golden Roe" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Разделы сайта">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={pathname === link.href ? 'border-b border-gold pb-0.5 text-ink' : 'text-muted hover:text-ink'}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/kontakty" className="rounded-full bg-gold px-5 py-2 text-sm text-ink">
            Записаться
          </Link>
        </nav>
        <button
          type="button"
          className="inline-flex items-center gap-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
          Меню
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="flex flex-col gap-3 border-t border-line px-5 py-4 md:hidden" aria-label="Разделы сайта">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)} aria-current={pathname === link.href ? 'page' : undefined}>
              {link.label}
            </Link>
          ))}
          <Link href="/kontakty" onClick={() => setOpen(false)} className="rounded-full bg-gold px-4 py-2 text-center text-sm text-ink">
            Записаться
          </Link>
        </nav>
      )}
    </header>
  )
}
