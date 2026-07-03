import { RigidBody } from '@react-three/rapier'
import { GARAGE_DEPTH, GARAGE_WIDTH, GATE_WIDTH } from '@/game/constants'

const WALL_HEIGHT = 4.5
const WALL_THICKNESS = 0.3
const halfW = GARAGE_WIDTH / 2
const halfD = GARAGE_DEPTH / 2
const gateHalf = GATE_WIDTH / 2
const sidePostWidth = halfW - gateHalf

// apron dimensions must match the floor mesh below
const APRON_DEPTH = 8
const APRON_HALF_WIDTH = halfW + 3
const APRON_NEAR_Z = halfD
const APRON_FAR_Z = halfD + APRON_DEPTH
const FENCE_HEIGHT = 1.1
const FENCE_THICKNESS = 0.12

export function Garage() {
  return (
    <group>
      {/* floor */}
      <RigidBody type="fixed" colliders="cuboid" friction={1}>
        <mesh receiveShadow position={[0, -0.05, 0]}>
          <boxGeometry args={[GARAGE_WIDTH, 0.1, GARAGE_DEPTH]} />
          <meshStandardMaterial color="#6b6f76" roughness={0.95} />
        </mesh>
      </RigidBody>

      {/* apron outside the gate */}
      <RigidBody type="fixed" colliders="cuboid" friction={1}>
        <mesh receiveShadow position={[0, -0.05, halfD + 4]}>
          <boxGeometry args={[GARAGE_WIDTH + 6, 0.1, 8]} />
          <meshStandardMaterial color="#54585e" roughness={1} />
        </mesh>
      </RigidBody>

      {/* back wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[0, WALL_HEIGHT / 2, -halfD - WALL_THICKNESS / 2]}>
          <boxGeometry args={[GARAGE_WIDTH + WALL_THICKNESS * 2, WALL_HEIGHT, WALL_THICKNESS]} />
          <meshStandardMaterial color="#cfd2d6" roughness={0.85} />
        </mesh>
      </RigidBody>

      {/* left wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[-halfW - WALL_THICKNESS / 2, WALL_HEIGHT / 2, 0]}>
          <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, GARAGE_DEPTH]} />
          <meshStandardMaterial color="#cfd2d6" roughness={0.85} />
        </mesh>
      </RigidBody>

      {/* right wall */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow receiveShadow position={[halfW + WALL_THICKNESS / 2, WALL_HEIGHT / 2, 0]}>
          <boxGeometry args={[WALL_THICKNESS, WALL_HEIGHT, GARAGE_DEPTH]} />
          <meshStandardMaterial color="#cfd2d6" roughness={0.85} />
        </mesh>
      </RigidBody>

      {/* front wall posts either side of the open gate */}
      {sidePostWidth > 0.1 && (
        <>
          <RigidBody type="fixed" colliders="cuboid">
            <mesh
              castShadow
              receiveShadow
              position={[-(gateHalf + sidePostWidth / 2), WALL_HEIGHT / 2, halfD + WALL_THICKNESS / 2]}
            >
              <boxGeometry args={[sidePostWidth, WALL_HEIGHT, WALL_THICKNESS]} />
              <meshStandardMaterial color="#cfd2d6" roughness={0.85} />
            </mesh>
          </RigidBody>
          <RigidBody type="fixed" colliders="cuboid">
            <mesh
              castShadow
              receiveShadow
              position={[gateHalf + sidePostWidth / 2, WALL_HEIGHT / 2, halfD + WALL_THICKNESS / 2]}
            >
              <boxGeometry args={[sidePostWidth, WALL_HEIGHT, WALL_THICKNESS]} />
              <meshStandardMaterial color="#cfd2d6" roughness={0.85} />
            </mesh>
          </RigidBody>
        </>
      )}

      {/* gate header / lintel */}
      <mesh castShadow position={[0, WALL_HEIGHT - 0.25, halfD + WALL_THICKNESS / 2]}>
        <boxGeometry args={[GATE_WIDTH, 0.6, WALL_THICKNESS]} />
        <meshStandardMaterial color="#f5c518" roughness={0.6} />
      </mesh>

      {/* warning stripes on the floor at the gate threshold */}
      <mesh position={[0, 0.001, halfD - 0.1]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[GATE_WIDTH, 0.4]} />
        <meshStandardMaterial color="#f5c518" roughness={0.9} />
      </mesh>

      {/* perimeter fence around the apron so the player can't walk off the edge */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          castShadow
          position={[-APRON_HALF_WIDTH, FENCE_HEIGHT / 2, APRON_NEAR_Z + APRON_DEPTH / 2]}
        >
          <boxGeometry args={[FENCE_THICKNESS, FENCE_HEIGHT, APRON_DEPTH]} />
          <meshStandardMaterial color="#f5c518" roughness={0.7} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh
          castShadow
          position={[APRON_HALF_WIDTH, FENCE_HEIGHT / 2, APRON_NEAR_Z + APRON_DEPTH / 2]}
        >
          <boxGeometry args={[FENCE_THICKNESS, FENCE_HEIGHT, APRON_DEPTH]} />
          <meshStandardMaterial color="#f5c518" roughness={0.7} />
        </mesh>
      </RigidBody>
      <RigidBody type="fixed" colliders="cuboid">
        <mesh castShadow position={[0, FENCE_HEIGHT / 2, APRON_FAR_Z]}>
          <boxGeometry args={[APRON_HALF_WIDTH * 2, FENCE_HEIGHT, FENCE_THICKNESS]} />
          <meshStandardMaterial color="#f5c518" roughness={0.7} />
        </mesh>
      </RigidBody>
    </group>
  )
}
