import type { ImageUrls } from '@/lib/types'

export function MediaImage({ image, className, sizes = '(min-width: 768px) 40rem, 100vw' }: { image: ImageUrls | null; className?: string; sizes?: string }) {
  if (!image?.original) return null

  const srcSet = Object.entries(image.webp)
    .map(([width, url]) => `${url} ${width}w`)
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
