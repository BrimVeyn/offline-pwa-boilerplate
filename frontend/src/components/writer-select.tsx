import type { Writer } from "@notes-pwa/shared";

interface WriterSelectProps {
  writers: Writer[];
  value: string | null;
  onChange: (writerId: string | null) => void;
}

export function WriterSelect({ writers, value, onChange }: WriterSelectProps) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="h-7 rounded-md border border-input bg-transparent px-2 text-xs text-foreground"
    >
      <option value="">No writer</option>
      {writers.map((writer) => (
        <option key={writer.id} value={writer.id}>
          {writer.firstName} {writer.lastName}
        </option>
      ))}
    </select>
  );
}
