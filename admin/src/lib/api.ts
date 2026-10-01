import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: { Accept: 'application/json' },
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const url = error.config?.url ?? ''
      if (!url.includes('/login') && !url.includes('/admin/me')) {
        window.dispatchEvent(new Event('auth:logout'))
      }
    }
    return Promise.reject(error)
  },
)

export async function ensureCsrf(): Promise<void> {
  await api.get('/sanctum/csrf-cookie')
}

export function errorText(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: Record<string, string[]> }
      | undefined
    const first = data?.errors ? Object.values(data.errors).flat()[0] : undefined
    return first || data?.message || 'Не удалось выполнить запрос'
  }
  return 'Не удалось выполнить запрос'
}

export async function uploadImage(file: File) {
  const body = new FormData()
  body.append('image', file)
  const response = await api.post<{
    data: { original: string; webp: Record<string, string>; alt: string; urls: { original: string | null } }
  }>('/api/v1/admin/uploads', body)
  return response.data.data
}
