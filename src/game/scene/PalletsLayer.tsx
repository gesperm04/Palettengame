import { useGameStore } from '@/game/store/gameStore'
import { deliveryPosition, slotPosition } from '@/game/constants'
import { PalletMesh } from '@/game/scene/Pallet'

interface PalletsLayerProps {
  nearestPalletId?: string | null
}

export function PalletsLayer({ nearestPalletId = null }: PalletsLayerProps) {
  const pallets = useGameStore((s) => s.pallets)
  const jobs = useGameStore((s) => s.jobs)
  const activePalletIds = new Set(
    jobs.filter((j) => j.status === 'aktiv').flatMap((j) => j.palletIds),
  )

  return (
    <group>
      {pallets.map((pallet) => {
        if (pallet.state === 'getragen') return null
        // pallets on the truck only appear once the related job was accepted
        if (pallet.state === 'wartend' && !activePalletIds.has(pallet.id)) return null
        const position =
          pallet.state === 'eingelagert' && pallet.slotId
            ? (() => {
                const slot = useGameStore.getState().slots.find((s) => s.id === pallet.slotId)
                return slot ? slotPosition(slot.gridX, slot.gridZ) : deliveryPosition(pallet.deliveryIndex)
              })()
            : deliveryPosition(pallet.deliveryIndex)

        return (
          <PalletMesh
            key={pallet.id}
            position={position}
            goods={pallet.goods}
            highlighted={pallet.id === nearestPalletId}
          />
        )
      })}
    </group>
  )
}
