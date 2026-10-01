import { timingSafeEqual } from 'node:crypto'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

function matches(expected: string, actual: string): boolean {
  const left = Buffer.from(expected)
  const right = Buffer.from(actual)
  if (left.length !== right.length) return false
  return timingSafeEqual(left, right)
}

export async function POST(request: Request) {
  const expected = process.env.REVALIDATE_SECRET ?? ''
  const token = request.headers.get('x-revalidate-token') ?? ''

  if (expected === '' || !matches(expected, token)) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }

  revalidateTag('public', { expire: 0 })
  return NextResponse.json({ revalidated: true })
}
