import { useGameStore } from '@/game/store/gameStore'
import { PALLET_DEPTH, PALLET_WIDTH, slotPosition } from '@/game/constants'

export function StorageSlots() {
  const slots = useGameStore((s) => s.slots)

  return (
    <group>
      {slots.map((slot) => {
        const [x, , z] = slotPosition(slot.gridX, slot.gridZ)
        const free = !slot.occupiedPalletId
        return (
          <mesh key={slot.id} position={[x, 0.002, z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[PALLET_WIDTH + 0.2, PALLET_DEPTH + 0.2]} />
            <meshStandardMaterial
              color={free ? '#f5c518' : '#3a3f4a'}
              transparent
              opacity={free ? 0.55 : 0.25}
              roughness={1}
            />
          </mesh>
        )
      })}
    </group>
  )
}
