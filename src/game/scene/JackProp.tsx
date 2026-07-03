import { useGameStore } from '@/game/store/gameStore'
import { HandPalletJackMesh } from '@/game/scene/HandPalletJackMesh'

export function JackProp() {
  const hasJack = useGameStore((s) => s.equipment.hasJack)
  const jackPosition = useGameStore((s) => s.equipment.jackPosition)
  const jackRotationY = useGameStore((s) => s.equipment.jackRotationY)
  if (hasJack) return null

  return (
    <group position={jackPosition} rotation={[0, jackRotationY, 0]}>
      <HandPalletJackMesh />
    </group>
  )
}
