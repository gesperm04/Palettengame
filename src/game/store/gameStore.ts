import { create } from 'zustand'
import type { DailyReport, EquipmentState, Job, Pallet, StorageSlot } from '@/game/types'
import {
  JACK_PARK_POSITION,
  JACK_PARK_ROTATION_Y,
  RENT_PER_DAY,
  SLOT_COLS,
  SLOT_ROWS,
  STARTING_CASH,
} from '@/game/constants'
import { generateDailyJob } from '@/game/systems/jobGenerator'

function buildSlots(): StorageSlot[] {
  const slots: StorageSlot[] = []
  for (let row = 0; row < SLOT_ROWS; row++) {
    for (let col = 0; col < SLOT_COLS; col++) {
      slots.push({
        id: `slot-${row}-${col}`,
        code: `Stellplatz ${String(row * SLOT_COLS + col + 1).padStart(2, '0')}`,
        gridX: col,
        gridZ: row,
        occupiedPalletId: null,
      })
    }
  }
  return slots
}

export interface GameState {
  cash: number
  day: number
  rentPerDay: number
  dayEnded: boolean
  jobs: Job[]
  pallets: Pallet[]
  slots: StorageSlot[]
  equipment: EquipmentState
  lastReport: DailyReport | null
  jobBoardOpen: boolean

  acceptJob: (jobId: string) => void
  pickUpJack: () => void
  putDownJack: (position: [number, number, number], rotationY: number) => void
  pickUpPallet: (palletId: string) => void
  placeCarriedPallet: (slotId: string) => void
  endDay: () => void
  startNewDay: () => void
  setJobBoardOpen: (open: boolean) => void
  hydrate: (state: Partial<GameState>) => void
}

function checkJobCompletion(jobs: Job[], pallets: Pallet[]): Job[] {
  return jobs.map((job) => {
    if (job.status !== 'aktiv') return job
    const allStored = job.palletIds.every(
      (id) => pallets.find((p) => p.id === id)?.state === 'eingelagert',
    )
    return allStored ? { ...job, status: 'erledigt' } : job
  })
}

export const useGameStore = create<GameState>((set) => ({
  cash: STARTING_CASH,
  day: 1,
  rentPerDay: RENT_PER_DAY,
  dayEnded: false,
  jobs: [],
  pallets: [],
  slots: buildSlots(),
  equipment: {
    hasJack: false,
    jackPosition: JACK_PARK_POSITION,
    jackRotationY: JACK_PARK_ROTATION_Y,
    carriedPalletId: null,
    forksRaised: false,
  },
  lastReport: null,
  jobBoardOpen: false,

  acceptJob: (jobId) =>
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === jobId && job.status === 'verfuegbar' ? { ...job, status: 'aktiv' } : job,
      ),
    })),

  pickUpJack: () =>
    set((state) =>
      state.equipment.hasJack ? state : { equipment: { ...state.equipment, hasJack: true } },
    ),

  putDownJack: (position, rotationY) =>
    set((state) => {
      if (!state.equipment.hasJack || state.equipment.carriedPalletId) return state
      return {
        equipment: { ...state.equipment, hasJack: false, jackPosition: position, jackRotationY: rotationY },
      }
    }),

  pickUpPallet: (palletId) =>
    set((state) => {
      if (!state.equipment.hasJack || state.equipment.carriedPalletId) return state
      const pallet = state.pallets.find((p) => p.id === palletId)
      if (!pallet || pallet.state !== 'wartend') return state
      return {
        equipment: { ...state.equipment, carriedPalletId: palletId },
        pallets: state.pallets.map((p) =>
          p.id === palletId ? { ...p, state: 'getragen', slotId: null } : p,
        ),
      }
    }),

  placeCarriedPallet: (slotId) =>
    set((state) => {
      const palletId = state.equipment.carriedPalletId
      if (!palletId) return state
      const slot = state.slots.find((s) => s.id === slotId)
      if (!slot || slot.occupiedPalletId) return state

      const pallets = state.pallets.map((p) =>
        p.id === palletId ? { ...p, state: 'eingelagert' as const, slotId } : p,
      )
      const slots = state.slots.map((s) =>
        s.id === slotId ? { ...s, occupiedPalletId: palletId } : s,
      )
      const jobs = checkJobCompletion(state.jobs, pallets)

      return {
        equipment: { ...state.equipment, carriedPalletId: null },
        pallets,
        slots,
        jobs,
      }
    }),

  endDay: () =>
    set((state) => {
      const completedJobs = state.jobs.filter((j) => j.status === 'erledigt')
      const income = completedJobs.reduce((sum, j) => sum + j.payout, 0)
      const rent = state.rentPerDay
      const profit = income - rent
      const cash = state.cash + profit

      const report: DailyReport = {
        day: state.day,
        income,
        rent,
        profit,
        jobsCompleted: completedJobs.length,
        cashAfter: cash,
      }

      return {
        cash,
        dayEnded: true,
        lastReport: report,
        jobs: state.jobs.filter((j) => j.status !== 'erledigt'),
      }
    }),

  startNewDay: () =>
    set((state) => {
      const nextDay = state.day + 1
      const { job, pallets } = generateDailyJob(nextDay)
      return {
        day: nextDay,
        dayEnded: false,
        lastReport: null,
        jobs: [...state.jobs, job],
        pallets: [...state.pallets.filter((p) => p.state !== 'wartend'), ...pallets],
      }
    }),

  setJobBoardOpen: (open) => set({ jobBoardOpen: open }),

  hydrate: (savedState) => set(() => ({ ...savedState })),
}))

export function initGameIfEmpty() {
  const state = useGameStore.getState()
  if (state.jobs.length === 0 && state.pallets.length === 0) {
    const { job, pallets } = generateDailyJob(1)
    useGameStore.setState({ jobs: [job], pallets })
  }
}
