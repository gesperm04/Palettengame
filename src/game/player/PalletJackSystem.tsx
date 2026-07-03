import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { playerTransform } from '@/game/store/playerTransform'
import { useGameStore } from '@/game/store/gameStore'
import { useInteractionStore } from '@/game/store/interactionStore'
import { consumeAction } from '@/game/input/inputState'
import { deliveryPosition, slotPosition, JACK_PICKUP_RANGE } from '@/game/constants'
import { PalletMesh } from '@/game/scene/Pallet'
import { HandPalletJackMesh } from '@/game/scene/HandPalletJackMesh'
import { ElectricJackMesh } from '@/game/scene/ElectricJackMesh'
import type { Job, ToolType } from '@/game/types'

const PICKUP_RANGE = 1.7
const PLACE_RANGE = 1.9
const JACK_OFFSET = 0.95
const LIFT_HEIGHT = 0.18
const HAND_PUMP_STEPS = 3
const ELECTRIC_PUMP_STEPS = 1

type JackState = 'free' | 'attached' | 'carrying'

export function PalletJackSystem() {
  const jackVisualRef = useRef<THREE.Group>(null)
  const jackStateRef = useRef<JackState>('free')
  const attachedPalletIdRef = useRef<string | null>(null)
  const liftProgressRef = useRef(0)

  useFrame(() => {
    const { x: px, y: py, z: pz } = pos(playerTransform.position)
    const facing = playerTransform.rotationY
    const jackState = jackStateRef.current

    const interaction = useInteractionStore.getState()
    const triggered = consumeAction()
    const equipment = useGameStore.getState().equipment
    const activeTool = equipment.activeTool
    const pumpSteps = activeTool === 'elektro' ? ELECTRIC_PUMP_STEPS : HAND_PUMP_STEPS

    if (!activeTool) {
      const candidates: { tool: ToolType; position: [number, number, number] }[] = [
        { tool: 'hand', position: equipment.handJackPosition },
      ]
      if (equipment.ownsElectricJack) {
        candidates.push({ tool: 'elektro', position: equipment.electricJackPosition })
      }
      let nearestTool: ToolType | null = null
      let nearestDist = Infinity
      for (const c of candidates) {
        const d = Math.hypot(c.position[0] - px, c.position[2] - pz)
        if (d < nearestDist) {
          nearestDist = d
          nearestTool = c.tool
        }
      }
      const inRange = nearestTool !== null && nearestDist <= JACK_PICKUP_RANGE
      interaction.setContext(inRange ? 'hubwagen_nehmen' : null, null, null)
      interaction.setLiftProgress(0)
      if (triggered && inRange && nearestTool) {
        useGameStore.getState().pickUpTool(nearestTool)
      }
    } else if (jackState === 'free') {
      const { pallets, jobs, slots } = useGameStore.getState()
      const activeJobByPallet = new Map<string, Job>()
      for (const job of jobs) {
        if (job.status !== 'aktiv') continue
        for (const id of job.palletIds) activeJobByPallet.set(id, job)
      }

      let nearestId: string | null = null
      let nearestDist = Infinity
      for (const p of pallets) {
        const job = activeJobByPallet.get(p.id)
        if (!job) continue
        if (p.state === 'wartend') {
          const [x, , z] = deliveryPosition(p.deliveryIndex)
          const d = Math.hypot(x - px, z - pz)
          if (d < nearestDist) {
            nearestDist = d
            nearestId = p.id
          }
        } else if (
          p.state === 'eingelagert' &&
          job.type === 'umlagerung' &&
          job.relocationTargets?.[p.id] !== p.slotId
        ) {
          const slot = slots.find((s) => s.id === p.slotId)
          if (!slot) continue
          const [x, , z] = slotPosition(slot.gridX, slot.gridZ)
          const d = Math.hypot(x - px, z - pz)
          if (d < nearestDist) {
            nearestDist = d
            nearestId = p.id
          }
        }
      }

      const batteryOk = activeTool !== 'elektro' || equipment.electricJackBattery > 0
      const inRange = nearestId !== null && nearestDist <= PICKUP_RANGE && batteryOk

      if (inRange && nearestId) {
        interaction.setContext('aufnehmen', nearestId, null)
        interaction.setLiftProgress(0)
        if (triggered) {
          jackStateRef.current = 'attached'
          attachedPalletIdRef.current = nearestId
          liftProgressRef.current = 0
        }
      } else {
        interaction.setContext('hubwagen_abstellen', null, null)
        interaction.setLiftProgress(0)
        if (triggered) {
          const parkX = px + Math.sin(facing) * JACK_OFFSET
          const parkZ = pz + Math.cos(facing) * JACK_OFFSET
          useGameStore.getState().putDownTool([parkX, py, parkZ], facing)
        }
      }
    } else if (jackState === 'attached') {
      interaction.setContext('heben', attachedPalletIdRef.current, null)
      interaction.setLiftProgress(liftProgressRef.current)

      if (triggered) {
        liftProgressRef.current = Math.min(1, liftProgressRef.current + 1 / pumpSteps)
        if (liftProgressRef.current >= 1) {
          const palletId = attachedPalletIdRef.current
          if (palletId) useGameStore.getState().pickUpPallet(palletId)
          jackStateRef.current = 'carrying'
          interaction.setLiftProgress(0)
        }
      }
    } else if (jackState === 'carrying') {
      const slots = useGameStore.getState().slots
      let nearestId: string | null = null
      let nearestDist = Infinity
      for (const s of slots) {
        if (s.occupiedPalletId) continue
        const [x, , z] = slotPosition(s.gridX, s.gridZ)
        const d = Math.hypot(x - px, z - pz)
        if (d < nearestDist) {
          nearestDist = d
          nearestId = s.id
        }
      }
      const inRange = nearestId !== null && nearestDist <= PLACE_RANGE
      interaction.setContext(inRange ? 'absenken' : null, attachedPalletIdRef.current, inRange ? nearestId : null)

      if (triggered && inRange && nearestId) {
        useGameStore.getState().placeCarriedPallet(nearestId)
        jackStateRef.current = 'free'
        attachedPalletIdRef.current = null
        interaction.setLiftProgress(0)
      }
    }

    // position the jack + carried pallet visual in front of the player
    const group = jackVisualRef.current
    if (group) {
      const visible = !!activeTool
      group.visible = visible
      if (visible) {
        const offsetX = Math.sin(facing) * JACK_OFFSET
        const offsetZ = Math.cos(facing) * JACK_OFFSET
        group.position.set(px + offsetX, py, pz + offsetZ)
        group.rotation.y = facing
        const lift =
          jackState === 'attached' ? liftProgressRef.current * LIFT_HEIGHT : jackState === 'carrying' ? LIFT_HEIGHT : 0
        group.position.y = py + lift
      }
    }
  })

  const carriedPallet = useGameStore((s) =>
    s.equipment.carriedPalletId ? s.pallets.find((p) => p.id === s.equipment.carriedPalletId) : null,
  )
  const activeTool = useGameStore((s) => s.equipment.activeTool)

  return (
    <group ref={jackVisualRef} visible={false}>
      {activeTool === 'elektro' ? <ElectricJackMesh /> : <HandPalletJackMesh />}

      {carriedPallet && (
        <group position={[0, 0, 0.15]}>
          <PalletMesh position={[0, 0, 0]} goods={carriedPallet.goods} />
        </group>
      )}
    </group>
  )
}

function pos(p: [number, number, number]) {
  return { x: p[0], y: p[1], z: p[2] }
}
