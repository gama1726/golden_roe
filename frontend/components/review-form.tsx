'use client'

import { publicApiBase } from '@/lib/config'
import type { Service } from '@/lib/types'
import { Star } from 'lucide-react'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'

const fieldClass =
  'w-full rounded-xl border border-line bg-ivory px-4 py-3.5 text-sm text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-gold focus:bg-white'

export function ReviewForm({ services }: { services: Service[] }) {
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [rating, setRating] = useState(5)

  if (services.length === 0) {
    return <p className="text-muted">Форма откроется, когда в каталоге появится услуга.</p>
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    setPending(true)
    setError(null)
    setNotice(null)

    try {
      const response = await fetch(`${publicApiBase()}/api/v1/reviews`, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: data.get('full_name'),
          phone: data.get('phone'),
          email: data.get('email'),
          service_id: Number(data.get('service_id')),
          rating: Number(data.get('rating')),
          title: data.get('title'),
          text: data.get('text'),
          consent: data.get('consent') === 'on',
          website: data.get('website'),
        }),
      })
      const payload = (await response.json()) as { message?: string; errors?: Record<string, string[]> }
      if (!response.ok) {
        const messages = payload.errors ? Object.values(payload.errors).flat() : [payload.message ?? 'Не удалось отправить отзыв']
        setError(messages.join(' '))
        return
      }
      form.reset()
      setRating(5)
      setNotice('Отзыв отправлен. Он появится на сайте после проверки.')
    } catch {
      setError('Не удалось отправить отзыв')
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="grid gap-6" onSubmit={onSubmit}>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="grid gap-3 text-sm">
          Имя
          <input className={fieldClass} name="full_name" required maxLength={120} autoComplete="name" placeholder="Как к вам обращаться" />
        </label>
        <label className="grid gap-3 text-sm">
          Телефон
          <input className={fieldClass} name="phone" required maxLength={32} autoComplete="tel" inputMode="tel" placeholder="+7" />
        </label>
        <label className="grid gap-3 text-sm">
          Email
          <input className={fieldClass} name="email" type="email" required maxLength={255} autoComplete="email" placeholder="name@mail.ru" />
        </label>
        <label className="grid gap-3 text-sm">
          Услуга
          <select className={fieldClass} name="service_id" required defaultValue="">
            <option value="" disabled>
              Выберите услугу
            </option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm">Оценка</legend>
        <div className="flex flex-wrap items-center gap-2" role="radiogroup" aria-label="Оценка">
          {[1, 2, 3, 4, 5].map((value) => {
            const active = value <= rating
            return (
              <label
                key={value}
                className={`inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border transition-colors ${
                  active ? 'border-gold/50 bg-ivory text-gold' : 'border-line bg-ivory text-muted hover:border-gold/40'
                }`}
              >
                <input
                  className="sr-only"
                  type="radio"
                  name="rating"
                  value={value}
                  checked={rating === value}
                  required
                  onChange={() => setRating(value)}
                  aria-label={String(value)}
                />
                <Star aria-hidden="true" size={16} fill={active ? 'currentColor' : 'none'} />
              </label>
            )
          })}
          <span className="ml-1 text-sm text-muted">{rating} из 5</span>
        </div>
      </fieldset>

      <label className="grid gap-3 text-sm">
        Заголовок
        <input className={fieldClass} name="title" required maxLength={180} placeholder="Коротко о результате" />
      </label>
      <label className="grid gap-3 text-sm">
        Текст
        <textarea className={`${fieldClass} min-h-40 resize-y`} name="text" required maxLength={5000} placeholder="Расскажите о своём опыте" />
      </label>

      <label className="flex items-start gap-3 text-sm leading-relaxed">
        <input className="mt-1 h-4 w-4 accent-[var(--color-gold)]" type="checkbox" name="consent" required />
        <span>
          Даю{' '}
          <Link href="/documents/consent" className="underline decoration-gold underline-offset-4">
            согласие на обработку персональных данных
          </Link>
        </span>
      </label>

      <label className="absolute -left-[10000px] h-0 w-0 overflow-hidden" aria-hidden="true">
        Сайт
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>

      {error && <p className="rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink">{error}</p>}
      {notice && <p className="rounded-xl border border-gold/30 bg-ivory px-4 py-3 text-sm text-ink">{notice}</p>}

      <button
        type="submit"
        className="justify-self-start rounded-full bg-gold-button px-6 py-3.5 text-sm text-ink disabled:opacity-60"
        disabled={pending}
      >
        {pending ? 'Отправка…' : 'Отправить отзыв'}
      </button>
    </form>
  )
}
