import type { ButtonHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

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

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${controlClass} min-h-28`} {...props} />
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
