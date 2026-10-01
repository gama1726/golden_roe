import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-24">
      <h1 className="font-serif text-5xl">Страница не найдена</h1>
      <Link href="/" className="mt-8 inline-block text-sm underline decoration-gold underline-offset-4">
        На главную
      </Link>
    </section>
  )
}
