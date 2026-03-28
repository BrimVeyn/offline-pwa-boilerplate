import { db } from '@/db'

export namespace SyncModel {
  export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0]
}
