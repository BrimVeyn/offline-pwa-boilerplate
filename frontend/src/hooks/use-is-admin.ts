import { authClient } from '@/lib/auth-client'

export function useIsAdmin() {
  const { data: session } = authClient.useSession()
  const role = (session?.user as Record<string, unknown> | undefined)?.role
  return role === 'admin'
}
