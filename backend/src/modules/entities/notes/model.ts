import { noteDeleteDataSchema, noteInsertDataSchema, noteUpdateDataSchema } from '@notes-pwa/shared'
import z4 from 'zod/v4'

import { SyncModel } from '@/modules/sync/model'

export namespace NoteModel {
  export type Tx = SyncModel.Tx

  export const InsertDataSchema = noteInsertDataSchema
  export type InsertData = z4.infer<typeof InsertDataSchema>

  export const UpdateDataSchema = noteUpdateDataSchema
  export type UpdateData = z4.infer<typeof UpdateDataSchema>

  export const DeleteDataSchema = noteDeleteDataSchema
  export type DeleteData = z4.infer<typeof DeleteDataSchema>
}
