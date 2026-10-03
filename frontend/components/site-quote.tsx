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
      <p
        className={[
          'max-w-sm font-script text-[1.65rem] leading-snug md:text-[1.85rem]',
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
