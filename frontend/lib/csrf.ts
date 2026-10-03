export function xsrfToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|; )XSRF-TOKEN=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

/** Sanctum SPA cookie + header. Needed when the public site shares a stateful domain with the API. */
export async function ensureCsrf(apiBase: string): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  }

  await fetch(`${apiBase}/sanctum/csrf-cookie`, {
    method: 'GET',
    credentials: 'include',
    headers: { Accept: 'application/json' },
  })

  const token = xsrfToken()
  if (token) {
    headers['X-XSRF-TOKEN'] = token
  }

  return headers
}
