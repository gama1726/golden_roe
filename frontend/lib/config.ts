export function publicApiBase(): string {
  // Empty string = same origin (nginx proxies /api). Local default hits the API port directly.
  const value = process.env.NEXT_PUBLIC_API_URL
  if (value === undefined) return 'http://127.0.0.1:8000'
  return value.replace(/\/$/, '')
}
