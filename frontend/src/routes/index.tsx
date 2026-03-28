import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "@tanstack/react-db";
import { notesCollection } from "../modules/notes/collection";
import { deleteNote } from "../modules/notes/mutations";
import { NoteCard } from "../components/note-card";

export const Route = createFileRoute("/")({
  component: HomePage,
});

// eslint-disable-next-line react-refresh/only-export-components
function HomePage() {
  const { data: notes } = useLiveQuery((q) =>
    q
      .from({ note: notesCollection })
      .orderBy(({ note }) => note.updatedAt, "desc"),
  );

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28, color: "#f1f5f9" }}>Notes</h1>
        <Link
          to="/notes/new"
          style={{
            padding: "8px 18px",
            fontSize: 15,
            fontWeight: 600,
            borderRadius: 8,
            background: "#3b82f6",
            color: "white",
            textDecoration: "none",
          }}
        >
          + New Note
        </Link>
      </div>

      {notes.length === 0 && (
        <p style={{ color: "#64748b", textAlign: "center", marginTop: 48 }}>
          No notes yet. Create your first one!
        </p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onDelete={(id) => deleteNote({ id })} />
        ))}
      </div>
    </div>
  );
}
