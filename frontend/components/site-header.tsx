'use client'

import { Logo } from '@/components/logo'
import { Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

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

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-20 border-b border-line bg-ivory">
      <div className="mx-auto flex w-full max-w-[80rem] items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
        <Link href="/" className="min-w-0 shrink" aria-label="Golden Roe" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav className="hidden items-center gap-4 whitespace-nowrap lg:flex xl:gap-6" aria-label="Разделы сайта">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={pathname === link.href ? 'border-b border-gold pb-0.5 text-sm text-ink' : 'text-sm text-muted hover:text-ink'}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/kontakty" className="rounded-full bg-gold px-4 py-2 text-sm text-ink xl:px-5">
            Записаться
          </Link>
        </nav>
        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? 'Закрыть меню' : 'Меню'}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" size={22} /> : <Menu aria-hidden="true" size={22} />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="flex flex-col gap-1 border-t border-line px-4 py-3 sm:px-5 lg:hidden" aria-label="Разделы сайта">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === link.href ? 'page' : undefined}
              className="rounded-xl px-2 py-3 text-base"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/kontakty" onClick={() => setOpen(false)} className="mt-2 rounded-full bg-gold px-4 py-3 text-center text-sm text-ink">
            Записаться
          </Link>
        </nav>
      )}
    </header>
  )
}
