import { useEffect, useState } from 'react'
import { Field, Notice, PageTitle, cardClass, cardHeadingClass, controlClass } from '../components/ui'
import { api, errorText } from '../lib/api'
import { usePageSave } from '../lib/save-bar'
import type { FooterSettings } from '../lib/types'

const empty: FooterSettings = { legal_name: '', inn: '' }

function snapshot(value: FooterSettings) {
  return JSON.stringify({
    legal_name: value.legal_name ?? '',
    inn: value.inn ?? '',
  })
}

export function FooterPage() {
  const [footer, setFooter] = useState<FooterSettings>(empty)
  const [baseline, setBaseline] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const dirty = baseline !== null && snapshot(footer) !== baseline

  useEffect(() => {
    api
      .get<{ data: { footer?: FooterSettings } }>('/api/v1/admin/settings')
      .then((response) => {
        const next = {
          legal_name: response.data.data.footer?.legal_name ?? '',
          inn: response.data.data.footer?.inn ?? '',
        }
        setFooter(next)
        setBaseline(snapshot(next))
      })
      .catch((reason: unknown) => setError(errorText(reason)))
  }, [])

  async function save() {
    const response = await api.patch<{ data: { footer: FooterSettings } }>('/api/v1/admin/settings', {
      footer: {
        legal_name: footer.legal_name || null,
        inn: footer.inn || null,
      },
    })
    const next = {
      legal_name: response.data.data.footer?.legal_name ?? '',
      inn: response.data.data.footer?.inn ?? '',
    }
    setFooter(next)
    setBaseline(snapshot(next))
    setError(null)
  }

  usePageSave('footer', dirty, save)

  return (
    <section className="space-y-6">
      <PageTitle title="Футер" />
      <p className="text-sm text-muted">
        Реквизиты внизу сайта, рядом с копирайтом. Пустое поле на сайте не показывается.
      </p>
      <Notice text={error} />
      <div className={cardClass}>
        <h2 className={cardHeadingClass}>Реквизиты</h2>
        <Field label="ФИО / наименование">
          <input
            className={controlClass}
            value={footer.legal_name ?? ''}
            onChange={(event) => setFooter({ ...footer, legal_name: event.target.value })}
            placeholder="Вартанова Эльвира Борисовна"
          />
        </Field>
        <Field label="ИНН">
          <input
            className={controlClass}
            value={footer.inn ?? ''}
            onChange={(event) => setFooter({ ...footer, inn: event.target.value })}
            placeholder="050023384299"
          />
        </Field>
      </div>
    </section>
  )
}
