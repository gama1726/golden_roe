'use client'

import { MarbleBand } from '@/components/marble-band'
import { MediaImage } from '@/components/media-image'
import { ReviewForm } from '@/components/review-form'
import { SiteQuote, cleanQuoteText } from '@/components/site-quote'
import { formatDate } from '@/lib/format'
import type { Banner, Block, ReviewItem, Service } from '@/lib/types'
import { ArrowRight, Star, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function ReviewsView({
  banner,
  quote,
  intro,
  reviews,
  cta,
  note,
  services,
}: {
  banner: Banner | null
  quote: Block | null
  intro: Block | null
  reviews: ReviewItem[]
  cta: Block | null
  note: Block | null
  services: Service[]
}) {
  const [formOpen, setFormOpen] = useState(false)
  const formRef = useRef<HTMLElement>(null)

  function openForm() {
    setFormOpen(true)
  }

  useEffect(() => {
    if (window.location.hash === '#otzyv') {
      setFormOpen(true)
    }
  }, [])

  useEffect(() => {
    if (!formOpen) return
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [formOpen])

  return (
    <>
      <section className="relative min-h-[34rem] overflow-hidden bg-ivory text-ink md:min-h-[40rem]">
        <MediaImage image={banner?.image ?? null} className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[72%_center]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ivory via-ivory/88 to-ivory/10" />
        <div className="relative z-10 mx-auto flex min-h-[34rem] w-full max-w-[80rem] items-center md:min-h-[40rem]">
          <div className="grid w-full items-end gap-8 px-5 py-16 md:grid-cols-[minmax(0,28rem)_minmax(0,16rem)] md:px-10 md:py-20">
            <div>
              {banner?.title && <p className="text-xs tracking-[0.28em] text-gold uppercase">{banner.title}</p>}
              <h1 className="mt-5 font-serif text-5xl leading-[0.95] font-medium md:text-7xl">{banner?.subtitle || 'Отзывы'}</h1>
              {banner?.text && <p className="mt-6 max-w-md leading-relaxed text-muted">{banner.text}</p>}
              <button type="button" onClick={openForm} className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-button px-5 py-3 text-sm text-ink">
                Оставить отзыв
                <ArrowRight aria-hidden="true" size={16} />
              </button>
            </div>
            {quote?.title && (
              <SiteQuote attribution={quote.eyebrow}>{cleanQuoteText(quote.title)}</SiteQuote>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[80rem] px-5 py-16 md:py-24">
        {intro?.eyebrow && <p className="text-xs tracking-[0.22em] text-gold uppercase">{intro.eyebrow}</p>}
        <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_18rem] lg:items-end">
          {intro?.title && <h2 className="font-serif text-4xl md:text-5xl">{intro.title}</h2>}
          {intro?.body && <p className="leading-relaxed text-muted">{intro.body}</p>}
        </div>
        {reviews.length > 0 ? (
          <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <p className="mt-12 text-muted">Одобренных отзывов пока нет.</p>
        )}
      </section>

      {cta && (
        <section className="relative min-h-[24rem] overflow-hidden bg-ink text-ivory">
          <MediaImage image={cta.image} className="pointer-events-none absolute inset-0 h-full w-full object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-ink/45" />
          <div className="relative z-10 mx-auto grid min-h-[24rem] w-full max-w-[80rem] items-center gap-10 px-5 py-16 md:grid-cols-2 md:px-10">
            <div>
              {cta.eyebrow && <p className="text-xs tracking-[0.22em] text-gold uppercase">{cta.eyebrow}</p>}
              {cta.title && <h2 className="mt-4 font-serif text-4xl md:text-5xl">{cta.title}</h2>}
              {cta.body && <p className="mt-6 max-w-md leading-relaxed text-ivory/85">{cta.body}</p>}
              <button type="button" onClick={openForm} className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold-button px-5 py-3 text-sm text-ink">
                Оставить отзыв
                <ArrowRight aria-hidden="true" size={16} />
              </button>
            </div>
            {note?.body && <p className="max-w-sm leading-relaxed text-ivory/85 md:justify-self-end">{note.body}</p>}
          </div>
        </section>
      )}

      {formOpen && (
        <MarbleBand id="otzyv" ref={formRef} seed="reviews-form" className="scroll-mt-24 border-t border-line">
          <div className="mx-auto w-full max-w-3xl px-5 py-14 md:px-10 md:py-20">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs tracking-[0.22em] text-gold uppercase">Обратная связь</p>
                <h2 className="mt-3 font-serif text-4xl md:text-5xl">Оставить отзыв</h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">Отзыв появится на сайте после проверки.</p>
              </div>
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-ivory text-ink"
                aria-label="Закрыть форму"
              >
                <X aria-hidden="true" size={18} />
              </button>
            </div>
            <div className="mt-10 border-t border-line pt-10">
              <ReviewForm services={services} />
            </div>
          </div>
        </MarbleBand>
      )}
    </>
  )
}

function ReviewCard({ review }: { review: ReviewItem }) {
  const date = formatDate(review.created_at)

  return (
    <article>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar review={review} />
          <div>
            <p className="font-medium">{review.full_name}</p>
            {date && <p className="text-sm text-muted">{date}</p>}
          </div>
        </div>
        {review.service && <p className="max-w-[9rem] text-right text-xs text-muted">{review.service}</p>}
      </div>
      <Stars rating={review.rating} />
      <h2 className="mt-4 font-serif text-2xl leading-tight">{review.title}</h2>
      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">{review.text}</p>
    </article>
  )
}

function Avatar({ review }: { review: ReviewItem }) {
  if (review.image?.original) {
    return <MediaImage image={review.image} className="h-12 w-12 rounded-full object-cover" />
  }

  const letter = review.full_name.trim().charAt(0).toUpperCase()
  return <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cream font-serif text-lg">{letter}</span>
}

function Stars({ rating }: { rating: number }) {
  return (
    <p className="mt-4 flex gap-0.5 text-gold" aria-label={`${rating} из 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} aria-hidden="true" size={14} fill={index < rating ? 'currentColor' : 'none'} />
      ))}
    </p>
  )
}
