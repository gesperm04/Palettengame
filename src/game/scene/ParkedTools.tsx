import { useGameStore } from '@/game/store/gameStore'
import { HandPalletJackMesh } from '@/game/scene/HandPalletJackMesh'
import { ElectricJackMesh } from '@/game/scene/ElectricJackMesh'

export function ParkedTools() {
  const activeTool = useGameStore((s) => s.equipment.activeTool)
  const ownsElectricJack = useGameStore((s) => s.equipment.ownsElectricJack)
  const handJackPosition = useGameStore((s) => s.equipment.handJackPosition)
  const handJackRotationY = useGameStore((s) => s.equipment.handJackRotationY)
  const electricJackPosition = useGameStore((s) => s.equipment.electricJackPosition)
  const electricJackRotationY = useGameStore((s) => s.equipment.electricJackRotationY)

  return (
    <>
      {activeTool !== 'hand' && (
        <group position={handJackPosition} rotation={[0, handJackRotationY, 0]}>
          <HandPalletJackMesh />
        </group>
      )}
      {ownsElectricJack && activeTool !== 'elektro' && (
        <group position={electricJackPosition} rotation={[0, electricJackRotationY, 0]}>
          <ElectricJackMesh />
        </group>
      )}
    </>
  )
}
