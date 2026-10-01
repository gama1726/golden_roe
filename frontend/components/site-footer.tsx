import Link from 'next/link'
import type { ContactChannel, DocumentItem } from '@/lib/types'

export function SiteFooter({ contacts, documents }: { contacts: ContactChannel[]; documents: DocumentItem[] }) {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-3xl">Golden Roe</p>
        </div>
        <div>
          <h2 className="text-xs tracking-[0.18em] text-gold uppercase">Контакты</h2>
          <ul className="mt-4 space-y-2">
            {contacts.map((channel) => (
              <li key={channel.id}>
                {channel.url ? (
                  <a href={channel.url} className="hover:text-gold">
                    {channel.display}
                  </a>
                ) : (
                  <span>{channel.display}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs tracking-[0.18em] text-gold uppercase">Документы</h2>
          <ul className="mt-4 space-y-2">
            {documents.map((document) => (
              <li key={document.type}>
                <Link href={`/documents/${document.type}`} className="hover:text-gold">
                  {document.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
