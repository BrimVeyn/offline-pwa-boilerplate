import { Link } from "@tanstack/react-router";
import type { Note, Writer } from "@notes-pwa/shared";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { WriterSelect } from "./writer-select";

interface NoteCardProps {
  note: Note;
  writers: Writer[];
  onDelete: (id: string) => void;
  onAssignWriter: (noteId: string, writerId: string | null) => void;
}

export function NoteCard({ note, writers, onDelete, onAssignWriter }: NoteCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{note.title}</CardTitle>
        <CardAction className="flex gap-2">
          <Link
            to="/notes/$noteId/edit"
            params={{ noteId: note.id }}
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            Edit
          </Link>
          <Button variant="destructive" size="sm" onClick={() => onDelete(note.id)}>
            Delete
          </Button>
        </CardAction>
      </CardHeader>
      {note.content && (
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {note.content.length > 200 ? note.content.slice(0, 200) + "..." : note.content}
          </p>
        </CardContent>
      )}
      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <WriterSelect
          writers={writers}
          value={note.writerId}
          onChange={(writerId) => onAssignWriter(note.id, writerId)}
        />
        <span>{new Date(note.updatedAt).toLocaleString()}</span>
      </CardFooter>
    </Card>
  );
}
