import {
  writerDeleteDataSchema,
  writerInsertDataSchema,
  writerUpdateDataSchema,
} from '@notes-pwa/shared'
import z4 from 'zod/v4'

import type { SyncModel } from '@/modules/sync/model'

export namespace WriterModel {
  export type Tx = SyncModel.Tx

  export const InsertDataSchema = writerInsertDataSchema
  export type InsertData = z4.infer<typeof InsertDataSchema>

  export const UpdateDataSchema = writerUpdateDataSchema
  export type UpdateData = z4.infer<typeof UpdateDataSchema>

  export const DeleteDataSchema = writerDeleteDataSchema
  export type DeleteData = z4.infer<typeof DeleteDataSchema>
}
