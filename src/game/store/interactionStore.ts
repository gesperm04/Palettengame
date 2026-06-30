import { create } from 'zustand'

export type ContextAction = 'aufnehmen' | 'heben' | 'absenken' | 'ablegen' | null

interface InteractionState {
  contextAction: ContextAction
  nearestPalletId: string | null
  nearestSlotId: string | null
  liftProgress: number
  setContext: (action: ContextAction, palletId: string | null, slotId: string | null) => void
  setLiftProgress: (progress: number) => void
}

export const useInteractionStore = create<InteractionState>((set, get) => ({
  contextAction: null,
  nearestPalletId: null,
  nearestSlotId: null,
  liftProgress: 0,
  setContext: (contextAction, nearestPalletId, nearestSlotId) => {
    const s = get()
    if (
      s.contextAction === contextAction &&
      s.nearestPalletId === nearestPalletId &&
      s.nearestSlotId === nearestSlotId
    ) {
      return
    }
    set({ contextAction, nearestPalletId, nearestSlotId })
  },
  setLiftProgress: (liftProgress) => {
    if (get().liftProgress === liftProgress) return
    set({ liftProgress })
  },
}))
