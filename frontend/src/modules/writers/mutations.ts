import { executeMutation } from '../../lib/offline'
import { assertAllowed } from '../../lib/permissions'
import { notesCollection } from '../notes/collection'
import { writersCollection } from './collection'

export function addWriter(writer: { id: string; firstName: string; lastName: string }) {
  assertAllowed('writers:insert')
  executeMutation(() => {
    writersCollection.insert({
      id: writer.id,
      firstName: writer.firstName,
      lastName: writer.lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    })
  })
}

export function updateWriter(vars: { id: string; firstName: string; lastName: string }) {
  assertAllowed('writers:update')
  executeMutation(() => {
    writersCollection.update(vars.id, (draft) => {
      draft.firstName = vars.firstName
      draft.lastName = vars.lastName
      draft.updatedAt = new Date()
    })
  })
}

export function deleteWriter(vars: { id: string }) {
  assertAllowed('writers:delete')
  executeMutation(() => {
    for (const [, note] of notesCollection.state) {
      if (note.writerId === vars.id) {
        notesCollection.delete(note.id)
      }
    }
    writersCollection.delete(vars.id)
  })
}
