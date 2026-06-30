import Dexie, { type EntityTable } from 'dexie'
import type { DailyReport, EquipmentState, Job, Pallet, StorageSlot } from '@/game/types'
import type { PlayerTransform } from '@/game/store/playerTransform'

export interface SaveGame {
  slot: string
  cash: number
  day: number
  rentPerDay: number
  dayEnded: boolean
  jobs: Job[]
  pallets: Pallet[]
  slots: StorageSlot[]
  equipment: EquipmentState
  lastReport: DailyReport | null
  player: PlayerTransform
  savedAt: number
}

const db = new Dexie('palettenchef') as Dexie & {
  saves: EntityTable<SaveGame, 'slot'>
}

db.version(1).stores({
  saves: 'slot',
})

export const SAVE_SLOT = 'default'

export async function writeSave(data: Omit<SaveGame, 'slot' | 'savedAt'>): Promise<void> {
  await db.saves.put({ ...data, slot: SAVE_SLOT, savedAt: Date.now() })
}

export async function readSave(): Promise<SaveGame | undefined> {
  return db.saves.get(SAVE_SLOT)
}

export async function clearSave(): Promise<void> {
  await db.saves.delete(SAVE_SLOT)
}

export default db
