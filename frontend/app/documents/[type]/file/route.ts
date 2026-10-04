import { apiBase } from '@/lib/api'
import { NextResponse } from 'next/server'

type Context = { params: Promise<{ type: string }> }

export async function GET(_request: Request, context: Context) {
  const { type } = await context.params
  const upstream = await fetch(`${apiBase()}/api/v1/documents/${type}/file`, { cache: 'no-store' })
  const contentType = upstream.headers.get('content-type') ?? ''

  if (!upstream.ok || !contentType.includes('pdf')) {
    return NextResponse.json({ message: 'Документ будет предоставлен заказчиком' }, { status: 404 })
  }

  return new NextResponse(upstream.body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${type}.pdf"`,
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': "frame-ancestors 'self'",
      'X-Content-Type-Options': 'nosniff',
    },
  })
}
