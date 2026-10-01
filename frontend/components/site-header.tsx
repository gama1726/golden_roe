'use client'

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
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="font-serif text-2xl tracking-wide" onClick={() => setOpen(false)}>
          Golden Roe
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Разделы сайта">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={pathname === link.href ? 'text-ink' : 'text-muted hover:text-ink'}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/kontakty" className="border border-ink px-4 py-2 text-sm">
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
          <Link href="/kontakty" onClick={() => setOpen(false)} className="border border-ink px-4 py-2 text-center text-sm">
            Записаться
          </Link>
        </nav>
      )}
    </header>
  )
}
