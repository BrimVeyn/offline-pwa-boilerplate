import { Link } from "@tanstack/react-router";
import type { Note } from "@notes-pwa/shared";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
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
      <CardFooter className="text-xs text-muted-foreground">
        {new Date(note.updatedAt).toLocaleString()}
      </CardFooter>
    </Card>
  );
}
