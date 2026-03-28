import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "@tanstack/react-db";
import { notesCollection } from "../modules/notes/collection";
import { deleteNote } from "../modules/notes/mutations";
import { NoteCard } from "../components/note-card";
import { buttonVariants } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { data: notes } = useLiveQuery((q) =>
    q.from({ note: notesCollection }).orderBy(({ note }) => note.updatedAt, "desc"),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notes</h1>
        <Link to="/notes/new" className={buttonVariants()}>
          + New Note
        </Link>
      </div>

      {notes.length === 0 && (
        <p className="text-muted-foreground text-center mt-12">
          No notes yet. Create your first one!
        </p>
      )}

      <div className="flex flex-col gap-3">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onDelete={(id) => deleteNote({ id })} />
        ))}
      </div>
    </div>
  );
}
