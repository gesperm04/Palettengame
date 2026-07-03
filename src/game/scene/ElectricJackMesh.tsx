import { PALLET_HEIGHT } from '@/game/constants'

// Local -Z is the tiller/handle side (stays near the player), local +Z is the
// fork side (points forward, away from the player).
export function ElectricJackMesh() {
  return (
    <>
      {/* chassis with battery pack */}
      <mesh position={[0, 0.16, -0.55]} castShadow>
        <boxGeometry args={[0.5, 0.3, 0.4]} />
        <meshStandardMaterial color="#1f6feb" roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.34, -0.55]} castShadow>
        <boxGeometry args={[0.34, 0.1, 0.28]} />
        <meshStandardMaterial color="#9aa3ad" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* forks */}
      <mesh position={[-0.16, PALLET_HEIGHT / 2, 0.2]} castShadow>
        <boxGeometry args={[0.1, 0.07, 1.2]} />
        <meshStandardMaterial color="#2b2b2b" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0.16, PALLET_HEIGHT / 2, 0.2]} castShadow>
        <boxGeometry args={[0.1, 0.07, 1.2]} />
        <meshStandardMaterial color="#2b2b2b" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* tiller with control head */}
      <mesh position={[0, 0.8, -0.95]} rotation={[-0.35, 0, 0]} castShadow>
        <boxGeometry args={[0.36, 0.06, 0.06]} />
        <meshStandardMaterial color="#181818" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, 1.0, -1.05]} castShadow>
        <boxGeometry args={[0.22, 0.14, 0.08]} />
        <meshStandardMaterial color="#f5c518" roughness={0.5} />
      </mesh>
    </>
  )
}
