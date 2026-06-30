export type PalletGoods = 'mineralwasser' | 'allgemein'

export type PalletState = 'wartend' | 'getragen' | 'eingelagert'

export interface Pallet {
  id: string
  goods: PalletGoods
  label: string
  state: PalletState
  /** id of the storage slot the pallet currently occupies, if stored */
  slotId: string | null
  /** spawn position at the delivery zone, used while state === 'wartend' */
  deliveryIndex: number
}

export interface StorageSlot {
  id: string
  code: string
  gridX: number
  gridZ: number
  occupiedPalletId: string | null
}

export type JobType = 'einlagerung'

export type JobStatus = 'verfuegbar' | 'aktiv' | 'erledigt' | 'fehlgeschlagen'

export interface Job {
  id: string
  type: JobType
  title: string
  client: string
  description: string
  payout: number
  deadlineDay: number
  palletIds: string[]
  status: JobStatus
}

export interface DailyReport {
  day: number
  income: number
  rent: number
  profit: number
  jobsCompleted: number
  cashAfter: number
}

export interface EquipmentState {
  /** id of the pallet currently lifted on the hand pallet jack, if any */
  carriedPalletId: string | null
  /** whether the jack forks are currently raised */
  forksRaised: boolean
}
