import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { NoteForm } from '../../../components/note-form'
import { addNote } from '../../../modules/notes/mutations'

export const Route = createFileRoute('/_authenticated/notes/new')({
  component: NewNotePage,
})

function NewNotePage() {
  const navigate = useNavigate()

  return (
    <div>
      <h1 className="mb-5 text-2xl font-bold">New Note</h1>
      <NoteForm
        submitLabel="Create Note"
        onSubmit={(data) => {
          addNote({ id: crypto.randomUUID(), ...data })
          navigate({ to: '/' })
        }}
      />
    </div>
  )
}
