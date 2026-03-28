import { eq, useLiveQuery } from '@tanstack/react-db'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { NoteForm } from '../../components/note-form'
import { notesCollection } from '../../modules/notes/collection'
import { updateNote } from '../../modules/notes/mutations'

export const Route = createFileRoute('/notes/$noteId/edit')({
  component: EditNotePage,
})

function EditNotePage() {
  const { noteId } = Route.useParams()
  const navigate = useNavigate()

  const { data: notes } = useLiveQuery((q) =>
    q.from({ note: notesCollection }).where(({ note }) => eq(note.id, noteId))
  )

  const note = notes[0]

  if (!note) return <p className="text-destructive">Note not found</p>

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">Edit Note</h1>
      <NoteForm
        initialTitle={note.title}
        initialContent={note.content}
        submitLabel="Save Changes"
        onSubmit={(data) => {
          updateNote({ id: noteId, ...data })
          navigate({ to: '/' })
        }}
      />
    </div>
  )
}
