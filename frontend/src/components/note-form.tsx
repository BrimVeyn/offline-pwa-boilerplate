import { useState } from "react";

interface NoteFormProps {
  initialTitle?: string;
  initialContent?: string;
  onSubmit: (data: { title: string; content: string }) => void;
  submitLabel: string;
}

export function NoteForm({ initialTitle = "", initialContent = "", onSubmit, submitLabel }: NoteFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), content });
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <input
        type="text"
        placeholder="Note title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        style={{
          padding: "10px 14px",
          fontSize: 16,
          borderRadius: 8,
          border: "1px solid #334155",
          background: "#1e293b",
          color: "#f1f5f9",
        }}
      />
      <textarea
        placeholder="Write your note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={8}
        style={{
          padding: "10px 14px",
          fontSize: 14,
          borderRadius: 8,
          border: "1px solid #334155",
          background: "#1e293b",
          color: "#f1f5f9",
          resize: "vertical",
        }}
      />
      <button
        type="submit"
        style={{
          padding: "10px 20px",
          fontSize: 15,
          fontWeight: 600,
          borderRadius: 8,
          border: "none",
          background: "#3b82f6",
          color: "white",
          cursor: "pointer",
          alignSelf: "flex-start",
        }}
      >
        {submitLabel}
      </button>
    </form>
  );
}
