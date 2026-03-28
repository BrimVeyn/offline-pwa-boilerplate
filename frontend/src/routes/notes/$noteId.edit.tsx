import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { notesCollection } from "../../modules/notes/collection";
import { updateNote } from "../../modules/notes/mutations";
import { NoteForm } from "../../components/note-form";

export const Route = createFileRoute("/notes/$noteId/edit")({
  component: EditNotePage,
});

function EditNotePage() {
  const { noteId } = Route.useParams();
  const navigate = useNavigate();

  const { data: notes } = useLiveQuery((q) =>
    q.from({ note: notesCollection }).where(({ note }) => eq(note.id, noteId)),
  );

  const note = notes[0];

  if (!note) return <p style={{ color: "#ef4444" }}>Note not found</p>;

  return (
    <div>
      <h1 style={{ fontSize: 24, color: "#f1f5f9", marginBottom: 20 }}>
        Edit Note
      </h1>
      <NoteForm
        initialTitle={note.title}
        initialContent={note.content}
        submitLabel="Save Changes"
        onSubmit={(data) => {
          updateNote({ id: noteId, ...data });
          navigate({ to: "/" });
        }}
      />
    </div>
  );
}
