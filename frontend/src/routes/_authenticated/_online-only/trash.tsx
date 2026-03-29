import { useLiveQuery } from '@tanstack/react-db'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'

import { deletedNotesCollection } from '../../../modules/trash/deleted-notes-collection'
import { deletedWritersCollection } from '../../../modules/trash/deleted-writers-collection'

export const Route = createFileRoute('/_authenticated/_online-only/trash')({
  beforeLoad: ({ context }) => {
    if (context.session.user.role !== 'admin') throw redirect({ to: '/' })
  },
  component: TrashPage,
})

function TrashPage() {
  const { data: notes } = useLiveQuery((q) =>
    q.from({ note: deletedNotesCollection }).orderBy(({ note }) => note.deletedAt, 'desc')
  )

  const { data: writers } = useLiveQuery((q) =>
    q.from({ writer: deletedWritersCollection }).orderBy(({ writer }) => writer.lastName, 'asc')
  )

  const [restoring, setRestoring] = useState<string | null>(null)

  const restoreNote = async (id: string) => {
    setRestoring(id)
    await api.trash.notes({ id }).restore.post()
    setRestoring(null)
  }

  const restoreWriter = async (id: string) => {
    setRestoring(id)
    await api.trash.writers({ id }).restore.post()
    setRestoring(null)
  }

  const isEmpty = notes.length === 0 && writers.length === 0

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Trash</h1>
        <Link to="/" className={buttonVariants({ variant: 'outline' })}>
          Back to home
        </Link>
      </div>

      {isEmpty ? (
        <p className="text-muted-foreground py-8 text-center text-sm">Trash is empty.</p>
      ) : (
        <>
          {writers.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold">Deleted Writers</h2>
              <div className="flex flex-col gap-3">
                {writers.map((writer) => (
                  <Card key={writer.id} size="sm">
                    <CardHeader>
                      <CardTitle>
                        {writer.firstName} {writer.lastName}
                      </CardTitle>
                      <CardAction>
                        <Button
                          size="sm"
                          disabled={restoring === writer.id}
                          onClick={() => restoreWriter(writer.id)}
                        >
                          Restore
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-xs">
                        Deleted{' '}
                        {writer.deletedAt ? new Date(writer.deletedAt).toLocaleString() : 'unknown'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {notes.length > 0 && (
            <section>
              <h2 className="mb-4 text-xl font-bold">Deleted Notes</h2>
              <div className="flex flex-col gap-3">
                {notes.map((note) => (
                  <Card key={note.id} size="sm">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {note.title}
                        <Badge variant="secondary">note</Badge>
                      </CardTitle>
                      <CardAction>
                        <Button
                          size="sm"
                          disabled={restoring === note.id}
                          onClick={() => restoreNote(note.id)}
                        >
                          Restore
                        </Button>
                      </CardAction>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-xs">
                        Deleted{' '}
                        {note.deletedAt ? new Date(note.deletedAt).toLocaleString() : 'unknown'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}
