import type { Writer } from "@notes-pwa/shared";
import { Card, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WriterCardProps {
  writer: Writer;
  onDelete: (id: string) => void;
}

export function WriterCard({ writer, onDelete }: WriterCardProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          {writer.firstName} {writer.lastName}
        </CardTitle>
        <CardAction>
          <Button variant="destructive" size="xs" onClick={() => onDelete(writer.id)}>
            Delete
          </Button>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
