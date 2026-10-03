import type { ReactNode } from 'react'

export function cleanQuoteText(text: string): string {
  return text
    .replace(/^[«"“„]+/u, '')
    .replace(/[»"”]+$/u, '')
    .trim()
}

export function SiteQuote({
  children,
  attribution,
  tone = 'gold',
  align = 'left',
  className = '',
}: {
  children: ReactNode
  attribution?: string | null
  tone?: 'gold' | 'ivory'
  align?: 'left' | 'right'
  className?: string
}) {
  const text = tone === 'ivory' ? 'text-ivory' : 'text-gold'
  const mark = tone === 'ivory' ? 'text-ivory/45' : 'text-gold/65'
  const credit = tone === 'ivory' ? 'text-ivory/70' : 'text-gold'

  return (
    <blockquote className={`${align === 'right' ? 'md:justify-self-end md:text-right' : ''} ${className}`.trim()}>
      <span aria-hidden="true" className={`block font-serif text-6xl leading-[0.7] md:text-7xl ${mark}`}>
        “
      </span>
      <p className={`mt-3 max-w-sm font-serif text-2xl leading-snug italic md:text-3xl ${text}`}>{children}</p>
      {attribution ? <p className={`mt-4 text-xs tracking-[0.22em] uppercase ${credit}`}>{attribution}</p> : null}
    </blockquote>
  )
}
