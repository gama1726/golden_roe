import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { RichText } from '../components/Editor'
import { Field, FilePicker, Notice, PageTitle, controlClass } from '../components/ui'
import { api, errorText, uploadImage } from '../lib/api'
import { usePageSave } from '../lib/save-bar'
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
  const [removedImage, setRemovedImage] = useState(false)
  const [ready, setReady] = useState(isNew)
  const [error, setError] = useState<string | null>(null)
  const [baseline, setBaseline] = useState({ title: '', excerpt: '', content: '<p></p>', published: false })
  const dirty =
    title !== baseline.title ||
    excerpt !== baseline.excerpt ||
    content !== baseline.content ||
    published !== baseline.published ||
    image !== null ||
    removedImage

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
        setImage(null)
        setRemovedImage(false)
        setBaseline({
          title: article.title,
          excerpt: article.excerpt ?? '',
          content: article.content || '<p></p>',
          published: article.is_published,
        })
        setReady(true)
      })
      .catch((reason: unknown) => setError(errorText(reason)))
  }, [isNew, params.id])

  async function onFile(file: File | undefined) {
    if (!file) return
    const uploaded = await uploadImage(file)
    setImage({ original: uploaded.original, webp: uploaded.webp, alt: uploaded.alt })
    setPreview(uploaded.urls.original)
    setRemovedImage(false)
  }

  async function save() {
    const payload: Record<string, unknown> = {
      title,
      excerpt: excerpt || null,
      content,
      is_published: published,
    }
    if (image) payload.image = image
    else if (removedImage) payload.image = null
    if (isNew) {
      const response = await api.post<{ data: Article }>('/api/v1/admin/articles', payload)
      navigate(`/articles/${response.data.data.id}`, { replace: true })
    } else {
      await api.patch(`/api/v1/admin/articles/${params.id}`, payload)
      setBaseline({ title, excerpt, content, published })
      setImage(null)
      setRemovedImage(false)
    }
    setError(null)
  }

  usePageSave('article', dirty, save)

  return (
    <section>
      <PageTitle title={isNew ? 'Новая статья' : 'Статья'}>
        <Link to="/articles" className="text-sm text-muted">
          К списку
        </Link>
      </PageTitle>
      <Notice text={error} />
      {ready && (
        <div className="space-y-5">
          <Field label="Название">
            <input className={controlClass} value={title} onChange={(event) => setTitle(event.target.value)} required />
          </Field>
          <Field label="Короткое описание">
            <input className={controlClass} value={excerpt} onChange={(event) => setExcerpt(event.target.value)} />
          </Field>
          <FilePicker
            label="Изображение"
            accept="image/jpeg,image/png,image/webp"
            buttonLabel="Выбрать изображение"
            hint={preview ? 'Файл выбран' : 'JPEG, PNG или WebP'}
            preview={preview}
            onPick={onFile}
            onClear={
              preview
                ? () => {
                    setImage(null)
                    setPreview(null)
                    setRemovedImage(true)
                  }
                : undefined
            }
          />
          <RichText key={params.id ?? 'new'} initial={content} onChange={setContent} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={published} onChange={(event) => setPublished(event.target.checked)} />
            Опубликовать
          </label>
        </div>
      )}
    </section>
  )
}
