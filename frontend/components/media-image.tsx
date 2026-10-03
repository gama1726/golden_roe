import type { ImageUrls } from '@/lib/types'

function variantWidth(url: string): string | null {
  const match = url.match(/-(\d+)\.webp(?:\?|$)/)
  if (!match) return null
  const width = Number(match[1])
  return Number.isFinite(width) && width > 0 ? String(width) : null
}

export function MediaImage({ image, className, sizes = '(min-width: 768px) 40rem, 100vw' }: { image: ImageUrls | null; className?: string; sizes?: string }) {
  if (!image?.original) return null

  const srcSet = Object.values(image.webp)
    .map((url) => {
      const width = variantWidth(url)
      return width ? `${url} ${width}w` : null
    })
    .filter((entry): entry is string => entry !== null)
    .join(', ')

  return (
    // The API already stores width-specific WebP files, so the browser picks one from srcSet.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={image.original}
      srcSet={srcSet || undefined}
      sizes={sizes}
      alt={image.alt}
      className={className}
    />
  )
}
