import type { AuditLog } from '@notes-pwa/shared'

import { useLiveQuery } from '@tanstack/react-db'
import { createFileRoute, Link, redirect, useNavigate } from '@tanstack/react-router'
import z4 from 'zod/v4'

import { Badge } from '@/components/ui/badge'
import { Button, buttonVariants } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

import { auditLogsCollection } from '../../../modules/audit-logs/collection'

const searchSchema = z4.object({
  table: z4.optional(z4.string()),
  action: z4.optional(z4.string()),
  offset: z4.optional(z4.number()).default(0),
})

export const Route = createFileRoute('/_authenticated/_online-only/audit-log')({
  beforeLoad: ({ context }) => {
    if (context.session.user.role !== 'admin') throw redirect({ to: '/' })
  },
  component: AuditLogPage,
  validateSearch: searchSchema,
})

const ACTIONS = ['insert', 'update', 'delete', 'restore'] as const
const TABLES = ['notes', 'writers'] as const
const PAGE_SIZE = 50

function matchesFilters(entry: AuditLog, table?: string, action?: string) {
  if (table && entry.tableName !== table) return false
  if (action && entry.action !== action) return false
  return true
}

function AuditLogPage() {
  const navigate = useNavigate({ from: '/audit-log' })
  const { table, action, offset } = Route.useSearch()

  const { data: allEntries } = useLiveQuery((q) =>
    q.from({ log: auditLogsCollection }).orderBy(({ log }) => log.createdAt, 'desc')
  )

  const filtered = allEntries.filter((e) => matchesFilters(e, table, action))
  const entries = filtered.slice(offset, offset + PAGE_SIZE)
  const hasMore = filtered.length > offset + PAGE_SIZE

  const actionVariant = (action: string) => {
    switch (action) {
      case 'insert':
        return 'default' as const
      case 'update':
        return 'secondary' as const
      case 'delete':
        return 'destructive' as const
      case 'restore':
        return 'outline' as const
      default:
        return 'secondary' as const
    }
  }

  const parseJsonField = (raw: string | null) => {
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <Link to="/" className={buttonVariants({ variant: 'outline' })}>
          Back to home
        </Link>
      </div>

      <div className="flex gap-2">
        <select
          className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
          value={table ?? ''}
          onChange={(e) =>
            navigate({
              search: (prev) => ({
                ...prev,
                table: e.target.value || undefined,
                offset: 0,
              }),
            })
          }
        >
          <option value="">All tables</option>
          {TABLES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          className="border-input bg-background rounded-md border px-3 py-1.5 text-sm"
          value={action ?? ''}
          onChange={(e) =>
            navigate({
              search: (prev) => ({
                ...prev,
                action: e.target.value || undefined,
                offset: 0,
              }),
            })
          }
        >
          <option value="">All actions</option>
          {ACTIONS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      {entries.length === 0 ? (
        <p className="text-muted-foreground py-8 text-center text-sm">No audit log entries.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => {
            const oldData = parseJsonField(entry.oldData)
            const newData = parseJsonField(entry.newData)

            return (
              <Card key={entry.id} size="sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Badge variant={actionVariant(entry.action)}>{entry.action}</Badge>
                    <Badge variant="outline">{entry.tableName}</Badge>
                    <span className="text-muted-foreground font-mono text-xs">
                      {entry.recordId.slice(0, 8)}...
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className="text-muted-foreground flex gap-4 text-xs">
                    <span>{new Date(entry.createdAt).toLocaleString()}</span>
                    {entry.userId && <span>User: {entry.userId.slice(0, 8)}...</span>}
                  </div>
                  {oldData && (
                    <details className="text-xs">
                      <summary className="text-muted-foreground cursor-pointer">Old data</summary>
                      <pre className="bg-muted mt-1 overflow-auto rounded p-2">
                        {JSON.stringify(oldData, null, 2)}
                      </pre>
                    </details>
                  )}
                  {newData && (
                    <details className="text-xs">
                      <summary className="text-muted-foreground cursor-pointer">New data</summary>
                      <pre className="bg-muted mt-1 overflow-auto rounded p-2">
                        {JSON.stringify(newData, null, 2)}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <div className="flex justify-between">
        <Button
          variant="outline"
          size="sm"
          disabled={offset === 0}
          onClick={() =>
            navigate({
              search: (prev) => ({ ...prev, offset: Math.max(0, offset - PAGE_SIZE) }),
            })
          }
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasMore}
          onClick={() => navigate({ search: (prev) => ({ ...prev, offset: offset + PAGE_SIZE }) })}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
