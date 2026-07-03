import { create } from 'zustand'
import type { DailyReport, EquipmentState, Job, Pallet, StorageSlot, ToolType } from '@/game/types'
import {
  BANKRUPTCY_DEBT_THRESHOLD,
  ELECTRIC_JACK_BATTERY_MAX,
  ELECTRIC_JACK_PARK_POSITION,
  ELECTRIC_JACK_PARK_ROTATION_Y,
  ELECTRIC_JACK_PRICE,
  ELECTRIC_JACK_RECHARGE_PER_DAY,
  JACK_PARK_POSITION,
  JACK_PARK_ROTATION_Y,
  RENT_PER_DAY,
  REPUTATION_GAIN_PER_JOB,
  REPUTATION_LOSS_PER_FAILED_JOB,
  REPUTATION_MAX,
  REPUTATION_START,
  SLOT_COLS,
  SLOT_ROWS,
  STARTING_CASH,
} from '@/game/constants'
import { generateJobsForDay, maxActiveJobs } from '@/game/systems/jobGenerator'

function buildSlots(): StorageSlot[] {
  const slots: StorageSlot[] = []
  for (let row = 0; row < SLOT_ROWS; row++) {
    for (let col = 0; col < SLOT_COLS; col++) {
      slots.push({
        id: `slot-${row}-${col}`,
        code: `Gang ${row + 1} - Platz ${String(col + 1).padStart(2, '0')}`,
        gridX: col,
        gridZ: row,
        occupiedPalletId: null,
      })
    }
  }
  return slots
}

export function buildInitialEquipment(): EquipmentState {
  return {
    activeTool: null,
    ownsElectricJack: false,
    carriedPalletId: null,
    forksRaised: false,
    handJackPosition: JACK_PARK_POSITION,
    handJackRotationY: JACK_PARK_ROTATION_Y,
    electricJackPosition: ELECTRIC_JACK_PARK_POSITION,
    electricJackRotationY: ELECTRIC_JACK_PARK_ROTATION_Y,
    electricJackBattery: ELECTRIC_JACK_BATTERY_MAX,
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

export interface GameState {
  cash: number
  day: number
  rentPerDay: number
  reputation: number
  dayEnded: boolean
  bankrupt: boolean
  jobs: Job[]
  pallets: Pallet[]
  slots: StorageSlot[]
  equipment: EquipmentState
  lastReport: DailyReport | null
  jobBoardOpen: boolean
  equipmentShopOpen: boolean

  acceptJob: (jobId: string) => void
  pickUpTool: (tool: ToolType) => void
  putDownTool: (position: [number, number, number], rotationY: number) => void
  buyElectricJack: () => void
  pickUpPallet: (palletId: string) => void
  placeCarriedPallet: (slotId: string) => void
  endDay: () => void
  startNewDay: () => void
  restartAfterBankruptcy: () => void
  setJobBoardOpen: (open: boolean) => void
  setEquipmentShopOpen: (open: boolean) => void
  hydrate: (state: Partial<GameState>) => void
}

export function isJobPalletDone(job: Job, pallets: Pallet[], palletId: string): boolean {
  const pallet = pallets.find((p) => p.id === palletId)
  if (!pallet || pallet.state !== 'eingelagert') return false
  if (job.type === 'umlagerung') {
    // done once it's stored somewhere other than where it started
    return job.originalSlots?.[palletId] !== pallet.slotId
  }
  return true
}

function checkJobCompletion(jobs: Job[], pallets: Pallet[]): Job[] {
  return jobs.map((job) => {
    if (job.status !== 'aktiv') return job
    const allDone = job.palletIds.every((id) => isJobPalletDone(job, pallets, id))
    return allDone ? { ...job, status: 'erledigt' } : job
  })
}

export const useGameStore = create<GameState>((set) => ({
  cash: STARTING_CASH,
  day: 1,
  rentPerDay: RENT_PER_DAY,
  reputation: REPUTATION_START,
  dayEnded: false,
  bankrupt: false,
  jobs: [],
  pallets: [],
  slots: buildSlots(),
  equipment: buildInitialEquipment(),
  lastReport: null,
  jobBoardOpen: false,
  equipmentShopOpen: false,

  acceptJob: (jobId) =>
    set((state) => {
      const activeCount = state.jobs.filter((j) => j.status === 'aktiv').length
      if (activeCount >= maxActiveJobs(state.reputation)) return state
      return {
        jobs: state.jobs.map((job) =>
          job.id === jobId && job.status === 'verfuegbar' ? { ...job, status: 'aktiv' } : job,
        ),
      }
    }),

  pickUpTool: (tool) =>
    set((state) => {
      if (state.equipment.activeTool) return state
      if (tool === 'elektro' && !state.equipment.ownsElectricJack) return state
      return { equipment: { ...state.equipment, activeTool: tool } }
    }),

  putDownTool: (position, rotationY) =>
    set((state) => {
      const tool = state.equipment.activeTool
      if (!tool || state.equipment.carriedPalletId) return state
      if (tool === 'hand') {
        return {
          equipment: {
            ...state.equipment,
            activeTool: null,
            handJackPosition: position,
            handJackRotationY: rotationY,
          },
        }
      }
      return {
        equipment: {
          ...state.equipment,
          activeTool: null,
          electricJackPosition: position,
          electricJackRotationY: rotationY,
        },
      }
    }),

  buyElectricJack: () =>
    set((state) => {
      if (state.equipment.ownsElectricJack || state.cash < ELECTRIC_JACK_PRICE) return state
      return {
        cash: state.cash - ELECTRIC_JACK_PRICE,
        equipment: { ...state.equipment, ownsElectricJack: true },
      }
    }),

  pickUpPallet: (palletId) =>
    set((state) => {
      if (!state.equipment.activeTool || state.equipment.carriedPalletId) return state
      const pallet = state.pallets.find((p) => p.id === palletId)
      if (!pallet) return state

      if (pallet.state === 'wartend') {
        return {
          equipment: { ...state.equipment, carriedPalletId: palletId },
          pallets: state.pallets.map((p) =>
            p.id === palletId ? { ...p, state: 'getragen', slotId: null } : p,
          ),
        }
      }
      if (pallet.state === 'eingelagert') {
        const oldSlotId = pallet.slotId
        return {
          equipment: { ...state.equipment, carriedPalletId: palletId },
          pallets: state.pallets.map((p) =>
            p.id === palletId ? { ...p, state: 'getragen', slotId: null } : p,
          ),
          slots: state.slots.map((s) => (s.id === oldSlotId ? { ...s, occupiedPalletId: null } : s)),
        }
      }
      return state
    }),

  placeCarriedPallet: (slotId) =>
    set((state) => {
      const palletId = state.equipment.carriedPalletId
      if (!palletId) return state
      const slot = state.slots.find((s) => s.id === slotId)
      if (!slot || slot.occupiedPalletId) return state

      const usedElectric = state.equipment.activeTool === 'elektro'
      const pallets = state.pallets.map((p) =>
        p.id === palletId ? { ...p, state: 'eingelagert' as const, slotId } : p,
      )
      const slots = state.slots.map((s) =>
        s.id === slotId ? { ...s, occupiedPalletId: palletId } : s,
      )
      const jobs = checkJobCompletion(state.jobs, pallets)

      return {
        equipment: {
          ...state.equipment,
          carriedPalletId: null,
          electricJackBattery: usedElectric
            ? clamp(state.equipment.electricJackBattery - 6, 0, ELECTRIC_JACK_BATTERY_MAX)
            : state.equipment.electricJackBattery,
        },
        pallets,
        slots,
        jobs,
      }
    }),

  endDay: () =>
    set((state) => {
      const completedJobs = state.jobs.filter((j) => j.status === 'erledigt')
      const failedJobs = state.jobs.filter(
        (j) => j.status === 'aktiv' && j.deadlineDay <= state.day,
      )
      const income = completedJobs.reduce((sum, j) => sum + j.payout, 0)
      const rent = state.rentPerDay
      const profit = income - rent
      const cash = state.cash + profit

      const reputationDelta =
        completedJobs.length * REPUTATION_GAIN_PER_JOB - failedJobs.length * REPUTATION_LOSS_PER_FAILED_JOB
      const reputation = clamp(state.reputation + reputationDelta, 0, REPUTATION_MAX)

      const removedJobIds = new Set([...completedJobs, ...failedJobs].map((j) => j.id))
      const remainingJobs = state.jobs
        .filter((j) => !removedJobIds.has(j.id))
        .filter((j) => !(j.status === 'verfuegbar' && j.deadlineDay <= state.day))

      const remainingJobIds = new Set(remainingJobs.flatMap((j) => j.palletIds))
      const pallets = state.pallets.filter((p) => p.state !== 'wartend' || remainingJobIds.has(p.id))

      const report: DailyReport = {
        day: state.day,
        income,
        rent,
        profit,
        jobsCompleted: completedJobs.length,
        jobsFailed: failedJobs.length,
        reputationDelta,
        cashAfter: cash,
      }

      const bankrupt = cash < BANKRUPTCY_DEBT_THRESHOLD

      return {
        cash,
        reputation,
        dayEnded: true,
        bankrupt,
        lastReport: report,
        jobs: remainingJobs,
        pallets,
        equipment: {
          ...state.equipment,
          electricJackBattery: clamp(
            state.equipment.electricJackBattery + ELECTRIC_JACK_RECHARGE_PER_DAY,
            0,
            ELECTRIC_JACK_BATTERY_MAX,
          ),
        },
      }
    }),

  startNewDay: () =>
    set((state) => {
      const nextDay = state.day + 1
      const existingWaitingCount = state.pallets.filter((p) => p.state === 'wartend').length
      const storedPallets = state.pallets.filter((p) => p.state === 'eingelagert')
      const { jobs: newJobs, pallets: newPallets } = generateJobsForDay(
        nextDay,
        state.reputation,
        existingWaitingCount,
        storedPallets,
      )
      return {
        day: nextDay,
        dayEnded: false,
        lastReport: null,
        jobs: [...state.jobs, ...newJobs],
        pallets: [...state.pallets, ...newPallets],
      }
    }),

  restartAfterBankruptcy: () =>
    set(() => {
      const slots = buildSlots()
      const { jobs, pallets } = generateJobsForDay(1, REPUTATION_START, 0, [])
      return {
        cash: STARTING_CASH,
        day: 1,
        rentPerDay: RENT_PER_DAY,
        reputation: REPUTATION_START,
        dayEnded: false,
        bankrupt: false,
        jobs,
        pallets,
        slots,
        equipment: buildInitialEquipment(),
        lastReport: null,
        jobBoardOpen: false,
        equipmentShopOpen: false,
      }
    }),

  setJobBoardOpen: (open) => set({ jobBoardOpen: open }),
  setEquipmentShopOpen: (open) => set({ equipmentShopOpen: open }),

  hydrate: (savedState) => set(() => ({ ...savedState })),
}))

export function initGameIfEmpty() {
  const state = useGameStore.getState()
  if (state.jobs.length === 0 && state.pallets.length === 0) {
    const { jobs, pallets } = generateJobsForDay(1, state.reputation, 0, [])
    useGameStore.setState({ jobs, pallets })
  }
}

if (import.meta.env.DEV) {
  ;(window as unknown as { __gameStore: typeof useGameStore }).__gameStore = useGameStore
}
