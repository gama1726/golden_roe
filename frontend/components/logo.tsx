export function Logo({ markClassName = 'h-12' }: { markClassName?: string }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo-deer.png" alt="" className={`${markClassName} w-auto`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/wordmark-gold.png" alt="Golden Roe" className="h-7 w-auto" />
    </span>
  )
}
