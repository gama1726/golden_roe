export function formatDate(value: string | null): string | null {
  if (!value) return null
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function hasCopy(value: { title?: string | null; body?: string | null; text?: string | null; image?: { original: string | null } | null } | null): boolean {
  if (!value) return false
  return Boolean(value.title || value.body || value.text || value.image?.original)
}
