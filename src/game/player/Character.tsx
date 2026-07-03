import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RigidBody, CapsuleCollider, type RapierRigidBody } from '@react-three/rapier'
import * as THREE from 'three'
import { inputState } from '@/game/input/inputState'
import { cameraState } from '@/game/player/cameraState'
import { playerTransform } from '@/game/store/playerTransform'
import { useGameStore } from '@/game/store/gameStore'

const WALK_SPEED = 3.2
const CARRY_SPEED = 2.1
const ELECTRIC_CARRY_SPEED = 2.8
const TURN_LERP = 0.22

// safety net: if the player ever falls off the map (e.g. through a collision
// gap), teleport them back to a safe spot instead of free-falling forever
const FALL_RESET_Y = -8
const SAFE_RESPAWN_POSITION = { x: 0, y: 0.1, z: 2 }

const tmpDir = new THREE.Vector3()
const tmpForward = new THREE.Vector3()
const tmpRight = new THREE.Vector3()

export function Character() {
  const bodyRef = useRef<RapierRigidBody>(null)
  const visualRef = useRef<THREE.Group>(null)
  const facingRef = useRef(playerTransform.rotationY)

  useFrame(() => {
    const body = bodyRef.current
    if (!body) return

    if (body.translation().y < FALL_RESET_Y) {
      body.setTranslation(SAFE_RESPAWN_POSITION, true)
      body.setLinvel({ x: 0, y: 0, z: 0 }, true)
      facingRef.current = 0
      playerTransform.position = [SAFE_RESPAWN_POSITION.x, SAFE_RESPAWN_POSITION.y, SAFE_RESPAWN_POSITION.z]
      playerTransform.rotationY = 0
      return
    }

    const equipment = useGameStore.getState().equipment
    const carrying = !!equipment.carriedPalletId
    const speed = carrying ? (equipment.activeTool === 'elektro' ? ELECTRIC_CARRY_SPEED : CARRY_SPEED) : WALK_SPEED

    const moveX = inputState.moveX
    const moveZ = inputState.moveZ
    const magnitude = Math.min(1, Math.hypot(moveX, moveZ))

    // points away from the camera, i.e. the direction the camera is looking
    tmpForward.set(-Math.sin(cameraState.yaw), 0, -Math.cos(cameraState.yaw))
    tmpRight.set(-tmpForward.z, 0, tmpForward.x)
    tmpDir
      .set(0, 0, 0)
      .addScaledVector(tmpRight, moveX)
      .addScaledVector(tmpForward, -moveZ)

    const linvel = body.linvel()
    if (magnitude > 0.02) {
      tmpDir.normalize().multiplyScalar(speed * magnitude)
      body.setLinvel({ x: tmpDir.x, y: linvel.y, z: tmpDir.z }, true)
      facingRef.current = Math.atan2(tmpDir.x, tmpDir.z)
    } else {
      body.setLinvel({ x: 0, y: linvel.y, z: 0 }, true)
    }

    const translation = body.translation()
    playerTransform.position = [translation.x, translation.y, translation.z]
    playerTransform.rotationY = facingRef.current

    if (visualRef.current) {
      let current = visualRef.current.rotation.y
      let target = facingRef.current
      let diff = target - current
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      visualRef.current.rotation.y = current + diff * TURN_LERP
    }
  })

  return (
    <RigidBody
      ref={bodyRef}
      colliders={false}
      mass={1}
      friction={0.2}
      linearDamping={4}
      enabledRotations={[false, false, false]}
      position={playerTransform.position}
      canSleep={false}
    >
      <CapsuleCollider args={[0.55, 0.3]} position={[0, 0.85, 0]} />
      <group ref={visualRef}>
        {/* legs */}
        <mesh castShadow position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.18, 0.2, 0.9, 10]} />
          <meshStandardMaterial color="#2b2f38" roughness={0.85} />
        </mesh>
        {/* torso / hi-vis vest */}
        <mesh castShadow position={[0, 1.05, 0]}>
          <capsuleGeometry args={[0.24, 0.5, 4, 10]} />
          <meshStandardMaterial color="#f5c518" roughness={0.7} />
        </mesh>
        {/* head */}
        <mesh castShadow position={[0, 1.62, 0]}>
          <sphereGeometry args={[0.16, 12, 12]} />
          <meshStandardMaterial color="#e3b48a" roughness={0.8} />
        </mesh>
        {/* hard hat */}
        <mesh castShadow position={[0, 1.73, 0]}>
          <sphereGeometry args={[0.18, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#f5c518" roughness={0.5} />
        </mesh>
        {/* facing indicator (nose direction) */}
        <mesh position={[0, 1.62, 0.18]}>
          <boxGeometry args={[0.06, 0.06, 0.08]} />
          <meshStandardMaterial color="#1d2026" />
        </mesh>
      </group>
    </RigidBody>
  )
}
