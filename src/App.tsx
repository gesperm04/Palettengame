import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { GameScene } from '@/game/scene/GameScene'
import { HUD } from '@/game/ui/HUD'
import { TouchControls } from '@/game/ui/TouchControls'
import { JobBoard } from '@/game/ui/JobBoard'
import { EquipmentShop } from '@/game/ui/EquipmentShop'
import { ScannerOverlay } from '@/game/ui/ScannerOverlay'
import { DayEndReport } from '@/game/ui/DayEndReport'
import { BankruptcyScreen } from '@/game/ui/BankruptcyScreen'
import { initGameIfEmpty, useGameStore } from '@/game/store/gameStore'
import { initAutosave, loadSavedGame } from '@/game/persistence/saveGame'

function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const loaded = await loadSavedGame()
      if (cancelled) return
      if (!loaded) initGameIfEmpty()
      initAutosave()
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (!ready) return <LoadingScreen />

  return (
    <div className="relative h-full w-full overflow-hidden bg-industrial-900">
      <Canvas shadows camera={{ fov: 55, near: 0.1, far: 100 }}>
        <GameScene />
      </Canvas>
      <HUD />
      <TouchControls />
      <ScannerOverlay />
      <JobBoard />
      <EquipmentShop />
      <DayEndReport />
      <BankruptcyScreen />
    </div>
  )
}

function LoadingScreen() {
  const day = useGameStore.getState().day
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-industrial-900 text-warn-yellow">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-warn-yellow border-t-transparent" />
      <p className="text-sm tracking-wide text-industrial-600">Lager wird vorbereitet… (Tag {day})</p>
    </div>
  )
}

export default App
