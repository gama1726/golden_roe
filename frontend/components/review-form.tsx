'use client'

import { publicApiBase } from '@/lib/config'
import type { Service } from '@/lib/types'
import Link from 'next/link'
import { useState, type FormEvent } from 'react'

const fieldClass = 'w-full border border-line bg-white px-3 py-3 outline-none focus:border-gold'

export function ReviewForm({ services }: { services: Service[] }) {
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

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
      setNotice('Отзыв отправлен. Он появится на сайте после проверки.')
    } catch {
      setError('Не удалось отправить отзыв')
    } finally {
      setPending(false)
    }
  }

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <label className="grid gap-2 text-sm">
        Имя
        <input className={fieldClass} name="full_name" required maxLength={120} autoComplete="name" />
      </label>
      <label className="grid gap-2 text-sm">
        Телефон
        <input className={fieldClass} name="phone" required maxLength={32} autoComplete="tel" inputMode="tel" />
      </label>
      <label className="grid gap-2 text-sm">
        Email
        <input className={fieldClass} name="email" type="email" required maxLength={255} autoComplete="email" />
      </label>
      <label className="grid gap-2 text-sm">
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
      <fieldset className="grid gap-2">
        <legend className="text-sm">Оценка</legend>
        <div className="flex gap-3">
          {[1, 2, 3, 4, 5].map((value) => (
            <label key={value} className="inline-flex items-center gap-2 text-sm">
              <input type="radio" name="rating" value={value} required />
              {value}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="grid gap-2 text-sm">
        Заголовок
        <input className={fieldClass} name="title" required maxLength={180} />
      </label>
      <label className="grid gap-2 text-sm">
        Текст
        <textarea className={`${fieldClass} min-h-36`} name="text" required maxLength={5000} />
      </label>
      <label className="flex items-start gap-3 text-sm">
        <input className="mt-1" type="checkbox" name="consent" required />
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
      {error && <p className="text-sm">{error}</p>}
      {notice && <p className="text-sm">{notice}</p>}
      <button type="submit" className="justify-self-start bg-ink px-5 py-3 text-sm text-ivory disabled:opacity-60" disabled={pending}>
        {pending ? 'Отправка…' : 'Отправить отзыв'}
      </button>
    </form>
  )
}
