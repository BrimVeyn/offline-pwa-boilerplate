import { notesCollection } from "./collection";
import { executeMutation } from "../../offline";

export function addNote(note: { id: string; title: string; content: string }) {
  executeMutation(() => {
    notesCollection.insert({
      id: note.id,
      title: note.title,
      content: note.content,
      writerId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  });
}

export function updateNote(vars: { id: string; title: string; content: string }) {
  executeMutation(() => {
    notesCollection.update(vars.id, (draft) => {
      draft.title = vars.title;
      draft.content = vars.content;
      draft.updatedAt = new Date();
    });
  });
}

export function assignWriter(vars: { noteId: string; writerId: string | null }) {
  executeMutation(() => {
    notesCollection.update(vars.noteId, (draft) => {
      draft.writerId = vars.writerId;
      draft.updatedAt = new Date();
    });
  });
}

export function deleteNote(vars: { id: string }) {
  executeMutation(() => {
    notesCollection.delete(vars.id);
  });
}
