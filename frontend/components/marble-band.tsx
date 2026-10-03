import { forwardRef, type CSSProperties, type ReactNode } from 'react'

const marbles = ['/textures/marble-1.png', '/textures/marble-2.png', '/textures/marble-3.png'] as const

const positions = [
  'center center',
  'left center',
  'right center',
  'center top',
  'center bottom',
  '20% 40%',
  '80% 60%',
  '40% 20%',
  '65% 75%',
] as const

function hashSeed(seed: string): number {
  let hash = 2166136261
  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function marbleStyle(seed: string): CSSProperties {
  const hash = hashSeed(seed)
  return {
    backgroundImage: `url(${marbles[hash % marbles.length]})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: positions[hash % positions.length],
  }
}

export const MarbleBand = forwardRef<HTMLElement, { seed: string; className?: string; id?: string; children: ReactNode }>(
  function MarbleBand({ seed, className = '', id, children }, ref) {
    return (
      <section id={id} ref={ref} className={className} style={marbleStyle(seed)}>
        {children}
      </section>
    )
  },
)
