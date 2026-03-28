import type { Writer } from '@notes-pwa/shared'

interface WriterSelectProps {
  writers: Writer[]
  value: string | null
  onChange: (writerId: string | null) => void
}

export function WriterSelect({ writers, value, onChange }: WriterSelectProps) {
  return (
    <select
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="border-input text-foreground h-7 rounded-md border bg-transparent px-2 text-xs"
    >
      <option value="">No writer</option>
      {writers.map((writer) => (
        <option key={writer.id} value={writer.id}>
          {writer.firstName} {writer.lastName}
        </option>
      ))}
    </select>
  )
}
