import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { addNote } from "../../modules/notes/mutations";
import { NoteForm } from "../../components/note-form";

export const Route = createFileRoute("/notes/new")({
  component: NewNotePage,
});

function NewNotePage() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">New Note</h1>
      <NoteForm
        submitLabel="Create Note"
        onSubmit={(data) => {
          addNote({ id: crypto.randomUUID(), ...data });
          navigate({ to: "/" });
        }}
      />
    </div>
  );
}
