import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { Button } from './ui'

type Props = {
  initial: string
  onChange: (html: string) => void
}

export function RichText({ initial, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: 'Текст статьи' }),
    ],
    content: initial,
    onUpdate: ({ editor: current }) => onChange(current.getHTML()),
  })

  if (!editor) return null

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined
    const next = window.prompt('Ссылка', previous ?? 'https://')
    if (next === null) return
    if (next === '') {
      editor.chain().focus().unsetLink().run()
      return
    }
    editor.chain().focus().setLink({ href: next }).run()
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-white">
      <div className="flex flex-wrap gap-2 border-b border-line p-2">
        <Button type="button" variant="ghost" onClick={() => editor.chain().focus().toggleBold().run()}>
          Жирный
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor.chain().focus().toggleItalic().run()}>
          Курсив
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          Заголовок
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor.chain().focus().toggleBulletList().run()}>
          Список
        </Button>
        <Button type="button" variant="ghost" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Цитата
        </Button>
        <Button type="button" variant="ghost" onClick={setLink}>
          Ссылка
        </Button>
      </div>
      <EditorContent editor={editor} className="px-4 py-3" />
    </div>
  )
}
