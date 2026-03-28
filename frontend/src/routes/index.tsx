import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLiveQuery } from "@tanstack/react-db";
import { notesCollection } from "../modules/notes/collection";
import { deleteNote, assignWriter } from "../modules/notes/mutations";
import { writersCollection } from "../modules/writers/collection";
import { addWriter, deleteWriter } from "../modules/writers/mutations";
import { NoteCard } from "../components/note-card";
import { WriterCard } from "../components/writer-card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  const { data: notes } = useLiveQuery((q) =>
    q.from({ note: notesCollection }).orderBy(({ note }) => note.updatedAt, "desc"),
  );

  const { data: writers } = useLiveQuery((q) =>
    q.from({ writer: writersCollection }).orderBy(({ writer }) => writer.lastName, "asc"),
  );

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleAddWriter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;
    addWriter({
      id: crypto.randomUUID(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    });
    setFirstName("");
    setLastName("");
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Writers section */}
      <section>
        <h2 className="text-xl font-bold mb-4">Writers</h2>
        <form onSubmit={handleAddWriter} className="flex gap-2 mb-4">
          <Input
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <Input
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <Button type="submit" size="sm">
            Add
          </Button>
        </form>
        {writers.length === 0 && <p className="text-muted-foreground text-sm">No writers yet.</p>}
        <div className="flex flex-col gap-2">
          {writers.map((writer) => (
            <WriterCard key={writer.id} writer={writer} onDelete={(id) => deleteWriter({ id })} />
          ))}
        </div>
      </section>

      {/* Notes section */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Notes</h2>
          <Link to="/notes/new" className={buttonVariants()}>
            + New Note
          </Link>
        </div>
        {notes.length === 0 && (
          <p className="text-muted-foreground text-sm">No notes yet. Create your first one!</p>
        )}
        <div className="flex flex-col gap-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              writers={writers}
              onDelete={(id) => deleteNote({ id })}
              onAssignWriter={(noteId, writerId) => assignWriter({ noteId, writerId })}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
