export function publicApiBase(): string {
  // Empty string = same origin (nginx proxies /api and /sanctum).
  const value = process.env.NEXT_PUBLIC_API_URL

  if (value === undefined) {
    // Browser: prefer same origin. Server components: local API.
    if (typeof window !== 'undefined') return ''
    return 'http://127.0.0.1:8000'
  }

  const trimmed = value.trim()
  if (trimmed === '' || trimmed === '/') return ''

  // A comma-separated host list is invalid for fetch(); fall back to same origin in the browser.
  if (trimmed.includes(',')) {
    if (typeof window !== 'undefined') return ''
    return trimmed.split(',')[0]?.trim().replace(/\/$/, '') || 'http://127.0.0.1:8000'
  }

  return trimmed.replace(/\/$/, '')
}
