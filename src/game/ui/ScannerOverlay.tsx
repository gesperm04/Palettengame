import { useGameStore } from '@/game/store/gameStore'
import { useInteractionStore } from '@/game/store/interactionStore'

export function ScannerOverlay() {
  const contextAction = useInteractionStore((s) => s.contextAction)
  const nearestPalletId = useInteractionStore((s) => s.nearestPalletId)
  const nearestSlotId = useInteractionStore((s) => s.nearestSlotId)
  const pallets = useGameStore((s) => s.pallets)
  const slots = useGameStore((s) => s.slots)
  const carriedPalletId = useGameStore((s) => s.equipment.carriedPalletId)

  const relevantForScan =
    contextAction === 'aufnehmen' || contextAction === 'heben' || contextAction === 'absenken'
  if (!relevantForScan) return null

  const palletId = contextAction === 'absenken' ? carriedPalletId : nearestPalletId
  const pallet = pallets.find((p) => p.id === palletId)
  const slot = slots.find((s) => s.id === nearestSlotId)
  if (!pallet) return null

  return (
    <div className="pointer-events-none absolute left-1/2 top-24 z-20 -translate-x-1/2 rounded-lg border border-warn-yellow/60 bg-industrial-900/90 px-3 py-2 text-center font-mono text-xs text-warn-yellow shadow-lg">
      <div>Palette: {pallet.code}</div>
      {contextAction === 'absenken' && slot && <div>Ziel: {slot.code}</div>}
    </div>
  )
}
