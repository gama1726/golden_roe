import { useEffect, useState } from 'react'
import { Button, Field, Notice, PageTitle, controlClass } from '../components/ui'
import { api, errorText } from '../lib/api'
import type { Settings } from '../lib/types'

const pages = [
  ['home', 'Главная'],
  ['services', 'Услуги'],
  ['author', 'Об авторе'],
  ['articles', 'Статьи'],
  ['reviews', 'Отзывы'],
  ['contacts', 'Контакты'],
] as const

export function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api
      .get<{ data: Settings }>('/api/v1/admin/settings')
      .then((response) => setSettings(response.data.data))
      .catch((reason: unknown) => setError(errorText(reason)))
  }, [])

  async function save() {
    if (!settings) return
    try {
      const response = await api.patch<{ data: Settings }>('/api/v1/admin/settings', settings)
      setSettings(response.data.data)
      setNotice('Сохранено')
      setError(null)
    } catch (reason) {
      setError(errorText(reason))
    }
  }

  if (!settings) return <Notice text={error ?? 'Загрузка…'} />

  return (
    <section className="space-y-4">
      <PageTitle title="Настройки" />
      <Notice text={notice} />
      <Notice text={error} />
      <label className="flex items-center gap-2 rounded-3xl bg-white p-5 text-sm">
        <input
          type="checkbox"
          checked={settings.reviews_enabled}
          onChange={(event) => setSettings({ ...settings, reviews_enabled: event.target.checked })}
        />
        Показывать одобренные отзывы на сайте
      </label>
      {pages.map(([key, label]) => {
        const entry = settings.seo[key] ?? { title: '', description: '' }
        return (
          <div key={key} className="space-y-3 rounded-3xl bg-white p-5">
            <h2 className="font-serif text-2xl">{label}</h2>
            <Field label="Title">
              <input
                className={controlClass}
                value={entry.title ?? ''}
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    seo: { ...settings.seo, [key]: { ...entry, title: event.target.value } },
                  })
                }
              />
            </Field>
            <Field label="Description">
              <input
                className={controlClass}
                value={entry.description ?? ''}
                placeholder="Текст будет предоставлен заказчиком"
                onChange={(event) =>
                  setSettings({
                    ...settings,
                    seo: { ...settings.seo, [key]: { ...entry, description: event.target.value || null } },
                  })
                }
              />
            </Field>
          </div>
        )
      })}
      <Button type="button" onClick={save}>
        Сохранить
      </Button>
    </section>
  )
}
