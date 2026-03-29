import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_online-only/admin')({
  component: AdminPage,
})

function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin</h1>
      <p className="text-muted-foreground">Admin panel — salut l&apos;amis soon.</p>
    </div>
  )
}
