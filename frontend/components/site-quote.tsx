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
  boxed = false,
  className = '',
}: {
  children: ReactNode
  attribution?: string | null
  tone?: 'gold' | 'ivory'
  align?: 'left' | 'right'
  boxed?: boolean
  className?: string
}) {
  const text = tone === 'ivory' ? 'text-ivory' : 'text-gold'
  const mark = tone === 'ivory' ? 'text-ivory/45' : 'text-gold/65'
  const credit = tone === 'ivory' ? 'text-ivory/70' : 'text-gold'
  const box =
    boxed && tone === 'gold'
      ? 'bg-cream/90 px-5 py-6 md:px-6 md:py-7'
      : boxed && tone === 'ivory'
        ? 'bg-ivory/95 px-5 py-6 text-ink md:px-6 md:py-7'
        : ''

  return (
    <blockquote
      className={[
        align === 'right' ? 'md:justify-self-end md:text-right' : '',
        box,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <span
        aria-hidden="true"
        className={[
          'block font-serif text-6xl leading-[0.7] md:text-7xl',
          boxed && tone === 'ivory' ? 'text-ink/35' : mark,
        ].join(' ')}
      >
        “
      </span>
      <p
        className={[
          'mt-3 max-w-sm font-serif text-2xl leading-snug italic md:text-3xl',
          boxed && tone === 'ivory' ? 'text-ink' : text,
        ].join(' ')}
      >
        {children}
      </p>
      {attribution ? (
        <p className={`mt-4 text-xs tracking-[0.22em] uppercase ${boxed && tone === 'ivory' ? 'text-muted' : credit}`}>
          {attribution}
        </p>
      ) : null}
    </blockquote>
  )
}
