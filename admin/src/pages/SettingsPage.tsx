import { useEffect, useState } from 'react'
import { Field, Notice, PageTitle, SaveButton, controlClass, useSaveFeedback } from '../components/ui'
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
  const [error, setError] = useState<string | null>(null)
  const feedback = useSaveFeedback()

  useEffect(() => {
    api
      .get<{ data: Settings }>('/api/v1/admin/settings')
      .then((response) => setSettings(response.data.data))
      .catch((reason: unknown) => setError(errorText(reason)))
  }, [])

  async function save() {
    if (!settings) return
    const response = await api.patch<{ data: Settings }>('/api/v1/admin/settings', settings)
    setSettings(response.data.data)
    setError(null)
  }

  if (!settings) return <Notice text={error ?? 'Загрузка…'} />

  return (
    <section className="space-y-4">
      <PageTitle title="Настройки" />
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
            <Field label="Заголовок страницы">
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
            <Field label="Описание">
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
      <SaveButton type="button" idle="Сохранить" pending={feedback.pending('settings')} saved={feedback.saved('settings')} onClick={() => feedback.run('settings', save).catch((reason: unknown) => setError(errorText(reason)))} />
    </section>
  )
}
