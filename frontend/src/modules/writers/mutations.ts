import { writersCollection } from "./collection";
import { notesCollection } from "../notes/collection";
import { executeMutation } from "../../offline";

export function addWriter(writer: { id: string; firstName: string; lastName: string }) {
  executeMutation(() => {
    writersCollection.insert({
      id: writer.id,
      firstName: writer.firstName,
      lastName: writer.lastName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
}

export function updateWriter(vars: { id: string; firstName: string; lastName: string }) {
  executeMutation(() => {
    writersCollection.update(vars.id, (draft) => {
      draft.firstName = vars.firstName;
      draft.lastName = vars.lastName;
      draft.updatedAt = new Date();
    });
  });
}

export function deleteWriter(vars: { id: string }) {
  executeMutation(() => {
    for (const [, note] of notesCollection.state) {
      if (note.writerId === vars.id) {
        notesCollection.delete(note.id);
      }
    }
    writersCollection.delete(vars.id);
  });
}
