import { notesCollection } from '../notes/collection'
import { writersCollection } from './collection'

export function addWriter(writer: { id: string; firstName: string; lastName: string }) {
  writersCollection.insert({
    id: writer.id,
    firstName: writer.firstName,
    lastName: writer.lastName,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

export function updateWriter(vars: { id: string; firstName: string; lastName: string }) {
  writersCollection.update(vars.id, (draft) => {
    draft.firstName = vars.firstName
    draft.lastName = vars.lastName
    draft.updatedAt = new Date()
  })
}

export function deleteWriter(vars: { id: string }) {
  for (const [, note] of notesCollection.state) {
    if (note.writerId === vars.id) {
      notesCollection.delete(note.id)
    }
  }
  writersCollection.delete(vars.id)
}
