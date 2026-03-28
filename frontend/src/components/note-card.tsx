import { Link } from "@tanstack/react-router";
import type { Note } from "@notes-pwa/shared";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
  return (
    <div
      style={{
        background: "#1e293b",
        borderRadius: 10,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <h3 style={{ margin: 0, fontSize: 18, color: "#f1f5f9" }}>
          {note.title}
        </h3>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <Link
            to="/notes/$noteId/edit"
            params={{ noteId: note.id }}
            style={{
              padding: "4px 12px",
              fontSize: 13,
              borderRadius: 6,
              background: "#334155",
              color: "#94a3b8",
              textDecoration: "none",
            }}
          >
            Edit
          </Link>
          <button
            onClick={() => onDelete(note.id)}
            style={{
              padding: "4px 12px",
              fontSize: 13,
              borderRadius: 6,
              background: "#7f1d1d",
              color: "#fca5a5",
              border: "none",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
      {note.content && (
        <p
          style={{
            margin: 0,
            fontSize: 14,
            color: "#94a3b8",
            whiteSpace: "pre-wrap",
          }}
        >
          {note.content.length > 200
            ? note.content.slice(0, 200) + "..."
            : note.content}
        </p>
      )}
      <span style={{ fontSize: 12, color: "#64748b" }}>
        {new Date(note.updatedAt).toLocaleString()}
      </span>
      <span>{note.id}</span>
    </div>
  );
}
