import { PALLET_HEIGHT } from '@/game/constants'

export function HandPalletJackMesh() {
  return (
    <>
      {/* chassis */}
      <mesh position={[0, 0.1, 0.5]} castShadow>
        <boxGeometry args={[0.55, 0.18, 0.25]} />
        <meshStandardMaterial color="#d8232a" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* forks */}
      <mesh position={[-0.16, PALLET_HEIGHT / 2, -0.15]} castShadow>
        <boxGeometry args={[0.12, 0.08, 1.1]} />
        <meshStandardMaterial color="#2b2b2b" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0.16, PALLET_HEIGHT / 2, -0.15]} castShadow>
        <boxGeometry args={[0.12, 0.08, 1.1]} />
        <meshStandardMaterial color="#2b2b2b" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* tiller / steering handle */}
      <mesh position={[0, 0.75, 0.85]} rotation={[0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.06, 0.06]} />
        <meshStandardMaterial color="#181818" roughness={0.7} />
      </mesh>
    </>
  )
}
