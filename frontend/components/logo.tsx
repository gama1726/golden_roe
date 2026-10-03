export function Logo({
  markClassName = 'h-9 sm:h-11 lg:h-12',
  wordmarkClassName = 'h-[1.15rem] w-auto sm:h-6 lg:h-7',
}: {
  markClassName?: string
  wordmarkClassName?: string
}) {
  return (
    <span className="inline-flex items-center gap-2 sm:gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/logo-deer.png" alt="" className={`${markClassName} w-auto`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/brand/wordmark-gold.png" alt="Golden Roe" className={wordmarkClassName} />
    </span>
  )
}
