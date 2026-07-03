export type PalletGoods = 'mineralwasser' | 'allgemein'

export type PalletState = 'wartend' | 'getragen' | 'eingelagert'

export interface Pallet {
  id: string
  /** scannable code shown by the scanner mechanic, e.g. "PAL-4821" */
  code: string
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
  /** human-readable location code, e.g. "Gang 2 - Platz 03" */
  code: string
  gridX: number
  gridZ: number
  occupiedPalletId: string | null
}

export type JobType = 'einlagerung' | 'umlagerung'

export type JobStatus = 'verfuegbar' | 'aktiv' | 'erledigt' | 'fehlgeschlagen'

export interface Job {
  id: string
  type: JobType
  title: string
  client: string
  description: string
  payout: number
  /** day by which the job must be accepted (if 'verfuegbar') or completed (if 'aktiv') */
  deadlineDay: number
  palletIds: string[]
  status: JobStatus
  /** umlagerung only: palletId -> target storage slot id */
  relocationTargets?: Record<string, string>
}

export interface DailyReport {
  day: number
  income: number
  rent: number
  profit: number
  jobsCompleted: number
  jobsFailed: number
  reputationDelta: number
  cashAfter: number
}

export type ToolType = 'hand' | 'elektro'

export interface EquipmentState {
  /** which tool, if any, the player currently has in hand */
  activeTool: ToolType | null
  /** whether the electric jack has been purchased (the hand jack is owned from the start) */
  ownsElectricJack: boolean
  /** id of the pallet currently lifted, regardless of which jack is carrying it */
  carriedPalletId: string | null
  /** whether the jack forks are currently raised */
  forksRaised: boolean
  handJackPosition: [number, number, number]
  handJackRotationY: number
  electricJackPosition: [number, number, number]
  electricJackRotationY: number
  /** battery charge of the electric jack, 0-100 */
  electricJackBattery: number
}
