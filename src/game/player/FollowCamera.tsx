import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { inputState } from '@/game/input/inputState'
import { cameraState } from '@/game/player/cameraState'
import { playerTransform } from '@/game/store/playerTransform'

const YAW_SENSITIVITY = 0.006
const PITCH_SENSITIVITY = 0.004
const PITCH_MIN = 0.18
const PITCH_MAX = 1.2
const LOOK_HEIGHT = 1.3

const desiredPos = new THREE.Vector3()
const lookTarget = new THREE.Vector3()
const camOffset = new THREE.Vector3()

export function FollowCamera() {
  const { camera } = useThree()

  useFrame((_, delta) => {
    cameraState.yaw -= inputState.cameraYawDelta * YAW_SENSITIVITY
    cameraState.pitch = THREE.MathUtils.clamp(
      cameraState.pitch - inputState.cameraPitchDelta * PITCH_SENSITIVITY,
      PITCH_MIN,
      PITCH_MAX,
    )
    inputState.cameraYawDelta = 0
    inputState.cameraPitchDelta = 0

    const [px, py, pz] = playerTransform.position
    const { yaw, pitch, distance } = cameraState

    camOffset.set(
      Math.sin(yaw) * Math.cos(pitch) * distance,
      Math.sin(pitch) * distance,
      Math.cos(yaw) * Math.cos(pitch) * distance,
    )

    desiredPos.set(px + camOffset.x, py + camOffset.y + 0.5, pz + camOffset.z)
    const lerpFactor = 1 - Math.pow(0.001, delta)
    camera.position.lerp(desiredPos, lerpFactor)

    lookTarget.set(px, py + LOOK_HEIGHT, pz)
    camera.lookAt(lookTarget)
  })

  return null
}
