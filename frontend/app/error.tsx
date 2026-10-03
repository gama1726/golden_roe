'use client'

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 pt-28 pb-24">
      <h1 className="font-serif text-5xl">Не удалось открыть страницу</h1>
      <button type="button" className="mt-8 border border-ink px-5 py-3 text-sm" onClick={reset}>
        Повторить
      </button>
    </section>
  )
}
