import { Check } from 'lucide-react'
import { useEffect, useRef, useState, type ButtonHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from 'react'

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' }) {
  const styles = {
    primary: 'bg-ink text-ivory hover:bg-ink/90',
    ghost: 'border border-line bg-white hover:bg-cream',
    danger: 'border border-red-200 text-red-800 hover:bg-red-50',
  }[variant]

  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm disabled:opacity-50 ${styles} ${className}`}
      {...props}
    />
  )
}

export function Field({
  label,
  children,
}: {
  label: string
  children: ReactNode
}) {
  return (
    <label className="block space-y-1.5 text-sm">
      <span className="text-muted">{label}</span>
      {children}
    </label>
  )
}

export const controlClass =
  'w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none'

export const cardClass = 'space-y-5 rounded-3xl bg-white p-5'
export const cardHeadingClass = 'font-serif text-2xl leading-tight'

export function FilePicker({
  label,
  accept,
  buttonLabel = 'Выбрать файл',
  hint,
  preview,
  onPick,
  onClear,
}: {
  label: string
  accept: string
  buttonLabel?: string
  hint?: string | null
  preview?: string | null
  onPick: (file: File | undefined) => void
  onClear?: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-1.5 text-sm">
      <p className="text-muted">{label}</p>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex shrink-0 items-center rounded-full border border-line bg-white px-4 py-2 text-sm hover:bg-cream"
          onClick={() => inputRef.current?.click()}
        >
          {buttonLabel}
        </button>
        {hint ? <span className="min-w-0 truncate text-muted">{hint}</span> : null}
        {onClear && preview ? (
          <button type="button" className="shrink-0 text-muted underline" onClick={onClear}>
            Убрать
          </button>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => {
          onPick(event.target.files?.[0])
          event.target.value = ''
        }}
      />
      {preview ? (
        <img src={preview} alt="" className="mt-2 max-h-48 w-full max-w-md rounded-2xl object-cover" />
      ) : null}
    </div>
  )
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${controlClass} min-h-28`} {...props} />
}

export function SaveButton({
  pending = false,
  saved = false,
  idle = 'Сохранить',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { pending?: boolean; saved?: boolean; idle?: string }) {
  return (
    <Button {...props} type={props.type ?? 'submit'} disabled={pending || props.disabled} aria-live="polite">
      {pending ? (
        <>
          <span className="size-3.5 animate-spin rounded-full border-2 border-current border-r-transparent" aria-hidden="true" />
          Сохраняю…
        </>
      ) : saved ? (
        <>
          <Check aria-hidden="true" size={16} />
          Сохранено
        </>
      ) : (
        idle
      )}
    </Button>
  )
}

export function useSaveFeedback() {
  const [pendingId, setPendingId] = useState<string | null>(null)
  const [savedId, setSavedId] = useState<string | null>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  async function run(id: string, action: () => Promise<void>) {
    setPendingId(id)
    setSavedId((current) => (current === id ? null : current))
    try {
      await action()
      setSavedId(id)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => {
        setSavedId((current) => (current === id ? null : current))
      }, 2000)
    } finally {
      setPendingId((current) => (current === id ? null : current))
    }
  }

  return {
    run,
    pending: (id: string) => pendingId === id,
    saved: (id: string) => savedId === id && pendingId !== id,
  }
}

export function Notice({ text }: { text: string | null }) {
  if (!text) return null
  return <p className="rounded-xl bg-cream px-3 py-2 text-sm text-ink">{text}</p>
}

export function PageTitle({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <h1 className="font-serif text-4xl leading-none">{title}</h1>
      {children}
    </div>
  )
}
