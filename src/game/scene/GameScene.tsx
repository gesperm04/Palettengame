import { Suspense } from 'react'
import { Physics } from '@react-three/rapier'
import { Garage } from '@/game/scene/Garage'
import { StorageSlots } from '@/game/scene/StorageSlots'
import { PalletsLayer } from '@/game/scene/PalletsLayer'
import { Truck } from '@/game/scene/Truck'
import { ParkedTools } from '@/game/scene/ParkedTools'
import { Lighting } from '@/game/scene/Lighting'
import { Character } from '@/game/player/Character'
import { FollowCamera } from '@/game/player/FollowCamera'
import { PalletJackSystem } from '@/game/player/PalletJackSystem'
import { useInteractionStore } from '@/game/store/interactionStore'

export function GameScene() {
  const nearestPalletId = useInteractionStore((s) => s.nearestPalletId)

  return (
    <Suspense fallback={null}>
      <color attach="background" args={['#1a2230']} />
      <fog attach="fog" args={['#1a2230', 18, 45]} />
      <Lighting />
      <Physics gravity={[0, -9.81, 0]}>
        <Garage />
        <Character />
        <PalletJackSystem />
      </Physics>
      <StorageSlots />
      <PalletsLayer nearestPalletId={nearestPalletId} />
      <Truck />
      <ParkedTools />
      <FollowCamera />
    </Suspense>
  )
}
