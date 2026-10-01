import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { RichText } from '../components/Editor'
import { Button, Field, Notice, PageTitle, controlClass } from '../components/ui'
import { api, errorText, uploadImage } from '../lib/api'
import type { Article, StoredImage } from '../lib/types'

export function ArticleEditorPage() {
  const params = useParams()
  const navigate = useNavigate()
  const isNew = params.id === 'new'
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [content, setContent] = useState('<p></p>')
  const [published, setPublished] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [image, setImage] = useState<StoredImage | null>(null)
  const [ready, setReady] = useState(isNew)
  const [notice, setNotice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isNew || !params.id) return
    api
      .get<{ data: Article }>(`/api/v1/admin/articles/${params.id}`)
      .then((response) => {
        const article = response.data.data
        setTitle(article.title)
        setExcerpt(article.excerpt ?? '')
        setContent(article.content || '<p></p>')
        setPublished(article.is_published)
        setPreview(article.image?.original ?? null)
        setReady(true)
      })
      .catch((reason: unknown) => setError(errorText(reason)))
  }, [isNew, params.id])

  async function onFile(file: File | undefined) {
    if (!file) return
    const uploaded = await uploadImage(file)
    setImage({ original: uploaded.original, webp: uploaded.webp, alt: uploaded.alt })
    setPreview(uploaded.urls.original)
  }

  async function save(event: FormEvent) {
    event.preventDefault()
    const payload: Record<string, unknown> = {
      title,
      excerpt: excerpt || null,
      content,
      is_published: published,
    }
    if (image) payload.image = image
    try {
      if (isNew) {
        const response = await api.post<{ data: Article }>('/api/v1/admin/articles', payload)
        navigate(`/articles/${response.data.data.id}`, { replace: true })
      } else {
        await api.patch(`/api/v1/admin/articles/${params.id}`, payload)
      }
      setNotice('Сохранено')
      setError(null)
    } catch (reason) {
      setError(errorText(reason))
    }
  }

  return (
    <section>
      <PageTitle title={isNew ? 'Новая статья' : 'Статья'}>
        <Link to="/articles" className="text-sm text-muted">
          К списку
        </Link>
      </PageTitle>
      <Notice text={notice} />
      <Notice text={error} />
      {ready && (
        <form onSubmit={save} className="space-y-4">
          <Field label="Название">
            <input className={controlClass} value={title} onChange={(event) => setTitle(event.target.value)} required />
          </Field>
          <Field label="Короткое описание">
            <input className={controlClass} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} />
          </Field>
          <Field label="Изображение">
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => onFile(event.target.files?.[0])} />
          </Field>
          {preview && <img src={preview} alt="" className="max-h-64 rounded-2xl object-cover" />}
          <RichText key={params.id ?? 'new'} initial={content} onChange={setContent} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
            Опубликовать
          </label>
          <Button type="submit">Сохранить</Button>
        </form>
      )}
    </section>
  )
}
