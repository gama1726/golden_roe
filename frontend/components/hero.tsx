import type { ReactNode } from 'react'

/** Shared hero overlays so dark pages don't drift into different fog strengths. */
export function HeroOverlay({
  variant = 'dark',
}: {
  variant?: 'dark' | 'dark-soft' | 'light' | 'band' | 'home'
}) {
  if (variant === 'home') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent md:bg-gradient-to-r md:from-ink/80 md:via-ink/30 md:to-transparent"
      />
    )
  }

  if (variant === 'light') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ivory via-ivory/55 to-transparent"
      />
    )
  }

  if (variant === 'band') {
    return <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-ink/40" />
  }

  if (variant === 'dark-soft') {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/25 to-transparent"
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/30 to-transparent"
    />
  )
}

export const heroFrame = 'relative z-10 mx-auto flex w-full max-w-[80rem] items-center'

/** Clears the fixed header on every hero. */
export const heroPad = 'px-4 pt-28 pb-12 sm:px-5 md:px-10 md:pt-32 md:pb-20'

export const ctaPrimary =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold-button px-5 py-3 text-sm text-ink'

export const ctaSecondaryOnDark =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-ivory/40 px-5 py-3 text-sm'

export const ctaSecondaryOnLight =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-line px-5 py-3 text-sm'

export function HeroShell({
  minHeight = 'min-h-[38rem] md:min-h-[44rem]',
  children,
}: {
  minHeight?: string
  children: ReactNode
}) {
  return <div className={`${heroFrame} ${minHeight}`}>{children}</div>
}
