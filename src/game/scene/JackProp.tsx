import { useGameStore } from '@/game/store/gameStore'
import { JACK_PARK_POSITION, JACK_PARK_ROTATION_Y } from '@/game/constants'
import { HandPalletJackMesh } from '@/game/scene/HandPalletJackMesh'

export function JackProp() {
  const hasJack = useGameStore((s) => s.equipment.hasJack)
  if (hasJack) return null

  return (
    <group position={JACK_PARK_POSITION} rotation={[0, JACK_PARK_ROTATION_Y, 0]}>
      <HandPalletJackMesh />
    </group>
  )
}
